/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersPanel = Ext.extend(Ext.tree.TreePanel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            title: "Active Layers<br><i><small>No layers added to map</small></i>",
            id: 'activeLayerTreePanel',
            enableDD: true,
            useArrows: true,
            rootVisible: false,

            root: new GeoExt.tree.OverlayLayerContainer({
                layerStore: cfg.layerStore,
                leaf: false,
                expanded: true,
                loader: new GeoExt.tree.LayerLoader({
                    filter: function(record) {
                        var layer = record.getLayer();
                        if (layer.isAnimatedSlice == undefined) {
                            return layer.displayInLayerSwitcher === true && layer.isBaseLayer === false;
                        }
                        return false;
                    },
                    createNode: function(attr) {

                        attr.uiProvider = Portal.ui.ActiveLayersTreeNodeUI;
                        return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
                    }
                }),

                listeners: {
                    // fake the selected node
                    // initial loading
                    scope: this,
                    append: function(tree, thisNode, node, index) {
                        node.setCls('x-tree-selected');
                    },
                    // subsequent tree nodes
                    insert: function(tree, thisNode, node, refNode) {
                        this.setActiveNode(node);
                    }
                }
            })
        }, cfg);
        Portal.ui.ActiveLayersPanel.superclass.constructor.call(this, config);
        this.addEvents('zoomtolayer', 'selectedactivelayerchanged');

        this.on("click", this.activeLayersTreePanelClickHandler, this);
        this.mon(this.root, 'append', this.updateTitle, this);
        this.mon(this.root, 'insert', this.updateTitle, this);

        // Be aware that this event is fired for _every_ item in the ActiveLayersPanel when you remove _any_ of them.
        // Because of some odd logic (GeoExt or Ext somewhere) -
        // <<Please update this comment if you find it. It might save you some time in the future.>>
        this.mon(this.root, 'remove', this.updateTitle, this);

        this.getSelectionModel().on("selectionchange", this.activeLayersTreePanelSelectionChangeHandler, this);
        this.on('beforeremove', this.beforeActiveLayerRemoved, this);

        Ext.MsgBus.subscribe('layerRemoved', function(subject, openLayer) {

            if (this.getActiveLayerNodes() && this.getActiveLayerNodes().length > 0) {
                //Ext gets confused if we don't select first node first
                // it seems to get visually selected, but not really selected, automatically
                this.getActiveLayerNodes()[0].select();

                //if we found a node equivilant to the old node, then select it,
                // other wise just keep the first node selected

                if (this.oldSelected) {
                    var newSelected = this.findNodeByLayer(this.oldSelected.attributes.layer);
                    if (newSelected) {
                        newSelected.select();
                    }
                    this.oldSelected = null;
                }
            }
            else { // No Layers left on map

                this.setActiveNode(null);

                Ext.MsgBus.publish("selectedLayerChanged", null);
            }
        }, this);
    },

    findNodeByLayer: function(layer) {
        var nodes = this.getActiveLayerNodes();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].attributes.layer === layer) {
                return nodes[i]
            }
        }
        return null;
    },

    setActiveNode: function(node) {
        this.getRootNode().eachChild(function(n) {
            if (n === node) {
                n.setCls('x-tree-selected');
            }
            else {
                n.setCls('');
                n.unselect(true);
            }
        });
    },

    activeLayersTreePanelClickHandler: function(node, event) {

        this.setActiveNode(node);
    },

    activeLayersTreePanelSelectionChangeHandler: function(selectionModel, node) {
        if (node != null) {
            this.fireEvent('selectedactivelayerchanged'); // zoom to layer call
            Ext.MsgBus.publish("selectedLayerChanged", node.layer);
        }
    },

    beforeActiveLayerRemoved: function(tree, parent, node) {
        var selected = this.getSelectedNode();

        if (selected) {
            this.oldSelected = selected;
        }
    },

    getActiveLayerNodes: function() {
        var leafNodes = [];
        this.addLeafNodes(this.getRootNode(), leafNodes);
        return leafNodes;
    },

    addLeafNodes: function(node, leafNodes) {
        Ext.each(node.childNodes, function(child, index, all) {
            if (child.leaf) {
                leafNodes.push(child);
            }
            else {
                this.addLeafNodes(child, leafNodes);
            }
        }, this);
    },

    getSelectedNode: function() {
        return this.getSelectionModel().getSelectedNode();
    },

    getSelectedLayer: function() {
        var node = this.getSelectedNode();
        return (node != null) ? this.getSelectedNode().layer : null;
    },

    zoomToLayer: function() {
        if (this.fireEvent('zoomtolayer', this.getSelectedLayer())) {

        }
    },

    /**
     * Bug fix, see: http://www.sencha.com/forum/showthread.php?105047-Setting-TreeNode.uiProvider-Causes-RootVisible-to-be-Ignored
     */
    setRootNode: function(node) {
        node = Portal.ui.ActiveLayersPanel.superclass.setRootNode.call(this, node);
        node.ui = new Ext.tree.RootTreeNodeUI(node);

        return node;
    },

    updateTitle: function() {
        var title = 'Active Layers';
        if (!this.root.hasChildNodes()) {
            title += '</br><i><small>No layers added to map</small></i>';
        }
        this.setTitle(title);
    }
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersPanel = Ext.extend(Ext.tree.TreePanel, {

    constructor: function(cfg) {

        var self = this;

        var config = Ext.apply({
            title: this._getDefaultEmptyMapText(),
            id: 'activeLayerTreePanel',
            enableDD: true,
            useArrows: true,
            rootVisible: false,

            root: new GeoExt.tree.OverlayLayerContainer({
                layerStore: cfg.layerStore,
                leaf: false,
                expanded: true,
                loader: new GeoExt.tree.LayerLoader({
                    store: cfg.layerStore,
                    filter: self._filter,
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
        this.getSelectionModel().on("beforeselect", this.activeLayersTreePanelBeforeSelectHandler, this);
        this.on('beforeremove', this.beforeActiveLayerRemoved, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_LOADING_START, function(subject, openLayer) {
            this._onLayerLoadingStart(openLayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_LOADING_END, function(subject, openLayer) {
            this._onLayerLoadingEnd(openLayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, function(subject, openLayer) {
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
                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, null);
            }
        }, this);
    },

    activeLayersTreePanelBeforeSelectHandler: function(selectionModel, newNode, oldNode) {
        if (newNode != null) {
            Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, newNode.layer);
        }
    },

    _filter: function(record) {
        return !record.getLayer().isBaseLayer && record.getLayer().displayInLayerSwitcher;
    },

    _getDefaultEmptyMapText: function() {
        return OpenLayers.i18n('noActiveCollectionSelected') + "<br/><i><small>" + OpenLayers.i18n('noCollectionSelectedHelp') + "</small></i>";
    },

    activeLayersTreePanelSelectionChangeHandler: function(selectionModel, node) {
        if (node != null) {
            this.fireEvent('selectedactivelayerchanged'); // zoom to layer call
            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, this.getSelectedLayer());
        }
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
        return (node != null) ? node.layer : null;
    },

    zoomToLayer: function() {
        this.fireEvent('zoomtolayer', this.getSelectedLayer());
    },

    _onLayerLoadingStart: function(openLayer) {
        if (this.getActiveLayerNodes() && this.getActiveLayerNodes().length > 0) {
            var layerEntry = this.findNodeByLayer(openLayer);
            if (layerEntry && layerEntry.ui) {
                // Delegate to layer
                layerEntry.ui.layerLoadingStart();
            }
        }
    },

    _onLayerLoadingEnd: function(openLayer) {
        if (this.getActiveLayerNodes() && this.getActiveLayerNodes().length > 0) {
            var layerEntry = this.findNodeByLayer(openLayer);
            if (layerEntry && layerEntry.ui) {
                // Delegate to layer
                layerEntry.ui.layerLoadingEnd(openLayer.hasImgLoadErrors());
            }
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
        var title = OpenLayers.i18n('dataCollectionsTitle');
        if (!this.root.hasChildNodes()) {
            title = this._getDefaultEmptyMapText();
        }
        this.setTitle(title);
    }
});

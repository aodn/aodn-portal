/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.TermSelectionPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        cfg = cfg || {};
        this.facetName = cfg.facetName;
        this.collapsedByDefault = cfg.collapsedByDefault;

        this.searcher = cfg.searcher;

        this.defaultTreeConfig = Ext.apply({
            animate: false,
            root: new Ext.tree.TreeNode(),
            containerScroll: true,
            autoScroll: true,
            collapsible: true,
            collapsed: cfg.collapsedByDefault,
            singleExpand: true,
            rootVisible: false,
            cls: "search-filter-panel hierarchicalTree term-selection-panel",
            lines: false
        }, cfg);

        this.tree = this.createTree();
        this.selectedNodeValueHierarchy;

        Portal.search.TermSelectionPanel.superclass.constructor.call(this, {
            items: [
                this.tree
            ]
        });

        this.setSelectionChangeListener();
        this.tree.on('checkchange', this._onCheckChange, this);

        this.mon(this.searcher, 'searchcomplete', function() {
            this._onSearchComplete();
        }, this);
    },

    createTree: function(config) {
        var cfg = Ext.apply(this.defaultTreeConfig, config);
        return new Ext.tree.TreePanel(cfg);
    },

    removeAnyFilters: function() {
        this.resetPanelDefaults();
        this.searcher.removeDrilldownFilters(this.facetName);
    },

    _onCheckChange: function(node) {
        this.searcher.removeDrilldownFilters(node.toValueHierarchy());
        this.searcher.search();
    },

    _onSelectionChange: function(selectionModel, node) {

        this.selectedNodeValueHierarchy = node.toValueHierarchy();
        this.searcher.removeDrilldownFilters(this.facetName);
        this.addFilters(node);
        this.searcher.search();

        trackFacetUsage(this.facetName, node.attributes.value);
    },

    addFilters: function(node) {

        if (node && node != this.tree.getRootNode()) {
            this.searcher.addDrilldownFilter(node.toValueHierarchy());
            var parent = node.parentNode;
            this.addFilters(parent);
        }
    },

    resetPanelDefaults: function() {

        if (this.collapsedByDefault) {
            this.tree.collapse();
        }
        else {
            this.tree.expand();
        }
    },

    _removeSiblings: function(nodes) {

        var that = this;
        Ext.each(nodes, function(node) {

            if (node.attributes.checked) {
                that._hidePreviousSiblings(node);
                that._hideNextSiblings(node);
            }

        });
    },

    _hidePreviousSiblings: function(node) {
        if (node.previousSibling) {
            node.previousSibling.ui.hide();
            this._hidePreviousSiblings(node.previousSibling);
        }
    },

    _hideNextSiblings: function(node) {
        if (node.nextSibling) {
            node.nextSibling.ui.hide();
            this._hideNextSiblings(node.nextSibling);
        }
    },

    _onSearchComplete: function() {

        var that = this;
        var rootNode = this.searcher.getDimensionNodeByValue(this.facetName);
        if (rootNode) {

            var nodesToKeep = [];

            // setup the tree DNA
            rootNode.eachNodeRecursive(function(thisNode) {
                    if (that.searcher.hasFilterOnNode(thisNode)) {
                        thisNode.attributes.checked = true;
                        nodesToKeep.push(thisNode);
                    }
                }
            );

            // plant the tree
            this.tree.setRootNode(rootNode);

            // Prune the tree
            this._removeSiblings(nodesToKeep);

            // Present the tree
            rootNode.eachNodeRecursive(function(node) {

                if (node.attributes.checked) {

                    node.expand();

                    if (node.toValueHierarchy() == that.selectedNodeValueHierarchy) {
                        that.setSelectionChangeListener(true);
                        node.select();
                        that.setSelectionChangeListener(false);

                    }
                    // only a checked leaf has the counts
                    if (node.hasChildNodes()){
                        node.setText(node.attributes.value);
                    }
                }
            });
        }
    },

    setSelectionChangeListener: function(deactivate) {
        if (deactivate) {
            this.tree.getSelectionModel().removeListener('selectionchange', this._onSelectionChange, this);
        }
        else {
            this.tree.getSelectionModel().on('selectionchange', this._onSelectionChange, this);
        }
    }

});

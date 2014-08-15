/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.HierarchicalTermSelectionPanel = Ext.extend(Ext.tree.TreePanel, {

    constructor: function(config) {

        config = Ext.apply({
            root: config.searcher.getSummaryNode() ? config.searcher.getSummaryNode() : new Ext.tree.TreeNode(),
            rootVisible: false,
            listeners: {
                scope: this,
                click: this._onClick
            }
        }, config);

        Portal.search.HierarchicalTermSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.searcher, 'hiersearchcomplete', function(summaryNode) {
            this._onSearchComplete(summaryNode);
        }, this);
    },

    _onClick: function(clickedNode) {
        this.searcher.addDrilldownFilter(clickedNode.toNameHierarchy());
        this.searcher.search();
    },

    _onSearchComplete: function(summaryNode) {
        this.setRootNode(summaryNode);
    },

    /**
     * The purpose of this override is to preserve certain state when setting
     * a new root node, namely whether nodes should be selected and or expanded.
     *
     * The difficulty lies in the fact that a node must be added to a TreePanel
     * to have either of those states applied, but on the other hand, setting
     * a new root node destroys the old root node and all of its children.
     *
     * Hence, we need to 'cache' the state of the existing root node before
     * replacing it with a new one.
     */
    setRootNode: function(newRootNode) {
        var oldNodeStatesCache = this._getNodeStatesCache();

        Portal.search.HierarchicalTermSelectionPanel.superclass.setRootNode.call(this, newRootNode);

        this._mergeNodeStates(oldNodeStatesCache);
    },

    _getNodeStatesCache: function() {
        var nodeStatesCache = {};

        if (this.root) {
            this.root.eachNodeRecursive(function(node) {
                nodeStatesCache[node.getTagNameAndName()] = { selected: node.isSelected() };
                return true;
            });
        }

        return nodeStatesCache;
    },

    _mergeNodeStates: function(nodeStatesCache) {
        this.root.eachNodeRecursive(function(node) {
            var oldNodeState = nodeStatesCache[node.getTagNameAndName()];

            if (oldNodeState) {
                oldNodeState.selected ? node.select() : node.unselect();
            }

            return true;
        });
    }
});

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
            rootVisible: false
        }, config);

        Portal.search.HierarchicalTermSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.searcher, 'hiersearchcomplete', function(summaryNode) {
            this._onSearchComplete(summaryNode);
        }, this);
    },

    _onSearchComplete: function(summaryNode) {
        this.setRootNode(summaryNode);
    }
});

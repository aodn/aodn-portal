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
            root: new Ext.tree.TreeNode(),
            rootVisible: false
        }, config);

        Portal.search.HierarchicalTermSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.searcher, 'hiersearchcomplete', function() {
            this._onSearchComplete();
        }, this);
    },

    _onSearchComplete: function() {

        var node = this.searcher.getDimensionNodeByName(this.dimensionName);
        this.setRootNode(node);
    }
});

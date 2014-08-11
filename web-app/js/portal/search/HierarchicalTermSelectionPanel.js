/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.HierarchicalTermSelectionPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        config = Ext.apply({
            html: "<i>Hierarchical FTW</i>"
        }, config);

        Portal.search.HierarchicalTermSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.searcher, 'searchcomplete',this._onSearchComplete, this);
    },

    _onSearchComplete: function(searchResponse) {
        //debugger;
    }
});

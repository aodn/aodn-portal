/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        var defaults = {};

        Ext.apply(this, cfg || {}, defaults);

        this.searcher = new Portal.service.CatalogSearcher({
            proxyUrl:this.proxyUrl,
            catalogUrl:this.catalogUrl,
            spatialSearchUrl: this.spatialSearchUrl,
            defaultParams:{
                protocol:cfg.protocols
            }
        });

        this.resultsStore = new Portal.data.GeoNetworkRecordStore();

        this.filtersPanel = new Portal.ui.search.SearchFiltersPanel({
            searcher: this.searcher,
            region: 'west',
            split: true,
            width: 340,
            bodyCssClass: 'p-header-space'
        });

        this.bodyPanel = new Portal.ui.search.SearchBodyPanel({
            region: 'center',
            unstyled: true,
            resultsStore: this.resultsStore,
            searcher: this.searcher
        });

        var config = Ext.apply({
            layout: 'border',
            split: false,
            items: [
                this.filtersPanel,
                this.bodyPanel
            ]
        }, cfg, defaults);

        Portal.ui.search.SearchPanel.superclass.constructor.call(this, config);
    },

    initComponent: function () {
        Portal.ui.search.SearchPanel.superclass.initComponent.apply(this);

        this.searcher.on('searchcomplete', function(response, page) {
            this.resultsStore.startRecord = page.from - 1;
            this.resultsStore.loadData(response);
        }, this);

        this.filtersPanel.on('filtersCleared', function() {
            this.bodyPanel.onFiltersCleared();
        }, this);
    }
});

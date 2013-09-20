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
            proxyUrl: proxyURL,
            catalogUrl: Portal.app.config.catalogUrl,
            spatialSearchUrl: appConfigStore.getById('spatialsearch.url').data.value,
            defaultParams: {
                protocol: Portal.app.config.metadataLayerProtocols.split("\n").join(' or ')
            }
        });

        this.resultsStore = new Portal.data.GeoNetworkRecordStore();

        this.filtersPanel = new Portal.ui.search.SearchFiltersPanel({
            searcher: this.searcher,
            region: 'west',
            split: true,
            width: 340,
            mapPanel: this.mapPanel
        });

        this.bodyPanel = new Portal.ui.search.SearchBodyPanel({
            id: 'searchBodypanel',
            margins: {left : 10, top : 37, right : 0, bottom : 0},
            region: 'center',
            unstyled: true,
            resultsStore: this.resultsStore,
            searcher: this.searcher
        });

        var config = Ext.apply({
            itemId: 'searchPanel',
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

        this.searcher.search();
    }
});

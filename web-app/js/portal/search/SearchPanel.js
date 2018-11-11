Ext.namespace('Portal.search');

Portal.search.SearchPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        Ext.apply(this, cfg);

        this.searcher = new Portal.service.CatalogSearcher({
            catalogUrl: Portal.app.appConfig.geonetwork.url,
            defaultParams: {
                protocol: Portal.app.appConfig.portal.metadataProtocols.wms.join(' or '),
                sortBy: 'popularity'
            }
        });

        this.resultsStore = new Portal.data.MetadataRecordStore();
        this.classificationStore = new Portal.data.TermClassificationStore();

        var filtersPanelConfig = {
            searcher: this.searcher,
            region: 'west',
            width: 410,
            mapPanel: this.mapPanel
        };

        this.filtersPanel = new Portal.search.SearchFiltersPanel(filtersPanelConfig);

        this.bodyPanel = new Portal.search.SearchBodyPanel({
            id: 'searchBodypanel',
            margins: {left : 10, top : 0, right : 0, bottom : 0},
            region: 'center',
            unstyled: true,
            resultsStore: this.resultsStore,
            dataCollectionStore: this.dataCollectionStore,
            classificationStore: this.classificationStore,
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
        }, cfg);

        Portal.search.SearchPanel.superclass.constructor.call(this, config);
    },

    initComponent: function () {
        Portal.search.SearchPanel.superclass.initComponent.apply(this);

        this.searcher.on('searchcomplete', function(response, page) {
            this._loadResults(response, page);
        }, this);

        this.searcher.search();
    },

    _loadResults: function(response, page) {
        this.classificationStore.loadData(response);
        this.resultsStore.startRecord = page.from - 1;
        this.resultsStore.loadData(response);
    }
});

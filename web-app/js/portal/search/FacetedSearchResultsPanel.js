Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsPanel = Ext.extend(Ext.Panel, {

    initComponent:function () {

        this.pagingBar = new Portal.search.PagingToolbar({
            pageSize: this.searcher.pageSize,
            store: this.store,
            prependButtons: false,
            height: 40,
            autoLoad: true
        });

        this.dataView = new Portal.search.FacetedSearchResultsDataView({
            store: this.store,
            searcher: this.searcher,
            dataCollectionStore: this.dataCollectionStore,
            classificationStore: this.classificationStore
        });

        var config = {
            title: false,
            buttonAlign: 'left',
            fbar: this.pagingBar,
            width: 840,
            items: [
                this.dataView
            ]
        };

        Ext.apply(this, config);

        Portal.search.FacetedSearchResultsPanel.superclass.initComponent.apply(this, arguments);

        this.store.on('load', function() {
            this._onStoreLoad();
        }, this);

        this._subscibeToDataCollectionEvents();
    },

    _subscibeToDataCollectionEvents: function() {
        Ext.each([PORTAL_EVENTS.DATA_COLLECTION_ADDED, PORTAL_EVENTS.DATA_COLLECTION_REMOVED], function(eventName) {

            Ext.MsgBus.subscribe(eventName, function() {
                this._refreshView();
            }, this);
        }, this);
    },

    _refreshView: function() {
        this.dataView.refresh();
    },

    _onStoreLoad: function() {
        this.pagingBar.onLoad(
            this.store,
            null,
            {
                params: {
                    start: this.store.startRecord,
                    limit: 10
                }
            }
        );
    }
});

Ext.reg('portal.search.facetedsearchresultspanel', Portal.search.FacetedSearchResultsPanel);

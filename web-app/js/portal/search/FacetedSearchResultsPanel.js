Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsPanel = Ext.extend(Ext.Panel, {

    initComponent:function () {

        this.dataView = new Portal.search.FacetedSearchResultsDataView({
            store: this.store,
            //searchBodyPanel: this.searchResultsPanel,
            searcher: this.searcher,
            dataCollectionStore: this.dataCollectionStore,
            classificationStore: this.classificationStore
        });

        var config = {
            title: false,
            buttonAlign: 'left',
            width: 840,
            items: [
                this.dataView
            ]
        };

        Ext.apply(this, config);

        Portal.search.FacetedSearchResultsPanel.superclass.initComponent.apply(this, arguments);

        this._subscribeToDataCollectionEvents();
    },

    _subscribeToDataCollectionEvents: function() {
        Ext.each([PORTAL_EVENTS.DATA_COLLECTION_ADDED, PORTAL_EVENTS.DATA_COLLECTION_REMOVED], function(eventName) {

            Ext.MsgBus.subscribe(eventName, function() {
                this._refreshView({"collectionAdded": true});
            }, this);
        }, this);
    },

    _refreshView: function(obj) {
        this.dataView.refresh(obj);
    }
});

Ext.reg('portal.search.facetedsearchresultspanel', Portal.search.FacetedSearchResultsPanel);

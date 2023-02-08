Ext.namespace('Portal.data');

Portal.data.MetadataRecordFetcher = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext.apply(this, config); // Required because Observable does not apply config for some resaon

        Portal.data.MetadataRecordFetcher.superclass.constructor.call(this, config);
    },

    get: function(uuid, successCallback) {
        var params = {
            uuid: uuid,
            fast: 'index'
        };

        Ext.ux.Ajax.proxyRequestXML({
            url: Portal.app.appConfig.geonetwork.url + '/srv/eng/' + Portal.app.appConfig.geonetwork.searchService +
                '?' + Ext.urlEncode(params),
            success: successCallback
        });
    },

    load: function(uuid, params) {
        var _this = this;
        this.get(uuid, function(response) {
            // Is there a more direct way to easily get a MetadataRecord from XML?
            var store = new Portal.data.MetadataRecordStore();
            store.loadData(response.responseXML);
            var metadataRecord = store.getAt(0);

            if (metadataRecord) {
                var dataCollection = Portal.data.DataCollection.fromMetadataRecord(metadataRecord);

                if (params.info && params.info == "true") {
                    dataCollection.shareLinkUsed = true;
                }
                _this.dataCollectionStore.add(dataCollection);

                viewport.setActiveTab(TAB_INDEX_VISUALISE);
            }
            else {
                _this._errorLoadingDataCollection(uuid);
            }
        });
    },

    _errorLoadingDataCollection: function(uuid) {
        Ext.MessageBox.alert('Error', String.format(OpenLayers.i18n('errorLoadingCollectionMessage'), uuid, Portal.app.appConfig.portal.contactEmail));
    },

    getParamsFromUrl: function() {
        var getParams = this._getUrl().split("?")[1];
        return Ext.urlDecode(getParams);
    },

    loadCollectionsFromUrl: function() {
        var params = this.getParamsFromUrl();
        Ext.each(params.uuid, function(aUuid) {
            this.load(aUuid, params);
        }, this);
    },

    _getUrl: function() {
        return document.URL;
    }
});

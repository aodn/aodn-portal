/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
            url: Portal.app.appConfig.geonetwork.url + '/srv/eng/xml.search.summary?' + Ext.urlEncode(params),
            success: successCallback
        });
    },

    load: function(uuid) {
        var _this = this;
        this.get(uuid, function(response) {
            // Is there a more direct way to easily get a MetadataRecord from XML?
            var store = new Portal.data.MetadataRecordStore();
            store.loadData(response.responseXML);
            var metadataRecord = store.getAt(0);
            var dataCollection = Portal.data.DataCollection.fromMetadataRecord(metadataRecord);

            if (metadataRecord) {
                _this.dataCollectionStore.add(dataCollection);
                viewport.setActiveTab(TAB_INDEX_VISUALISE);
            }
            else {
                _this._errorLoadingDataCollection(uuid);
            }
        });
    },

    _errorLoadingDataCollection: function(uuid) {
        Ext.MessageBox.alert('Error', String.format(OpenLayers.i18n('errorLoadingCollectionMessage'), uuid));
    },

    getUuidsFromUrl: function() {
        var getParams = this._getUrl().split("?");
        var params = Ext.urlDecode(getParams[1]);

        return params.uuid || [];
    },

    loadCollectionsFromUrl: function() {

        Ext.each(this.getUuidsFromUrl(), function(aUuid) {
            this.load(aUuid);
        }, this);
    },

    _getUrl: function() {
        return document.URL;
    }
});

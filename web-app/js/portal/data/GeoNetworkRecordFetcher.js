/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.GeoNetworkRecordFetcher = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext.apply(this, config);

        Portal.data.GeoNetworkRecordFetcher.superclass.constructor.call(this, config);

        this._loadCollectionsFromUrl();
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
            // Is there a more direct way to easily get a GeoNetworkRecord from XML?
            var store = new Portal.data.GeoNetworkRecordStore();
            store.loadData(response.responseXML);
            var metadataRecord = store.getAt(0);
            var dataCollection = Portal.data.DataCollection.fromMetadataRecord(metadataRecord);

            _this.dataCollectionStore.add(dataCollection);
            Ext.MsgBus.publish(PORTAL_EVENTS.VIEW_DATA_COLLECTION, dataCollection);
        });
    },

    getUuidsFromUrl: function() {
        var getParams = this._getUrl().split("?");
        var params = Ext.urlDecode(getParams[1]);

        return params.uuid || [];
    },

    hasUuidsInUrl: function() {
        return this.getUuidsFromUrl().length > 0;
    },

    _loadCollectionsFromUrl: function() {

        Ext.each(this.getUuidsFromUrl(), function(aUuid) {
            this.load(aUuid);
        }, this);
    },

    _getUrl: function() {
        return document.URL;
    }
});

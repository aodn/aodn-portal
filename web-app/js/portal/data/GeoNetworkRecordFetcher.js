/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.data');

Portal.data.GeoNetworkRecordFetcher = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext4.apply(this, config);

        Portal.data.GeoNetworkRecordFetcher.superclass.constructor.call(this, config);

        this._loadCollectionsFromUrl();
    },

    get: function(uuid, successCallback) {
        var params = {
            uuid: uuid,
            fast: 'index'
        };

        Ext.ux.Ajax.proxyRequestXML({
            url: Portal.app.appConfig.geonetwork.url + '/srv/eng/xml.search.summary?' + Ext4.urlEncode(params),
            success: successCallback
        });
    },

    load: function(uuid) {
        this.get(uuid, function(response) {
            // Is there a more direct way to easily get a GeoNetworkRecord from XML?
            var store = new Portal.data.GeoNetworkRecordStore();
            store.loadData(response.responseXML);
            var record = store.getAt(0);

            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
            Ext.MsgBus.publish(PORTAL_EVENTS.VIEW_DATA_COLLECTION, record);
        });
    },

    getUuidsFromUrl: function() {
        var getParams = this._getUrl().split("?");
        var params = Ext.urlDecode(getParams[1]);

       // Only support one UUID in a URL at most (for now)
        if (Array.isArray(params.uuid)) {
            params.uuid = params.uuid[0];
        }

        return params.uuid || [];
    },

    hasUuidsInUrl: function() {
        return this.getUuidsFromUrl().length > 0;
    },

    _loadCollectionsFromUrl: function() {

        Ext4.each(this.getUuidsFromUrl(), function(aUuid) {
            this.load(aUuid);
        }, this);
    },

    _getUrl: function() {
        return document.URL;
    }
});

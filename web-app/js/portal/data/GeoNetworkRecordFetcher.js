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
    },

    get: function(uuid, successCallback) {
        var params = {
            uuid: uuid,
            fast: 'index'
        };

        var url = proxyURL +
            encodeURIComponent(Portal.app.config.catalogUrl + '/srv/eng/xml.search.summary?' + Ext.urlEncode(params));

        Ext.Ajax.request({
            url: url,
            success: successCallback
        });
    },

    load: function(uuid) {
        this.get(uuid, function(response) {
            // Is there a less indirect way to easily get a GeoNetworkRecord from XML?
            var store = new Portal.data.GeoNetworkRecordStore();
            store.loadData(response.responseXML);
            var record = store.getAt(0);

            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
            Ext.MsgBus.publish(PORTAL_EVENTS.VIEW_GEONETWORK_RECORD, record);
        });
    }
});

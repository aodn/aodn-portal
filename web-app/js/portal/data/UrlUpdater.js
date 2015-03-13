/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Portal.data.UrlUpdater = Ext.extend(Ext.util.Observable, {

    constructor: function() {
        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, function() { this._updateUrl(); }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_REMOVED, function() { this._updateUrl(); }, this);

        Portal.data.UrlUpdater.superclass.constructor.call(this, arguments);
    },

   _updateUrl: function() {
       var uuids = Portal.data.ActiveGeoNetworkRecordStore.instance().getUuids();

       var urlParts = document.URL.split("?");
       var urlBase = urlParts[0];
       var urlParams = Ext.urlDecode(urlParts[1]);

       if (uuids.length > 0) {
           urlParams.uuid = uuids;
       }
       else {
           delete urlParams.uuid;
       }

       var updatedUrl = Ext.urlAppend(urlBase, Ext.urlEncode(urlParams));

       window.history.pushState(null, '', updatedUrl);
   }
});

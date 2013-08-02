
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.GeoNetworkRecordStore = Ext.extend(Ext.data.XmlStore, {

    constructor : function(cfg) {

        cfg = cfg || {};

        var defaults = {
        };

        var config = Ext.apply({
            record : 'metadata',
            totalProperty: 'summary/@count',
            fields: Portal.data.GeoNetworkRecord
        }, cfg, defaults);

        Portal.data.GeoNetworkRecordStore.superclass.constructor.call(this, config);
    }
});

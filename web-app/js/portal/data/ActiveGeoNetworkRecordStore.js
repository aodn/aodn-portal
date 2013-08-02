/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Portal.data.ActiveGeoNetworkRecordStore = Ext.extend(Portal.data.GeoNetworkRecordStore, {
    constructor: function() {
        Portal.data.ActiveGeoNetworkRecordStore.superclass.constructor.call(this);
        this.on('add', this._onAdd, this);
        this.on('remove', this._onRemove, this);
    },

    _onAdd: function(store, records, index) {
        Ext.each(records, function(record) {
            if (record.get('wmsLayer')) {
                Portal.data.LayerStore.instance().addUsingOpenLayer(record.get('wmsLayer'));
            }
        });

        Ext.MsgBus.publish('activegeonetworkrecordadded', records);
    },

    _onRemove: function(store, record, index) {
        if (record.get('wmsLayer')) {
            Portal.data.LayerStore.instance().removeUsingOpenLayer(record.get('wmsLayer'));
        }

        Ext.MsgBus.publish('activegeonetworkrecordremoved', record);
    }
});

/**
 * The records within this object are what is shown on the map and in the download cart.
 */
Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE;

Portal.data.ActiveGeoNetworkRecordStore.instance = function() {

    if (!Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE) {
        Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE = new Portal.data.ActiveGeoNetworkRecordStore();
    }

    return Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE;
};

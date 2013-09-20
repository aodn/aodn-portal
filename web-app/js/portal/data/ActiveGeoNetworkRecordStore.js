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
        this.on('clear', this._onClear, this);
    },

    isRecordActive: function(recordToCheck) {
        return Portal.data.ActiveGeoNetworkRecordStore.instance().findBy(function(record) {
            return record.get('uuid') == recordToCheck.get('uuid');
        }) != -1;
    },

    _onAdd: function(store, geoNetworkRecords) {
        Ext.each(geoNetworkRecords, function(geoNetworkRecord) {
            if (geoNetworkRecord.hasWmsLink()) {

                Portal.data.LayerStore.instance().addUsingLayerLink(
                    geoNetworkRecord.data.title,
                    geoNetworkRecord.getFirstWmsLink(),
                    function(layerRecord) {
                        var wmsLayer = layerRecord.get('layer');

                        geoNetworkRecord.layerRecord = layerRecord;
                        geoNetworkRecord.data['wmsLayer'] = wmsLayer;
                        layerRecord.parentGeoNetworkRecord = geoNetworkRecord;
                        wmsLayer.parentGeoNetworkRecord = geoNetworkRecord;
                    }
                );
            }
        });

        Ext.MsgBus.publish('activegeonetworkrecordadded', geoNetworkRecords);
    },

    _onRemove: function(store, record) {
        this._removeFromLayerStore(record);
        Ext.MsgBus.publish('activegeonetworkrecordremoved', record);
    },

    _removeFromLayerStore: function(record) {
        if (record.layerRecord) {
            Portal.data.LayerStore.instance().removeUsingOpenLayer(record.layerRecord.get('layer'));
        }
    },

    _onClear: function(store, records) {
        Ext.each(records, function(record) {
            store._removeFromLayerStore(record);
        });
    },

    removeAll: function(store) {
        Portal.data.ActiveGeoNetworkRecordStore.superclass.removeAll.call(this);
        Ext.MsgBus.publish('activegeonetworkrecordremoved');
    },

    getItemsEncodedAsJson: function() {
        var items = [];

        Ext.each(this.data.items, function(item) {
            items.push(item.convertedData());
        });

        return Ext.util.JSON.encode(items);
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

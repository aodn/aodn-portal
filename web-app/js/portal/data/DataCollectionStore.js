/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.data');

Portal.data.DataCollectionStore = Ext.extend(Ext.data.Store, {

    constructor: function(config) {

        Ext4.apply(this, config);
        Portal.data.DataCollectionStore.superclass.constructor.call(this);

        this.on('add', this._onAdd, this);
        this.on('remove', this._onRemove, this);
        this.on('clear', this._onClear, this);
    },

    removeAll: function() {
        Portal.data.ActiveGeoNetworkRecordStore.superclass.removeAll.call(this); // Todo - DN: Not this?
        Ext4.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED);
        Ext4.MsgBus.publish(PORTAL_EVENTS.RESET);
    },

    getRecordFromUuid: function(uuid) {
        var record = undefined;
        this.each(function(rec) {
            if (rec.data.uuid == uuid) {
                record = rec;
            }
        });
        return record;
    },

    getLoadedRecords: function() {
        var loadedRecords = [];
        this.each(function(record) {
            if (record.loaded) { loadedRecords.push(record); } // Todo - DN: Use filter?
        });
        return loadedRecords;
    },

    isRecordActive: function(recordToCheck) { // Todo - DN: When is this used?
        return Portal.data.ActiveGeoNetworkRecordStore.instance().findBy(function(record) {
                return record.get('uuid') == recordToCheck.get('uuid');
            }) != -1;
    },

    _onAdd: function(store, geoNetworkRecords) {
        console.log('_onAdd');

        var _this = this;

        Ext4.each(geoNetworkRecords, function(geoNetworkRecord) {
            if (geoNetworkRecord.hasWmsLink()) {

                this.layerStore.addUsingLayerLink(
                    geoNetworkRecord.data.title,
                    geoNetworkRecord.getFirstWmsLink(),
                    geoNetworkRecord,
                    function(layerRecord) {
                        var wmsLayer = layerRecord.get('layer');

                        geoNetworkRecord.layerRecord = layerRecord;
                        geoNetworkRecord.data['wmsLayer'] = wmsLayer;
                        layerRecord.parentGeoNetworkRecord = geoNetworkRecord;
                        wmsLayer.parentGeoNetworkRecord = geoNetworkRecord;
                        // Make it easier to access geonetwork UUID of this layer
                        wmsLayer.metadataUuid = geoNetworkRecord.data.uuid;

                        _this._recordLoaded(geoNetworkRecord);
                    }
                );
            }
            else {
                _this._recordLoaded(geoNetworkRecord);
            }
        }, this);
    },

    _onRemove: function(store, record) {
        console.log('_onRemove');

        this._removeFromLayerStore(record);
        Ext4.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, record);
    },

    _onClear: function(store, records) {
        console.log('_onClear');

        Ext4.each(records, function(record) {
            store._removeFromLayerStore(record);
        });
    },

    _recordLoaded: function(geoNetworkRecord) {
        geoNetworkRecord.loaded = true;
        Ext4.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, geoNetworkRecord);
    },

    _removeFromLayerStore: function(record) {
        if (record.layerRecord) {
            this.layerStore.removeUsingOpenLayer(record.layerRecord.get('layer'));
        }
    }
});

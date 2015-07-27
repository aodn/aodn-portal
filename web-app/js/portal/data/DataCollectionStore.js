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
        Portal.data.DataCollectionStore.superclass.removeAll.call(this);
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
        return this.findBy(function(record) {
            return record.get('uuid') == recordToCheck.get('uuid');
        }) != -1;
    },

    _onAdd: function(store, dataCollections) {
        console.log('_onAdd');

        var _this = this;
        console.log('dataCollections');
        console.warn(dataCollections);

        if (dataCollections.length != 1) {
            alert('dataCollections (' + dataCollections.length + ')');
        }

        Ext4.each(dataCollections, function(dataCollection) {

            console.log('dataCollection');
            console.log(dataCollection);

            if (dataCollection.getDefaultWmsLayerLink()) {

                console.log('dataCollection.getWmsLayers()');
                console.log(dataCollection.getWmsLayers());

                console.log('_this`');
                console.log(_this);

                this.layerStore.addUsingLayerLink(
                    dataCollection.get('title'),
                    dataCollection.getDefaultWmsLayerLink(),
                    dataCollection.metadata,
                    function(layerRecord) {

                        layerRecord.get('layer').dataCollection = dataCollection; // Todo - DN: Can we get away without this?

                        _this._recordLoaded(dataCollection);
                    }
                );
            }
            else {
                _this._recordLoaded(dataCollection);
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

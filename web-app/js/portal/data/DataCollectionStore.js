/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.DataCollectionStore = Ext.extend(Ext.data.Store, {

    constructor: function(config) {

        Ext.apply(this, config);
        Portal.data.DataCollectionStore.superclass.constructor.call(this);

        this.on('add', this._onAdd, this);
        this.on('remove', this._onRemove, this);
        this.on('clear', this._onClear, this);
    },

    removeAll: function() {
        Portal.data.DataCollectionStore.superclass.removeAll.call(this);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED);
        Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
    },

    getRecordFromUuid: function(uuid) {
        var record = undefined;
        this.each(function(rec) {
            if (rec.getUuid() == uuid) {
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
        var _this = this;

        if (dataCollections.length != 1) {
            alert('dataCollections (' + dataCollections.length + ')');
        }

        Ext.each(dataCollections, function(dataCollection) {

            if (dataCollection.getDefaultWmsLayerLink()) {

                this.layerStore.addUsingLayerLink(
                    dataCollection.get('title'),
                    dataCollection.getDefaultWmsLayerLink(),
                    dataCollection,
                    function(layerRecord) {

                        layerRecord.get('layer').dataCollection = dataCollection; // Todo - DN: Can we get away without this?
                        // TODO: this is just to make it easier to convert many UI components to take a
                        // DataCollection, rather than a OpenLayer.
                        dataCollection.getSelectedLayer = function() {
                            return layerRecord.get('layer');
                        };

                        _this._recordLoaded(dataCollection);
                    }
                );
            }
            else {
                _this._recordLoaded(dataCollection);
            }
        }, this);
    },

    _onRemove: function(store, dataCollection) {
        this._removeFromLayerStore(dataCollection);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
    },

    _onClear: function(store, dataCollections) {
        Ext.each(dataCollections, function(dataCollection) {
            store._removeFromLayerStore(dataCollection);
        });
    },

    _recordLoaded: function(dataCollection) {
        dataCollection.loaded = true;
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, dataCollection);
    },

    _removeFromLayerStore: function(dataCollection) {
        this.layerStore.removeUsingOpenLayer(dataCollection.getSelectedLayer());
    }
});

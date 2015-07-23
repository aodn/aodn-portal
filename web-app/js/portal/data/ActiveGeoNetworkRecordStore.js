/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.data');

Portal.data.ActiveGeoNetworkRecordStore = Ext.extend(Portal.data.GeoNetworkRecordStore, {

    constructor: function(config) {

        Ext.apply(this, config);
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
        var thisStore = this;

        Ext.each(geoNetworkRecords, function(geoNetworkRecord) {
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

                        thisStore._recordLoaded(geoNetworkRecord);
                    }
                );
            }
            else {
                thisStore._recordLoaded(geoNetworkRecord);
            }
        }, this);
    },

    _recordLoaded: function(geoNetworkRecord) {
        geoNetworkRecord.loaded = true;
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, geoNetworkRecord);
    },

    _onRemove: function(store, record) {
        this._removeFromLayerStore(record);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, record);
    },

    _removeFromLayerStore: function(record) {
        if (record.layerRecord) {
            this.layerStore.removeUsingOpenLayer(record.layerRecord.get('layer'));
        }
    },

    _onClear: function(store, records) {
        Ext.each(records, function(record) {
            store._removeFromLayerStore(record);
        });
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

    removeAll: function(store) {
        Portal.data.ActiveGeoNetworkRecordStore.superclass.removeAll.call(this);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED);
        Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
    },

    getLoadedRecords: function() {
        var loadedRecords = [];
        this.each(function(record) {
            if (record.loaded) { loadedRecords.push(record); }
        });
        return loadedRecords;
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

/**
 * Global function which is called from Geoserver/FTL popups.
 */
function setExtWmsLayer(url, label, type, layer, sld, options, style) {
    var cql;
    var _label = label;

    // options are comma delimited to include a unique label from a single value such as a dropdown box
    if (options.length > 1) {
        var opts = options.split(",");
        cql = opts[0];

        if (opts.length > 1) {
            _label += " " + opts[1];
        }

        if (_label.length <= 0) {
            cql = '';
        }
    }

    Portal.data.ActiveGeoNetworkRecordStore.instance().layerStore.addUsingDescriptor(new Portal.common.LayerDescriptor({
        server:{
            uri:url,
            type:type,
            opacity:100,
            infoFormat:"text/html"
        },
        queryable:true,
        // style in .ftl's but should be styles
        defaultStyle:style,
        name:layer,
        title:_label,
        cql:cql
    }));
}

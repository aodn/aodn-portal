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

        this.currentlyDownloading = false;
    },

    _onAdd: function(store, records, index) {
        Ext.each(records, function(record) {
            if (record.hasWmsLink()) {
                Portal.data.LayerStore.instance().addUsingLayerLink(
                    record.getFirstWmsLink(),
                    function(layerRecord) {
                        record.layerRecord = layerRecord;
                    });
            }
        });

        Ext.MsgBus.publish('activegeonetworkrecordadded', records);
    },

    _onRemove: function(store, record, index) {
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

    initiateDownload: function() {

        this.currentlyDownloading = true;

        Ext.Ajax.request({
            url: 'downloadCart/download',
            success: this._onDownloadSuccess,
            failure: this._onDownloadFailure,
            params: {
                items: this._getItemsEncodedAsJson()
            }
        });
    },

    isDownloading: function() {
        return this.currentlyDownloading;
    },

    _getItemsEncodedAsJson: function() {
        var items = [];

        Ext.each(this.data.items, function(item) {
            items.push(item.data);
        });

        return Ext.util.JSON.encode(items)
    },

    _onDownloadSuccess: function() {
        this.currentlyDownloading = false;
        this.fireEvent('downloadsuccess');
    },

    _onDownloadFailure: function() {
        this.currentlyDownloading = false;
        this.fireEvent('downloadfailure');
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

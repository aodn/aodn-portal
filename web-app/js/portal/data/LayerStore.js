/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

/**
 * Contains the set of layers currently on the map
 */
Portal.data.LayerStore = Ext.extend(GeoExt.data.LayerStore, {

    constructor: function(cfg) {
        Portal.data.LayerStore.superclass.constructor.call(this, cfg);

        this._registerMessageListeners();
        this._initBaseLayers();
    },

    _linkToOpenLayer: function(layerLink, dataCollection) {
        return Portal.data.DataCollectionLayers.prototype._linkToOpenLayer(layerLink, dataCollection);
    },

    _addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
        return this._addLayer(layerDescriptor.toOpenLayer(), layerRecordCallback);
    },

    addUsingOpenLayer: function(openLayer, layerRecordCallback) {
        return this._addLayer(openLayer, layerRecordCallback);
    },

    removeAll: function() {
        this.remove(this.getOverlayLayers().getRange());
        Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, null);
        this.selectDefaultBaseLayer();
    },

    selectDefaultBaseLayer: function() {
        var defaultBaseLayer = this.getDefaultBaseLayer();
        var openLayer = defaultBaseLayer ? defaultBaseLayer.data.layer : null;
        Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_CHANGED, openLayer);
    },

    getDefaultBaseLayer: function() {
        return this.getBaseLayers().first();
    },

    getBaseLayers: function() {
        return this._getLayers(function(record) {
            return record.getLayer().options && record.getLayer().options.isBaseLayer;
        });
    },

    getOverlayLayers: function() {
        return this._getLayers(function(record) {
            var layer = record.getLayer();
            return layer.options && !layer.options.isBaseLayer && !(layer instanceof OpenLayers.Layer.Vector);
        });
    },

    _getLayers: function(predicate) {
        return this.queryBy(function(record, id) {
            return predicate(record);
        });
    },

    removeUsingOpenLayer: function(openLayer) {
        var layerRecordToRemove = this.getByLayer(openLayer);
        this.remove(layerRecordToRemove);
    },

    _addLayer: function(openLayer, layerRecordCallback) {
        var layerRecord = new GeoExt.data.LayerRecord({
            layer: openLayer,
            title: openLayer.name
        });

        if (layerRecordCallback) {
            layerRecordCallback(layerRecord);
        }

        this.add(layerRecord);

        // Only want to be notified of changes if not a base layer
        if (!openLayer.options.isBaseLayer) {
            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, openLayer);
        }

        return layerRecord;
    },

    containsOpenLayer: function(openLayer) {

        var layerIndex = this.findBy(function(record) {
            var currentLayer = record.get("layer");
            return currentLayer.name === openLayer.name && currentLayer.url === openLayer.url;
        });

        return layerIndex >= 0;
    },

    _registerMessageListeners: function() {

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function(subject, openLayer) {
            this.removeAll();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, this._selectedLayerChanged, this);
    },

    _selectedLayerChanged: function(eventName, openLayer) {

        if (openLayer) {
            var recordIndex = this.findBy(this._layerMatcher(openLayer));

            if (recordIndex >= 0) {
                this._moveLayerToTop(recordIndex);
            }
        }
    },

    _layerMatcher: function(openLayer) {

        return function(record) {
            return record.data.layer.id == openLayer.id;
        };
    },

    _moveLayerToTop: function(recordIndex) {

        var record = this.getAt(recordIndex);
        this.remove(record);
        this.add(record);
    },

    _initBaseLayers: function() {

        Ext.Ajax.request({
            url: 'layer/configuredBaselayers',
            scope: this,
            success: function(resp) {
                var baseLayerConfigs = Ext.util.JSON.decode(resp.responseText);

                Ext.each(baseLayerConfigs, function(baseLayerConfig) {
                    var layerDescriptor = new Portal.common.LayerDescriptor(baseLayerConfig);
                    this._addUsingDescriptor(layerDescriptor);
                }, this);

                Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER);
            }
        });
    }
});

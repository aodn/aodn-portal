Ext.namespace('Portal.data');

/**
 * Contains the set of layers currently on the map
 */
Portal.data.LayerStore = Ext.extend(GeoExt.data.LayerStore, {

    constructor: function(cfg) {
        Portal.data.LayerStore.superclass.constructor.call(this, cfg);

        this._registerMessageListeners();
        this._initConfigLayers();
    },

    destroy: function() {
        Ext.each([PORTAL_EVENTS.DATA_COLLECTION_ADDED, PORTAL_EVENTS.DATA_COLLECTION_SELECTED], function(eventName) {
            Ext.MsgBus.unsubscribe(eventName, this._onDataCollectionChanged, this);
        }, this);
    },

    _linkToOpenLayer: function(layerLink, dataCollection) {
        return Portal.data.LayerSelectionModel.prototype._linkToOpenLayer(layerLink, dataCollection);
    },

    _addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
        return this._addLayer(layerDescriptor.toOpenLayer(), layerRecordCallback);
    },

    addUsingOpenLayer: function(openLayer, layerRecordCallback) {
        return this._addLayer(openLayer, layerRecordCallback);
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

    getDataLayers: function() {
        return this._getLayers(function(record) {
            return record.getLayer().options && record.getLayer().options.isDataLayer === true;
        });
    },

    getCollectionLayers: function() {
        return this._getLayers(function(record) {
            var layer = record.getLayer();
            return layer.options
                && !layer.options.isBaseLayer
                && !layer.options.isDataLayer
                && !(layer instanceof OpenLayers.Layer.Vector);
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
        this._selectedLayerChanged(openLayer);

        return layerRecord;
    },

    _registerMessageListeners: function() {

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function() {
            this._clearChanges();
        }, this);

        Ext.each([PORTAL_EVENTS.DATA_COLLECTION_ADDED, PORTAL_EVENTS.DATA_COLLECTION_SELECTED], function(eventName) {
            Ext.MsgBus.subscribe(eventName, this._onDataCollectionChanged, this);
        }, this);
    },

    _clearChanges: function() {
        this.remove(this.getCollectionLayers().getRange());
        this._hideDataLayers();
        this.selectDefaultBaseLayer();
    },

    _hideDataLayers: function() {
        this.getDataLayers().each(function(dataLayer) {
            dataLayer.getLayer().setVisibility(false);
        });
    },

    _onDataCollectionChanged: function(eventName, dataCollection) {
        this._selectedLayerChanged( dataCollection.getLayerSelectionModel().getSelectedLayer());
    },

    _selectedLayerChanged: function(openLayer) {

        if (openLayer) {
            this._moveLayerToTop(openLayer);
        }
        this._moveDataLayersToTop();
    },

    _moveLayerToTop: function(openLayer) {
        var recordIndex = this.findBy(this._layerMatcher(openLayer));
        if (recordIndex >= 0) {
            this._moveLayerRecordToTop(recordIndex);
        }
    },

    _moveDataLayersToTop: function() {
        Ext.each(this.getDataLayers().items, function (item) {

            var recordIndex = this.findBy(this._layerMatcher(item.data.layer));
            if (recordIndex >= 0) {
                this._moveLayerRecordToTop(recordIndex);
            }
        }, this);
    },

    _layerMatcher: function(openLayer) {

        return function(record) {
            return record.data.layer.id == openLayer.id;
        };
    },

    _moveLayerRecordToTop: function(recordIndex) {

        var record = this.getAt(recordIndex);
        this.remove(record);
        this.add(record);
    },

    _initConfigLayers: function() {

        Ext.Ajax.request({
            url: 'layer/configuredLayers',
            scope: this,
            success: function(resp) {
                var LayerConfigs = Ext.util.JSON.decode(resp.responseText);

                Ext.each(LayerConfigs, function(layerConfig) {
                    var layerDescriptor = new Portal.common.LayerDescriptor(layerConfig);
                    this._addUsingDescriptor(layerDescriptor);
                }, this);

                Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER);
            }
        });
    }
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

/**
 * Contains the set of currently "active" layers in the application,
 * i.e. those that have been added to the map.
 *
 * It's intended for this to be generalised when the concept of "bundles"
 * is introduced (i.e. it will store the set of active bundles).
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

    addUsingLayerLink: function(layerLink, dataCollection, layerRecordCallback) {
        return this._addLayer(
            this._linkToOpenLayer(layerLink, dataCollection),
            layerRecordCallback
        );
    },

    addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
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
        openLayer.destroyWhenLoaded();
        Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, openLayer);
    },

    _addLayer: function(openLayer, layerRecordCallback) {
        if (!this.containsOpenLayer(openLayer)) {

            var layerRecord = new GeoExt.data.LayerRecord({
                layer: openLayer,
                title: openLayer.name
            });

            if (layerRecordCallback) {
                layerRecordCallback(layerRecord);
            }

            // has the parentGeoNetworkRecord overlay layer been deleted
            if (layerRecord.parentGeoNetworkRecord) {
                if (!Portal.getDataCollectionStore().isRecordActive(layerRecord.parentGeoNetworkRecord)) { // Todo - DN: I don't think layer store should worry about this. Should be handled by Data Collection Store
                    return;
                }
            }

            this.add(layerRecord);

            // Only want to be notified of changes if not a base layer
            if (!openLayer.options.isBaseLayer) {
                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, openLayer);
            }

            return layerRecord;
        }
        else {
            Ext.Msg.alert(OpenLayers.i18n('layerExistsTitle'), OpenLayers.i18n('collectionExistsMsg'));
        }
    },

    containsOpenLayer: function(openLayer) {
        var path;
        if (openLayer.layerHierarchyPath) {
            path = openLayer.layerHierarchyPath;
        }
        else {
            path = openLayer.name;
        }

        var alreadyAdded = this.findBy(function(record, id) {
            if (record) {
                return (record.get("layer").layerHierarchyPath === path || record.get("layer").name === path) && record.get("layer").url === openLayer.url;
            }
        });

        if (alreadyAdded < 0) {
            return false;
        }

        return true;
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
                var layerDescriptorsAsText = Ext.util.JSON.decode(resp.responseText);

                Ext.each(layerDescriptorsAsText, function(layerDescriptorAsText) {
                    var layerDescriptor = new Portal.common.LayerDescriptor(layerDescriptorAsText);
                    this.addUsingDescriptor(layerDescriptor);
                }, this);

                Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER);
            }
        });
    }
});

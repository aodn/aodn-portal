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

    addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
        this.addUsingOpenLayer(layerDescriptor.toOpenLayer(), layerRecordCallback);
    },

    addUsingLayerLink: function(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback) {
        var serverUri = layerLink.server.uri;

        // Temporary here, until everything goes stateless and then we don't
        // need this if statement at all
        if (this.isStateless(serverUri)) {
            var layerDescriptor = new Portal.common.LayerDescriptor(layerLink, geonetworkRecord, OpenLayers.Layer.NcWMS);
            layerDescriptor.title = layerDisplayName;
            layerDescriptor.cql = layerLink.cql;
            this.addUsingDescriptor(layerDescriptor, layerRecordCallback);
            return;
        }

        Ext.Ajax.request({
            url: 'layer/findLayerAsJson?' + Ext.urlEncode({serverUri: serverUri, name: layerLink.name}),
            scope: this,
            success: function(resp) {
                var layerDescriptor = new Portal.common.LayerDescriptor(resp.responseText, geonetworkRecord, OpenLayers.Layer.WMS);
                if (layerDescriptor) {
                    // Override layer name with GeoNetwork layer name
                    layerDescriptor.title = layerDisplayName;
                    layerDescriptor.cql = layerLink.cql;
                    this.addUsingDescriptor(layerDescriptor, layerRecordCallback);
                }
            },
            failure: function(resp) {
                this.addUsingDescriptor(new Portal.common.LayerDescriptor(layerLink), layerRecordCallback);
            }
        });
    },

    addUsingOpenLayer: function(openLayer, layerRecordCallback) {
        return this._addLayer(openLayer, layerRecordCallback);
    },

    // PATCH PATCH PATCH! until we can distinguish in metadata between ncwms
    // and regular geoserver layers
    isStateless: function(uri) {
        return uri.toLowerCase().match('/ncwms/wms');
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
        })
    },

    getOverlayLayers: function() {
        return this._getLayers(function(record) {
            var layer = record.getLayer();
            return layer.options && !layer.options.isBaseLayer && !(layer instanceof OpenLayers.Layer.Vector);
        })
    },

    _getLayers: function(predicate) {
        return this.queryBy(function(record, id) {
            return predicate(record);
        });
    },

    removeUsingOpenLayer: function(openLayer) {
        var layerRecordToRemove = this.getByLayer(openLayer);
        openLayer.destroy();
        this.remove(layerRecordToRemove);
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
                if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(layerRecord.parentGeoNetworkRecord)) {
                    return;
                }
            }

            openLayer.loading = true;

            openLayer.events.register('loadstart', this, function() {

                openLayer.loading = true;

                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_START, openLayer);
            });
            openLayer.events.register('loadend', this, function() {
                openLayer.loading = false;
                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_END, openLayer);
            });

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
    },

    _initBaseLayers: function() {
        // TODO: shouldn't these be set properly in the server in the first place?
        this._initWithLayersFromServer('layer/configuredBaselayers', {
            isBaseLayer: true,
            queryable: false
        }, function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER);
        });
    },

    _initWithLayersFromServer: function(url, configOverrides, successCallback) {
        Ext.Ajax.request({
            url: url,
            scope: this,
            success: function(resp, opts) {

                var layerDescriptorsAsText = Ext.util.JSON.decode(resp.responseText);
                Ext.each(
                    layerDescriptorsAsText,
                    function(layerDescriptorAsText, index, all) {

                        var layerDescriptor = new Portal.common.LayerDescriptor(layerDescriptorAsText);
                        Ext.apply(layerDescriptor, configOverrides);
                        this.addUsingDescriptor(layerDescriptor);
                    },

                    this
                );

                if (successCallback) {
                    successCallback();
                }
            }
        });
    }
});

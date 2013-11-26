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
        this._initDefaultLayers();
    },

    addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
        this.addUsingOpenLayer(layerDescriptor.toOpenLayer(), layerRecordCallback);
    },

    addUsingLayerLink: function(layerDisplayName, layerLink, layerRecordCallback) {
        var serverUri = layerLink.server.uri;

        Ext.Ajax.request({
            url: 'layer/findLayerAsJson?' + Ext.urlEncode({serverUri: serverUri, name: layerLink.name}),
            scope: this,
            success: function(resp) {
                var layerDescriptor = new Portal.common.LayerDescriptor(resp.responseText);
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

    addUsingServerId: function(args) {
        Ext.Ajax.request({

            url: 'layer/showLayerByItsId?layerId=' + args.id,
            layerOptions: args.layerOptions,
            layerParams: args.layerParams,
            animated: args.animated,
            chosenTimes: args.chosenTimes,
            scope: this,
            success: function(resp, options) {
                var layerDescriptor = new Portal.common.LayerDescriptor(resp.responseText);
                this.addUsingOpenLayer(layerDescriptor.toOpenLayer(options.layerOptions, options.layerParams));
                // TODO: chosen times?
            },
            failure: function(resp) {
                Ext.MessageBox.alert('Error', "Sorry I could not load the requested collection:\n" + resp.responseText);
            }
        });
    },

    reset: function() {
        this.removeAll();
    },

    removeAll: function() {
        this.remove(this.getLayers(false).getRange());
        Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, null);
        this.selectDefaultBaseLayer();
    },

    selectDefaultBaseLayer: function() {
        var defaultBaseLayer = this.getDefaultBaseLayer();
        var openLayer = defaultBaseLayer ? defaultBaseLayer.data.layer : null;
        Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_CHANGED, openLayer);
    },

    getDefaultBaseLayer: function() {
        return this.getLayers(true).first();
    },

    getLayers: function(baseLayersOnly) {
        return this.queryBy(function(record, id) {

            if (record.getLayer().options === null) {
                return false;
            }

            return (record.getLayer().options.isBaseLayer == true) == baseLayersOnly;
        });
    },

    removeUsingOpenLayer: function(openLayer) {
        // Careful with using 'this' in this function as we'll be using
        // setTimeout to call this function again
        if (openLayer.loading) {
            // Call ourself again async if we were loading
            setTimeout(arguments.callee, 500, openLayer);
        }
        else {
            var layerRecordToRemove = this.getByLayer(openLayer);
            this.remove(layerRecordToRemove);
            Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, openLayer);
            openLayer.destroy();
        }
    },

    _addLayer: function(openLayer, layerRecordCallback) {
        if (!this.containsOpenLayer(openLayer)) {
            openLayer.loading = true;

            openLayer.events.register('loadstart', this, function() {
                openLayer.loading = true;
                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_START, openLayer);
            });
            openLayer.events.register('loadend', this, function() {
                openLayer.loading = false;
                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_END, openLayer);
            });

            var layerRecord = new GeoExt.data.LayerRecord({
                layer: openLayer,
                title: openLayer.name
            });

            Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, openLayer);

            this.add(layerRecord);

            if (layerRecordCallback) {
                layerRecordCallback(layerRecord);
            }

            // Only want to be notified of changes in no base layer
            if (!openLayer.options.isBaseLayer) {
                Ext.MsgBus.publish('selectedLayerChanged', openLayer);
            }

            return layerRecord;
        }
        else {
            Ext.Msg.alert(OpenLayers.i18n('layerExistsTitle'), OpenLayers.i18n('layerExistsMsg'));
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

        if (alreadyAdded < 0)
            return false;

        return true;
    },

    _registerMessageListeners: function() {
        Ext.MsgBus.subscribe('removeAllLayers', function(subject, openLayer) {
            this.removeAll();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function(subject, openLayer) {
            this.reset();
        }, this);
    },

    _initBaseLayers: function() {
        // TODO: shouldn't these be set properly in the server in the first place?
        this._initWithLayersFromServer('layer/configuredbaselayers', {
            isBaseLayer: true,
            queryable: false
        }, function () {
            Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER)
        });
    },

    _initDefaultLayers: function() {
        this._initWithLayersFromServer('layer/defaultlayers');
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

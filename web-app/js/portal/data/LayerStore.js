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
        this._initCurrentlyLoadingLayers();
        this._initBaseLayers();
        this._initDefaultLayers();
    },

    addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
        this.addUsingOpenLayer(layerDescriptor.toOpenLayer(), layerRecordCallback);
    },

    addUsingLayerLink: function(layerLink, layerRecordCallback) {

        var serverUri = layerLink.server.uri;

        Ext.Ajax.request({
            url: 'layer/findLayerAsJson?' + Ext.urlEncode({serverUri: serverUri, name: layerLink.name}),
            scope: this,
            success: function(resp) {
                var layerDescriptor = new Portal.common.LayerDescriptor(resp.responseText);
                if (layerDescriptor) {
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
                Ext.MessageBox.alert('Error', "Sorry I could not load the requested layer:\n" + resp.responseText);
            }
        });
    },

    reset: function() {

        this.removeAll();
    },

    removeAll: function() {

        this.remove(this.getLayers(false).getRange());
        this.currentlyLoadingLayers.clear();
        Ext.MsgBus.publish('selectedLayerChanged', null);
        this.selectDefaultBaseLayer();
    },

    selectDefaultBaseLayer: function() {

        var defaultBaseLayer = this.getDefaultBaseLayer();
        var openLayer = defaultBaseLayer ? defaultBaseLayer.data.layer : null;
        Ext.MsgBus.publish('baseLayerChanged', openLayer);
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

        var layerRecordToRemove = this.getByLayer(openLayer);
        this.remove(layerRecordToRemove);
        this.currentlyLoadingLayers.remove(openLayer);

        Ext.MsgBus.publish('layerRemoved', openLayer);
    },

    _addLayer: function(openLayer, layerRecordCallback) {
        if (!this.containsOpenLayer(openLayer)) {
            openLayer.events.register('loadstart', this, function() {
                this.currentlyLoadingLayers.add(openLayer.name, openLayer);
            });
            openLayer.events.register('loadend', this, function() {
                this.currentlyLoadingLayers.remove(openLayer);
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

    _initCurrentlyLoadingLayers: function() {
        this.currentlyLoadingLayers = new Ext.util.MixedCollection();
        this.currentlyLoadingLayers.on('add', function(index, object) {
            this._publishLayersLoadingMessage();
        }, this);
        this.currentlyLoadingLayers.on('clear', function() {
            this._publishLayersLoadingMessage();
        }, this);
        this.currentlyLoadingLayers.on('remove', function(index, object) {
            this._publishLayersLoadingMessage();
        }, this);
    },

    getLayersLoadingCount: function() {
        return this.currentlyLoadingLayers.getCount();
    },

    _registerMessageListeners: function() {
        Ext.MsgBus.subscribe('removeAllLayers', function(subject, openLayer) {
            this.removeAll();
        }, this);

        Ext.MsgBus.subscribe('reset', function(subject, openLayer) {
            this.reset();
        }, this);
    },

    _initBaseLayers: function() {

        // TODO: shouldn't these be set properly in the server in the first place?
        this._initWithLayersFromServer('layer/configuredbaselayers', {
            isBaseLayer: true,
            queryable: false
        }, function () {
            Ext.MsgBus.publish("baseLayersLoadedFromServer")
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
                Ext.each(layerDescriptorsAsText,

                    function(layerDescriptorAsText, index, all) {

                        var layerDescriptor = new Portal.common.LayerDescriptor(layerDescriptorAsText);
                        Ext.apply(layerDescriptor, configOverrides);
                        this.addUsingDescriptor(layerDescriptor);
                    },

                    this
                );

                if(successCallback)
                    successCallback();

            }
        });
    },

    _publishLayersLoadingMessage: function() {
        Ext.MsgBus.publish('layersLoading', this.currentlyLoadingLayers.getCount());
    }
});

Portal.data.LayerStore.THE_INSTANCE;

Portal.data.LayerStore.instance = function() {

    if (!Portal.data.LayerStore.THE_INSTANCE) {
        Portal.data.LayerStore.THE_INSTANCE = new Portal.data.LayerStore();
    }

    return Portal.data.LayerStore.THE_INSTANCE;
};

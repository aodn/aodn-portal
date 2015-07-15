/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.data');

/**
 * Contains the set of currently "active" layers in the application,
 * i.e. those that have been added to the map.
 *
 * It's intended for this to be generalised when the concept of "bundles"
 * is introduced (i.e. it will store the set of active bundles).
 */
Portal.data.LayerStore = Ext.extend(GeoExt.data.LayerStore, {

    BLOCKED: "BLOCKED",

    constructor: function(cfg) {
        Portal.data.LayerStore.superclass.constructor.call(this, cfg);

        this._registerMessageListeners();
        this._initBaseLayers();
    },

    addUsingDescriptor: function(layerDescriptor, layerRecordCallback) {
        return this._addLayer(layerDescriptor.toOpenLayer(), layerRecordCallback);
    },

    addUsingLayerLink: function(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback) {
        var serverUri = layerLink.server.uri;

        Ext4.Ajax.request({
            url: 'server/getInfo?' + Ext4.urlEncode({server: serverUri}),
            scope: this,
            success: function(resp) {
                try {
                    var serverInfo = Ext4.JSON.decode(resp.responseText);
                    this._serverInfoLoaded(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback, serverInfo);
                }
                catch (e) {
                    log.error("Failed parsing information for server '" + serverUri + "', response : '" + resp.responseText + "'");
                }
            },
            failure: function(resp) {
                log.error("Failed getting information for server '" + serverUri + "'");
                this._serverUnrecognized(layerDisplayName, layerLink);
            }
        });
    },

    _serverInfoLoaded: function(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback, serverInfo) {
        if ($.isEmptyObject(serverInfo)) {

            this._serverUnrecognized(layerDisplayName, layerLink);

            // break this layer as the server is unrecognised
            // openLayers needs the minimum to attempt loading #1476
            layerLink.server = {
                uri: this.BLOCKED,
                type: this.BLOCKED
            };
            layerRecordCallback = undefined;
            geonetworkRecord = undefined;
        }

        if (serverInfo.type && serverInfo.type.toLowerCase() == 'ncwms') {
            this._addUsingLayerLinkNcwms(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback, serverInfo);
        }
        else {
            this._addUsingLayerLinkDefault(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback, serverInfo);
        }
    },

    _serverUnrecognized: function(layerDisplayName, layerLink) {
        var serverUri = layerLink.server.uri;
        log.error("Server '" + serverUri + "' is blocked!!");
    },

    _addUsingLayerLinkDefault: function(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback, serverInfo) {
        var layerDescriptor = new Portal.common.LayerDescriptor(layerLink, geonetworkRecord, OpenLayers.Layer.WMS);
        layerDescriptor.title = layerDisplayName;
        layerDescriptor.cql = layerLink.cql;
        this.addUsingDescriptor(layerDescriptor, layerRecordCallback);
    },

    _addUsingLayerLinkNcwms: function(layerDisplayName, layerLink, geonetworkRecord, layerRecordCallback, serverInfo) {
        var layerDescriptor = new Portal.common.LayerDescriptor(layerLink, geonetworkRecord, OpenLayers.Layer.NcWMS);
        layerDescriptor.title = layerDisplayName;
        layerDescriptor.cql = layerLink.cql;
        this.addUsingDescriptor(layerDescriptor, layerRecordCallback);
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
                if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(layerRecord.parentGeoNetworkRecord)) {
                    return;
                }
            }

            openLayer.events.register('loadstart', this, function() {
                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_START, openLayer);
            });

            openLayer.events.register('loadend', this, function() {
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

        Ext4.Ajax.request({
            url: 'layer/configuredBaselayers',
            scope: this,
            success: function(resp) {
                var layerDescriptorsAsText = Ext4.JSON.decode(resp.responseText);

                Ext4.each(layerDescriptorsAsText, function(layerDescriptorAsText) {
                    var layerDescriptor = new Portal.common.LayerDescriptor(layerDescriptorAsText);
                    this.addUsingDescriptor(layerDescriptor);
                }, this);

                Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER);
            }
        });
    }
});

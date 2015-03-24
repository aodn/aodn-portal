
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

/**
 * Layer descriptor constructs OpenLayers WMS object with parameters from
 * server and geonetwork record
 */
Portal.common.LayerDescriptor = Ext.extend(Object, {

    geonetworkRecord: null,

    constructor: function(cfg, geonetworkRecord, openLayerClass) {
        if (typeof cfg == "string") {
            cfg = Ext.util.JSON.decode(cfg);
        }

        if (!openLayerClass) {
            // By default, use the WMS Openlayer class
            openLayerClass = OpenLayers.Layer.WMS;
        }

        this.openLayerClass = openLayerClass;
        this.geonetworkRecord = geonetworkRecord;

        Ext.apply(this, cfg);
    },

    toOpenLayer: function(optionOverrides, paramOverrides) {
        var openLayer = new this.openLayerClass(
            this.title,
            this.server.uri,
            new Portal.ui.openlayers.LayerParams(this, paramOverrides),
            new Portal.ui.openlayers.LayerOptions(this, optionOverrides)
        );
        this._setDomainLayerProperties(openLayer);

        return openLayer;
    },

    _getLayerWorkspace: function(layerName) {
        var workspace = null;
        if (layerName.indexOf(":") != -1) {
            workspace = layerName.split(":")[0];
        }
        return workspace;
    },

    /**
     * Refactor.
     */
    _setDomainLayerProperties: function(openLayer) {
        openLayer.server = this.server;
        openLayer.wmsName = this.name;

        //injecting credentials for authenticated WMSes.  Openlayer doesn't
        //provide a way to add header information to a WMS request
        openLayer.cql = this.cql;
        this._setOpenLayerBounds(openLayer);
        this._setDownloadLayers(openLayer);
        openLayer.cache = this.cache;
        openLayer.projection = this.projection;
        openLayer.blacklist = this.blacklist;
        openLayer.abstractTrimmed = this.abstractTrimmed;
        openLayer.dimensions = this.dimensions;
        openLayer.layerHierarchyPath = this.layerHierarchyPath;
        openLayer.params.QUERYABLE = true;

        if (this.viewParams) {
            openLayer.zoomOverride = {
                centreLon: this.viewParams.centreLon,
                centreLat: this.viewParams.centreLat,
                openLayersZoomLevel: this.viewParams.openLayersZoomLevel
            }
        }
    },

    _setDownloadLayers: function(openLayer) {
        var downloadLayers = [];

        if (this.geonetworkRecord && this.geonetworkRecord.data && this.geonetworkRecord.data.dataDownloadHandlers) {
            var dataDownloadHandlers = this.geonetworkRecord.data.dataDownloadHandlers;
            for (var i = 0; i < dataDownloadHandlers.length; ++i) {
                var downloadLayer = dataDownloadHandlers[i].onlineResource.name;

                // If layer has no workspace defined, assume it is in the same
                // workspace as the WMS layer
                if (! this._getLayerWorkspace(downloadLayer) &&
                    this._getLayerWorkspace(openLayer.wmsName)) {
                    downloadLayer = this._getLayerWorkspace(openLayer.wmsName) + ":" + downloadLayer;
                }

                if (-1 ==  $.inArray(downloadLayer, downloadLayers)) {
                    downloadLayers.push(downloadLayer);
                }
            }
        }
        openLayer.downloadLayers = downloadLayers;
        openLayer.getDownloadLayer = function() { return this.downloadLayers[0]; }
    },

    _setOpenLayerBounds: function(openLayer) {
        if (this.geonetworkRecord
            && this.geonetworkRecord.data
            && this.geonetworkRecord.data.bbox
            && this.geonetworkRecord.data.bbox.geometries) {
            var bounds = this.geonetworkRecord.data.bbox.getBounds();
            openLayer.bboxMinX = bounds.left;
            openLayer.bboxMinY = bounds.bottom;
            openLayer.bboxMaxX = bounds.right;
            openLayer.bboxMaxY = bounds.top;
        }
    },

    _getAttribute: function(attribute) {
        if (this[attribute]) {
            return this[attribute];
        }
        else if (this.geonetworkRecord && this.geonetworkRecord.data && this.geonetworkRecord.data[attribute]) {
            return this.geonetworkRecord.data[attribute];
        }
        else {
            return undefined
        }
    },

    _getParent: function() {
        return this.parent;
    },

    _getParentId: function() {
        if (this._getParent()) {
            return this._getParent().id;
        }
        else {
            return undefined;
        }
    },

    _getParentName: function() {
        if (this._getParent()) {
            return this._getParent().name;
        }
        else {
            return undefined;
        }
    }
});

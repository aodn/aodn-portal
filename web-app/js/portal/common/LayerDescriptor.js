
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

    _getWmsVersionString: function(server) {
        // list needs to match Server.groovy
        var versionList = ["1.0.0","1.0.7","1.1.0","1.1.1","1.3.0"];
        for(var i = 0; i < versionList.length; i++) {
            if (server.type.indexOf(versionList[i]) != -1) {
                return versionList[i];
            }
        }
        return "undefined";
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
        openLayer.cache = this.cache;
        openLayer.projection = this.projection;
        openLayer.blacklist = this.blacklist;
        openLayer.abstractTrimmed = this.abstractTrimmed;
        openLayer.dimensions = this.dimensions;
        openLayer.layerHierarchyPath = this.layerHierarchyPath;

        if (this.viewParams) {
            openLayer.zoomOverride = {
                centreLon: this.viewParams.centreLon,
                centreLat: this.viewParams.centreLat,
                openLayersZoomLevel: this.viewParams.openLayersZoomLevel
            }
        }
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

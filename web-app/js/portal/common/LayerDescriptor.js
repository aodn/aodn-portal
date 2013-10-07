
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

/**
 * A layer descriptor is essentially a representation of a layer as returned from the server.
 */
Portal.common.LayerDescriptor = Ext.extend(Object, {

    constructor: function(cfg) {
        if (typeof cfg == "string") {
            cfg = Ext.util.JSON.decode(cfg);
        }

        Ext.apply(this, cfg);
    },

    toOpenLayer: function(optionOverrides, paramOverrides) {
        var openLayer;

        if (this._getTimeDimension()) {
            openLayer = new OpenLayers.Layer.NcWMS(
                this.title,
                this._getServerUri(),
                new Portal.ui.openlayers.LayerParams(this, paramOverrides),
                new Portal.ui.openlayers.LayerOptions(this, optionOverrides),
                this._getTimeDimension().extent
            );
        } else {
            openLayer = new OpenLayers.Layer.WMS(
                this.title,
                this._getServerUri(),
                new Portal.ui.openlayers.LayerParams(this, paramOverrides),
                new Portal.ui.openlayers.LayerOptions(this, optionOverrides)
            );
        }

        this._setDomainLayerProperties(openLayer);

        return openLayer;
    },

    _getTimeDimension: function() {
        var timeDimension = undefined;
        if (!this.dimensions) {
            return timeDimension;
        }

        Ext.each(this.dimensions, function(dimension) {
            if (dimension.name == 'time') {
                timeDimension = dimension;
            }
        });

        return timeDimension;
    },

    _getWmsVersionString: function(server) {
        // list needs to match Server.groovy
        var versionList = ["1.0.0","1.0.7","1.1.0","1.1.1","1.3.0"];
        for(var i = 0; i < versionList.length; i++){
            if (server.type.indexOf(versionList[i]) != -1) {
                return versionList[i];
            }
        }
        return "undefined";
    },

    /**
     * Refactor?
     */
    _getUri: function(server) {
        return server.uri;
    },

    _getServerUri: function() {
        var serverUri = this._getUri(this.server);
        if (this.cache == true) {
            serverUri = window.location.href + proxyCachedURL + encodeURIComponent(serverUri);
        }
        return serverUri;
    },

    /**
     * Refactor.
     */
    _setDomainLayerProperties: function(openLayer) {
        openLayer.grailsLayerId = this.id;
        openLayer.server= this.server;

        //injecting credentials for authenticated WMSes.  Openlayer doesn;t
        //provide a way to add header information to a WMS request
        openLayer.proxy(proxyURL);
        openLayer.cql = this.cql;
        openLayer.bboxMinX = this.bboxMinX;
        openLayer.bboxMinY = this.bboxMinY;
        openLayer.bboxMaxX = this.bboxMaxX;
        openLayer.bboxMaxY = this.bboxMaxY;
        openLayer.cache = this.cache;
        openLayer.projection = this.projection;
        openLayer.blacklist = this.blacklist;
        openLayer.abstractTrimmed = this.abstractTrimmed;
        openLayer.metadataUrls = this.metadataUrls;
        openLayer.overrideMetadataUrl = this.overrideMetadataUrl;
        openLayer.parentLayerId = this._getParentId();
        openLayer.parentLayerName = this._getParentName();
        openLayer.allStyles = this._getAllStyles();
        openLayer.dimensions = this.dimensions;
        openLayer.layerHierarchyPath = this.layerHierarchyPath;

        if (this.viewParams) {
            openLayer.zoomOverride = {
                centreLon: this.viewParams.centreLon,
                centreLat: this.viewParams.centreLat,
                openLayersZoomLevel: this.viewParams.openLayersZoomLevel
            }
        }

        if (this.wfsLayer) {
            openLayer.wfsLayer = {
                name : this.wfsLayer.name,
                server : { uri : this.wfsLayer.server.uri }
            }
        }
    },

    _getParent: function() {
        return this.parent;
    },

    _getParentId: function() {
        if (this._getParent()) {
            return this._getParent().id;
        } else {
            return undefined;
        }
    },

    _getParentName: function() {
        if (this._getParent()) {
            return this._getParent().name;
        } else {
            return undefined;
        }
    },

    _getAllStyles: function() {
        if (this.allStyles) {
            return this.allStyles;
        } else {
            return [];
        }
    }
});

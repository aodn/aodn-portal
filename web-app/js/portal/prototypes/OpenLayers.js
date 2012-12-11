/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

OpenLayers.Layer.WMS.prototype.adjustBounds = function (bounds) {
    if (this.gutter) {
        // Adjust the extent of a bounds in map units by the
        // layer's gutter in pixels.

        var originalLeft = bounds.left;
        var originalRight = bounds.right;
        var mapGutter = this.gutter * this.map.getResolution();
        bounds = new OpenLayers.Bounds(bounds.left - mapGutter,
            bounds.bottom - mapGutter,
            bounds.right + mapGutter,
            bounds.top + mapGutter);

        //don't let buffer push a bounds across the dateline
        if (originalLeft >= this.maxExtent.right && bounds.left < this.maxExtent.right) {
            bounds.left = this.maxExtent.right;
        }
        else if (originalRight <= this.maxExtent.left && bounds.right > this.maxExtent.left) {
            bounds.right = this.maxExtent.left;
        }
    }

    if (this.wrapDateLine) {
        // wrap around the date line, within the limits of rounding error
        var wrappingOptions = {
            'rightTolerance':this.map.getResolution(),
            'leftTolerance':this.map.getResolution()
        };
        bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);

    }
    return bounds;
};

// Modifications to OpenLayers class prototypes
OpenLayers.Layer.WMS.prototype.isNcwms = function () {
    if (this.server) {
        return ["NCWMS-1.1.1", "NCWMS-1.3.0", "THREDDS"].indexOf(this.server.type) >= 0;
    }
};

OpenLayers.Layer.WMS.prototype.getFeatureInfoRequestString = function (clickPoint, overrideParams) {
    var baseFeatureInfoParams = {
        REQUEST:"GetFeatureInfo",
        EXCEPTIONS:"application/vnd.ogc.se_xml",
        BBOX:this._getBoundingBox(),
        INFO_FORMAT:this.getFeatureInfoFormat(),
        QUERY_LAYERS:this.params.LAYERS,
        FEATURE_COUNT:this.isNcwms() ? 1 : 100,
        SRS:'EPSG:4326',
        CRS:'EPSG:4326',
        WIDTH:this.map.size.w,
        HEIGHT:this.map.size.h
    };

    if (clickPoint) {
        baseFeatureInfoParams = Ext.apply(baseFeatureInfoParams, {
            X:clickPoint.x,
            Y:clickPoint.y,
            I:clickPoint.x,
            J:clickPoint.y
        });
    }

    baseFeatureInfoParams = Ext.apply(baseFeatureInfoParams, overrideParams);

    return this.unproxy(this.getFullRequestString(baseFeatureInfoParams));
};

OpenLayers.Layer.WMS.prototype.getFeatureInfoFormat = function () {

    var result = this.server.infoFormat;
    if (this.isAnimated) {
        result = "image/png";
    }
    else if (this.isNcwms()) {
        // ignoring any bad user config. we know what we want here
        result = "text/xml";
    }

    return result;
};

OpenLayers.Layer.WMS.prototype.getMetadataUrl = function () {
    var result = undefined;

    if (this.overrideMetadataUrl) {
        result = this.overrideMetadataUrl;
    }
    else if (this.metadataUrls && this.metadataUrls.length > 0) {
        for (var i = 0; i < this.metadataUrls.length; i++) {
            //TC211 is meant for MCP
            if (this.metadataUrls[i].type == "TC211") {  //ideally there would be a MCP type in geoserver to compare with - rather than "other"
                return this.metadataUrls[i].onlineResource.href;
            }
        }
    }
    return result;
};

OpenLayers.Layer.WMS.prototype.proxy = function (proxy) {
    if (this.server.username && this.server.password && !this.localProxy) {
        this.server.uri = proxy + this.server.uri + "?";
        this.url = this.server.uri;
        this.localProxy = proxy;
    }
};

OpenLayers.Layer.WMS.prototype.unproxy = function (url) {
    return url.replace(this.localProxy, '');
};

OpenLayers.Layer.WMS.prototype._getBoundingBox = function () {
    var bounds = this._is130()
        ? new OpenLayers.Bounds.fromArray(this.getExtent().toArray(true))
        : this.getExtent();

    return bounds.toBBOX();
};

OpenLayers.Layer.WMS.prototype._is130 = function () {
    return "WMS-1.3.0" == this.server.type;
};

OpenLayers.Layer.WMS.prototype.isAnimatable = function () {
    if (this.dimensions != undefined) {
        for (var i = 0; i < this.dimensions.length; i++) {
            if (this.dimensions[i].name == "time") {
                return true;
            }
        }
    }
    return false;
};

OpenLayers.Layer.WMS.prototype.hasBoundingBox = function () {
    return !Ext.isEmpty(this.bboxMinX) && !Ext.isEmpty(this.bboxMinY) && !Ext.isEmpty(this.bboxMaxX) && !Ext.isEmpty(this.bboxMaxY);
};




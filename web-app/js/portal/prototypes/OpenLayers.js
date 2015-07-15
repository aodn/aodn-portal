/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

// Override some OpenLayers default images
OpenLayers.Util.__getImageLocation = OpenLayers.Util.getImageLocation;
OpenLayers.Util.getImageLocation = function(image) {
    var overrideImages = [
        "east-mini.png",
        "layer-switcher-maximize.png",
        "north-mini.png",
        "panning-hand-off.png",
        "panning-hand-on.png",
        "slider.png",
        "south-mini.png",
        "west-mini.png",
        "zoom-minus-mini.png",
        "zoom-plus-mini.png",
        "zoom-world-mini.png",
        "zoombar.png",
        "zoom-panel.png"
    ];

    if (overrideImages.indexOf(image) != -1) {
        return getPortalBase() + "/images/openlayers/" + image;
    }
    else {
        return OpenLayers.Util.__getImageLocation(image);
    }
};

OpenLayers.Layer.DOWNLOAD_FORMAT_CSV = 'csv';

OpenLayers.Layer.prototype.isOverlay = function() {
    return !this.isBaseLayer;
};

// Override WMS.getURL to include proxy
OpenLayers.Layer.WMS.prototype.___getURL = OpenLayers.Layer.WMS.prototype.getURL;
OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
    return Portal.utils.Proxy.proxy(this.___getURL(bounds));
};

OpenLayers.Layer.WMS.prototype.adjustBounds = function(bounds) {
    if (this.wrapDateLine) {
        // wrap around the date line, within the limits of rounding error
        var wrappingOptions = {
            'rightTolerance': this.map.getResolution(),
            'leftTolerance': this.map.getResolution()
        };
        bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);
    }

    if (this.gutter) {
        // Adjust the extent of a bounds in map units by the
        // layer's gutter in pixels.

        var mapGutter = this.gutter * this.map.getResolution();
        bounds = new OpenLayers.Bounds(
                bounds.left - mapGutter,
                bounds.bottom - mapGutter,
                bounds.right + mapGutter,
                bounds.top + mapGutter);
    }

    return bounds;
};

// Modifications to OpenLayers class prototypes
OpenLayers.Layer.WMS.prototype.getFeatureInfoRequestString = function(clickPoint, overrideParams) {
    var baseFeatureInfoParams = {
        REQUEST: "GetFeatureInfo",
        EXCEPTIONS: "application/vnd.ogc.se_xml",
        BBOX: this._getBoundingBox(),
        FORMAT: this.getFeatureInfoFormat(),
        INFO_FORMAT: this.getFeatureInfoFormat(),
        QUERY_LAYERS: this.params.LAYERS,
        FEATURE_COUNT: this.isNcwms() ? 1 : 100,
        SRS: 'EPSG: 4326',
        CRS: 'EPSG: 4326',
        WIDTH: this.map.size.w,
        HEIGHT: this.map.size.h
    };

    if (clickPoint) {
        baseFeatureInfoParams = Ext4.apply(baseFeatureInfoParams, {
            X: clickPoint.x,
            Y: clickPoint.y,
            I: clickPoint.x,
            J: clickPoint.y
        });
    }

    baseFeatureInfoParams = Ext4.apply(baseFeatureInfoParams, overrideParams);
    return this.getFullRequestString(baseFeatureInfoParams);
};

OpenLayers.Layer.WMS.prototype.getFeatureInfoFormat = function() {
    return 'text/html';
};

// formatFeatureInfoHtml may be overriden by sub classes (like NcWMS)
OpenLayers.Layer.WMS.prototype.formatFeatureInfoHtml = function(resp, options) {
    return formatGetFeatureInfo(resp, options);
};

OpenLayers.Layer.WMS.prototype.getFeatureRequestUrl = function(serverUrl, layerName, outputFormat) {

    var builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
        layer: this
    });

    return this._buildGetFeatureRequestUrl(
        serverUrl,
        layerName,
        outputFormat,
        builder.buildCql()
    );
};

OpenLayers.Layer.WMS.prototype._buildGetFeatureRequestUrl = function(baseUrl, layerName, outputFormat, downloadFilter) {

    var wfsUrl = baseUrl;
    wfsUrl += (wfsUrl.indexOf('?') !== -1) ? "&" : "?";
    wfsUrl += 'typeName=' + layerName;
    wfsUrl += '&SERVICE=WFS';
    wfsUrl += '&outputFormat=' + outputFormat;
    wfsUrl += '&REQUEST=GetFeature';
    wfsUrl += '&VERSION=1.0.0';

    if (downloadFilter) {
        wfsUrl += '&CQL_FILTER=' + encodeURIComponent(downloadFilter);
    }

    return wfsUrl;
};

OpenLayers.Layer.WMS.prototype.getCsvDownloadFormat = function() {

    if (this.server.csvDownloadFormat) {
        return this.server.csvDownloadFormat;
    }

    return OpenLayers.Layer.DOWNLOAD_FORMAT_CSV;
};

OpenLayers.Layer.WMS.prototype._getBoundingBox = function() {
    var bounds = this._is130()
        ? new OpenLayers.Bounds.fromArray(this.getExtent().toArray(true))
        : this.getExtent();

    return bounds.toBBOX();
};

OpenLayers.Layer.WMS.prototype._is130 = function() {
    return this.server.wmsVersion === '1.3.0' && !this.isNcwms();
};

OpenLayers.Layer.WMS.prototype.isNcwms = function() {
    return false;
};

OpenLayers.Layer.WMS.prototype.updateCqlFilter = function() {

    var builder = new Portal.filter.combiner.MapCqlBuilder({
        layer: this
    });

    var newValue = builder.buildCql();
    var existingValue = this.params['CQL_FILTER'];

    if (newValue != existingValue) {
        this.mergeNewParams({
            CQL_FILTER: newValue
        });
    }
};

OpenLayers.Layer.WMS.prototype.hasBoundingBox = function() {
    return !Ext.isEmpty(this.bboxMinX) && !Ext.isEmpty(this.bboxMinY) && !Ext.isEmpty(this.bboxMaxX) && !Ext.isEmpty(this.bboxMaxY);
};

OpenLayers.Handler.Drag.prototype.mousedown = function(evt) {
    var propagate = true;
    this.dragging = false;
    if (this.checkModifiers(evt) &&
           (OpenLayers.Event.isLeftClick(evt) ||
            OpenLayers.Event.isSingleTouch(evt))) {
        this.started = true;
        this.start = evt.xy;
        this.last = evt.xy;
        OpenLayers.Element.addClass(
            this.map.viewPortDiv, "olDragDown"
        );
        this.down(evt);
        this.callback("down", [evt.xy]);

        // Leaving this commented out code here so that one can see what's different to the original function.
        // This fixes bugs related to combo boxes not closing when the map is clicked (because the event never
        // propagates to other elements, i.e. the comboboxes). DF: fixed for OpenLayers 2.13.1 as well
        // OpenLayers.Event.preventDefault(evt);

        if(!this.oldOnselectstart) {
            this.oldOnselectstart = document.onselectstart ?
                document.onselectstart : OpenLayers.Function.True;
        }
        document.onselectstart = OpenLayers.Function.False;

        propagate = !this.stopDown;
    } else {
        this.started = false;
        this.start = null;
        this.last = null;
    }
    return propagate;
};

OpenLayers.Layer.WMS.prototype.hasImgLoadErrors = function() {
    return Ext.DomQuery.jsSelect('img.olImageLoadError', this.div).length > 0;
};

OpenLayers.Tile.Image.prototype.__setImgSrc = OpenLayers.Tile.Image.prototype.setImgSrc;
OpenLayers.Tile.Image.prototype.setImgSrc = function(url) {
    // Do not modify behaviour for baselayers, it breaks them!
    if (this.layer.isBaseLayer) {
        return this.__setImgSrc(url);
    }

    if (!url) {
        return;
    }

    if (url && url == this.imgDiv.src) {
        // force reload to generate events expected by openlayers
        this.imgDiv.src = "about:blank";
    }

    this.imgDiv.src = url;
};

OpenLayers.Geometry.prototype.isBox = function() {
    var boundsAsGeom = this.getBounds().toGeometry();

    // TODO: revisit - as this algorithm doesn't work for a rotated rectangle, for example.
    // But I *think* it should work for what's currently possible in the portal.
    return Math.abs(this.getArea() - boundsAsGeom.getArea()) < 0.001;
};

OpenLayers.Geometry.prototype.toWkt = function() {
    var wktFormatter = new OpenLayers.Format.WKTNormalised();
    return wktFormatter.write({ geometry: this });
};

OpenLayers.Geometry.prototype.crossesAntimeridian = function() {
    var bounds = this.getBounds();
    return (normaliseLongitude(bounds.left) > normaliseLongitude(bounds.right));
};

// Workaround OpenLayers issue destroying a layer that's loading by destroying only after its loaded
// refer https://github.com/openlayers/openlayers/issues/1332

OpenLayers.Layer.prototype.destroyWhenLoaded = function() {
    if (this.loading) {
        this._deferDestroyIfNotAlreadyDeferred();
    } else {
        this.destroy();
    }
};

OpenLayers.Layer.prototype._deferDestroyIfNotAlreadyDeferred = function() {
    if (this.destroyDeferred) {
        return;
    }

    this.events.register('loadend', this, function() {
        this.destroy();
    });

    this.destroyDeferred = true;
};

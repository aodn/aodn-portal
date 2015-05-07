/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
        baseFeatureInfoParams = Ext.apply(baseFeatureInfoParams, {
            X: clickPoint.x,
            Y: clickPoint.y,
            I: clickPoint.x,
            J: clickPoint.y
        });
    }

    baseFeatureInfoParams = Ext.apply(baseFeatureInfoParams, overrideParams);
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

/**
 * Issue 925 - Overrride openlayers positionImage to workaround issue with Firefox 27
 * and 28 where images aren't reloaded if the src property is set to the same value
 *
 * Method: positionImage
 * Using the properties currenty set on the layer, position the tile correctly.
 * This method is used both by the async and non-async versions of the Tile.Image
 * code.
 */
OpenLayers.Tile.Image.prototype.positionImage = function() {
    // if the this layer doesn't exist at the point the image is
    // returned, do not attempt to use it for size computation
    if (this.layer === null) {
        return;
    }
    // position the frame
    OpenLayers.Util.modifyDOMElement(this.frame,
        null, this.position, this.size);

    var imageSize = this.layer.getImageSize(this.bounds);
    if (this.layerAlphaHack) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,
            null, null, imageSize, this.url);
    }
    else {
        OpenLayers.Util.modifyDOMElement(this.imgDiv,
            null, null, imageSize);
        // Make sure image load events are generated as required by OpenLayers
        this.setImgSrc(this.url);
    }
};

OpenLayers.Tile.Image.prototype.setImgSrc = function(url) {
    if (!Portal.utils.Browser.imgSrcReload && url == this.imgDiv.src) {
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
    var wktFormatter = new OpenLayers.Format.WKT();
    return wktFormatter.write({ geometry: this });
};

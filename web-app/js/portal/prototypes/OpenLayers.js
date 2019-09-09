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
        SRS: 'EPSG:4326',
        CRS: 'EPSG:4326',
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

OpenLayers.Layer.WMS.getFeatureRequestUrl = function(filters, serverUrl, layerName, outputFormat) {

    var builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
        filters: filters
    });

    return OpenLayers.Layer.WMS.buildGetFeatureRequestUrl(
        serverUrl,
        layerName,
        outputFormat,
        builder.buildCql()
    );
};

OpenLayers.Layer.WMS.buildGetFeatureRequestUrl = function(baseUrl, layerName, outputFormat, downloadFilter) {

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

OpenLayers.Layer.WMS.buildGetFeatureInfoRequestUrl = function(baseUrl, layerName, outputFormat, downloadFilter) {

    var wfsUrl = baseUrl;
    wfsUrl += (wfsUrl.indexOf('?') !== -1) ? "&" : "?";
    wfsUrl += 'SERVICE=WMS';
    wfsUrl += '&VERSION=1.0.0';
    wfsUrl += '&REQUEST=GetFeatureInfo';
    wfsUrl += '&LAYERS=' + layerName;
    wfsUrl += '&BBOX=-180,-90,180,90';
    wfsUrl += '&WIDTH=1';
    wfsUrl += '&HEIGHT=1';
    wfsUrl += '&QUERY_LAYERS=' + layerName;
    wfsUrl += '&INFO_FORMAT=' + outputFormat;
    wfsUrl += '&X=0';
    wfsUrl += '&Y=0';

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
    return this.server.wmsVersion === '1.3.0';
};

OpenLayers.Layer.WMS.prototype.isNcwms = function() {
    return false;
};

OpenLayers.Layer.WMS.prototype.isAla = function() {
    return false;
};

OpenLayers.Layer.WMS.prototype.applyFilters = function(filters) {
    var builder = new Portal.filter.combiner.MapCqlBuilder({
        filters: filters
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

OpenLayers.Geometry.prototype.isBox = function() {
    var boundsAsGeom = this.getBounds().toGeometry();

    // TODO: revisit - as this algorithm doesn't work for a rotated rectangle, for example.
    // But I *think* it should work for what's currently possible in the portal.
    return Math.abs(this.getArea() - boundsAsGeom.getArea()) < 0.001;
};

OpenLayers.Geometry.prototype.getPrettyBounds = function() {
    var bounds = this.getBounds();

    return String.format(
        'From Lat/Lon {0}, {1} to Lat/Lon {2}, {3}',
        toNSigFigs(bounds['bottom'], 3),
        toNSigFigs(bounds['left'], 3),
        toNSigFigs(bounds['top'], 3),
        toNSigFigs(bounds['right'], 3)
    );
};

OpenLayers.Geometry.prototype.toWkt = function() {
    var wktFormatter = new OpenLayers.Format.WKTNormalised();
    return wktFormatter.write({ geometry: this });
};

OpenLayers.Geometry.prototype.crossesAntimeridian = function() {
    var bounds = this.getBounds();
    return (normaliseLongitude(bounds.left) > normaliseLongitude(bounds.right));
};


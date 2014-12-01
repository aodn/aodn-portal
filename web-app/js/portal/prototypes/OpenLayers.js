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

    return this._buildGetFeatureRequestUrl(
        serverUrl,
        layerName,
        outputFormat,
        this.getDownloadFilter()
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
    return this.server.type.contains("1.3.0") && !this.isNcwms();
};

OpenLayers.Layer.WMS.prototype.isNcwms = function() {
    return false;
};

OpenLayers.Layer.WMS.prototype.getCqlFilter = function() {
    if (this.params["CQL_FILTER"]) {
        return this.params["CQL_FILTER"];
    }
    else {
        return "";
    }
};

OpenLayers.Layer.WMS.prototype.setCqlFilter = function(cqlFilter) {
    if (cqlFilter == this.getCqlFilter()) {
        return;
    }

    if (cqlFilter) {
        this.mergeNewParams({
            CQL_FILTER: cqlFilter
        });
    }
    else {
        delete this.params["CQL_FILTER"];
        this.redraw();
    }
};

OpenLayers.Layer.WMS.prototype.getDownloadFilter = function() {

    var filters = [];

    Ext.each(this.filterData, function(data) {
        if (data.cql){
            filters.push(data.cql);
        }
    });

    return filters.join(" AND ");
};

OpenLayers.Layer.WMS.prototype.getMapLayerFilters = function(includeGeomFilter) {

    var filters = [];

    Ext.each(this.filterData, function(data) {

        var filterCQL = data.cql;

        if (!data.downloadOnly || (includeGeomFilter && data.type == "geom")) {
            if (data.visualisationCql != undefined) {
                filterCQL = data.visualisationCql;
            }
            if (filterCQL) {
                filters.push(filterCQL);
            }
        }
    });

    return filters.join(" AND ");
};

OpenLayers.Layer.WMS.prototype.getDownloadFilterDescriptions = function() {

    var filters = [];

    Ext.each(this.filterData, function(data) {
        if (data.humanValue && data.humanValue != "") {
            filters.push(data.humanValue);
        }
    });

    return filters.join("<br/> ");
};

OpenLayers.Layer.WMS.prototype.hasBoundingBox = function() {
    return !Ext.isEmpty(this.bboxMinX) && !Ext.isEmpty(this.bboxMinY) && !Ext.isEmpty(this.bboxMaxX) && !Ext.isEmpty(this.bboxMaxY);
};

OpenLayers.Handler.Drag.prototype.mousedown = function(evt) {
    var propagate = true;
    this.dragging = false;
    if (this.checkModifiers(evt) && OpenLayers.Event.isLeftClick(evt)) {
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
        // propagates to other elements, i.e. the comboboxes).
//        OpenLayers.Event.stop(evt);

        if (!this.oldOnselectstart) {
            this.oldOnselectstart = (document.onselectstart) ? document.onselectstart : OpenLayers.Function.True;
        }
        document.onselectstart = OpenLayers.Function.False;

        propagate = !this.stopDown;
    }
    else {
        this.started = false;
        this.start = null;
        this.last = null;
    }
    return propagate;
};

OpenLayers.Layer.WMS.prototype.hasImgLoadErrors = function() {
    return Ext.DomQuery.jsSelect('img.olImageLoadError', this.div).length > 0;
};

// See git issue 595. In IE8, the layer onload event was not being triggered as
// it was in other browsers when there is an error loading a tile image.  This
// is due to the img element error handlers (onImageLoadError and onerror)
// being executed in random order in IE8 rather than the FIFO order expected by
// OpenLayers (see the first paragraph of the Remarks section in documentation
// of attachEvent at
// http://msdn.microsoft.com/en-us/library/ie/ms536343(v=vs.85).aspx
// and comments in the onerror handler below re expectation by OpenLayers that the
// onImageLoadError has already been run before the onerror handler)
//
// Override the initImgDiv method ensuring the onerror handler is run after the
// onImageLoadError has been processed as is required for the correct operation
// of these handlers.
//
// The code below is copied directly from the OpenLayers implementation of
// OpenLayers.Tile.Image.prototype.initImgDiv replacing the final statement
// with one which ensures the onerror handler is called after the onImageLoadError
// in IE8
//
// Modified code has been marked with a comment below

OpenLayers.Tile.Image.prototype.initImgDiv = function() {
    var offset = this.layer.imageOffset;
    var size = this.layer.getImageSize(this.bounds);

    if (this.layerAlphaHack) {
        this.imgDiv = OpenLayers.Util.createAlphaImageDiv(null,
            offset,
            size,
            null,
            "relative",
            null,
            null,
            null,
            true);
    }
    else {
        this.imgDiv = OpenLayers.Util.createImage(null,
            offset,
            size,
            null,
            "relative",
            null,
            null,
            true);
    }

    this.imgDiv.className = 'olTileImage';

    /* checkImgURL used to be used to called as a work around, but it
     ended up hiding problems instead of solving them and broke things
     like relative URLs. See discussion on the dev list:
     http://openlayers.org/pipermail/dev/2007-January/000205.html

     OpenLayers.Event.observe( this.imgDiv, "load",
     OpenLayers.Function.bind(this.checkImgURL, this) );
     */
    this.frame.style.zIndex = this.isBackBuffer ? 0 : 1;
    this.frame.appendChild(this.imgDiv);
    this.layer.div.appendChild(this.frame);

    if (this.layer.opacity != null) {

        OpenLayers.Util.modifyDOMElement(this.imgDiv, null, null, null,
            null, null, null,
            this.layer.opacity);
    }

    // we need this reference to check back the viewRequestID
    this.imgDiv.map = this.layer.map;

    //bind a listener to the onload of the image div so that we
    // can register when a tile has finished loading.
    var onload = function() {

        //normally isLoading should always be true here but there are some
        // right funky conditions where loading and then reloading a tile
        // with the same url *really*fast*. this check prevents sending
        // a 'loadend' if the msg has already been sent
        //
        if (this.isLoading) {
            this.isLoading = false;
            this.events.triggerEvent("loadend");
        }
    };

    if (this.layerAlphaHack) {
        OpenLayers.Event.observe(this.imgDiv.childNodes[0], 'load',
            OpenLayers.Function.bind(onload, this));
    }
    else {
        OpenLayers.Event.observe(this.imgDiv, 'load',
            OpenLayers.Function.bind(onload, this));
    }

    // Bind a listener to the onerror of the image div so that we
    // can registere when a tile has finished loading with errors.
    var onerror = function() {

        // If we have gone through all image reload attempts, it is time
        // to realize that we are done with this image. Since
        // OpenLayers.Util.onImageLoadError already has taken care about
        // the error, we can continue as if the image was loaded
        // successfully.
        if (this.imgDiv._attempts > OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
            onload.call(this);
        }
    };

    // ===================================================================
    // The following code has been modified from the OpenLayers version
    // of this method
    //====================================================================

    // In IE8 guarantee onerror runs after onImageLoadError by running it
    // in a timer

    if (Ext.isIE8) {
        var that = this;

        OpenLayers.Event.observe(this.imgDiv, "error", function() {
            onerror.defer(1, that)
        });
    }
    else {
        OpenLayers.Event.observe(this.imgDiv, "error",
            OpenLayers.Function.bind(onerror, this));
    }
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

OpenLayers.Map.prototype.EVENT_TYPES.push('spatialconstraintadded');
OpenLayers.Map.prototype.EVENT_TYPES.push('spatialconstraintcleared');
OpenLayers.Map.prototype.EVENT_TYPES.push('spatialconstrainttypechanged');

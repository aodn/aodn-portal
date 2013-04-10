/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

OpenLayers.Layer.WMS.prototype.adjustBounds = function (bounds) {
    if (this.wrapDateLine) {
        // wrap around the date line, within the limits of rounding error
        var wrappingOptions = {
            'rightTolerance':this.map.getResolution(),
            'leftTolerance':this.map.getResolution()
        };
        bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);

    }

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
    return this.server.type.contains("1.3.0") && !this.isNcwms();
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

//overrides original openlayers method,
// adds a check to not run the method if bounds are outside of vertical extent
OpenLayers.Tile.Image.prototype.draw = function() {
    if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
        this.bounds = this.
            BaseLayer(this.position);
    }
    var drawTile = OpenLayers.Tile.prototype.draw.apply(this, arguments);

    if ((OpenLayers.Util.indexOf(this.layer.SUPPORTED_TRANSITIONS, this.layer.transitionEffect) != -1) ||
        this.layer.singleTile) {
        if (drawTile) {
            //we use a clone of this tile to create a double buffer for visual
            //continuity.  The backBufferTile is used to create transition
            //effects while the tile in the grid is repositioned and redrawn
            if (!this.backBufferTile) {
                this.backBufferTile = this.clone();
                this.backBufferTile.hide();
                // this is important.  It allows the backBuffer to place itself
                // appropriately in the DOM.  The Image subclass needs to put
                // the backBufferTile behind the main tile so the tiles can
                // load over top and display as soon as they are loaded.
                this.backBufferTile.isBackBuffer = true;

                // potentially end any transition effects when the tile loads
                this.events.register('loadend', this, this.resetBackBuffer);

                // clear transition back buffer tile only after all tiles in
                // this layer have loaded to avoid visual glitches
                this.layer.events.register("loadend", this, this.resetBackBuffer);
            }
            // run any transition effects
            this.startTransition();
        } else {
            // if we aren't going to draw the tile, then the backBuffer should
            // be hidden too!
            if (this.backBufferTile) {
                this.backBufferTile.clear();
            }
        }
    } else {
        if (drawTile && this.isFirstDraw) {
            this.events.register('loadend', this, this.showTile);
            this.isFirstDraw = false;
        }
    }


    //here is the if statement we add to the original method.
    /******Start added*******/
    var maxExtent = this.layer.maxExtent;

    if(this.bounds.bottom < maxExtent.bottom ||
        this.bounds.top > maxExtent.top)
    {
        drawTile = false;
    }

    /******End added*******/

    if (!drawTile) {
        return false;
    }

    if (this.isLoading) {
        //if we're already loading, send 'reload' instead of 'loadstart'.
        this.events.triggerEvent("reload");
    } else {
        this.isLoading = true;
        this.events.triggerEvent("loadstart");
    }

    return this.renderTile();
};


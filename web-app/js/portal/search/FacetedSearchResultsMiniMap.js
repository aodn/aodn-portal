/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsMiniMap = Ext.extend(OpenLayers.Map, {

    GOOGLE_MAPS_PROJECTION: new OpenLayers.Projection("EPSG:900913"),
    EPSG_4326_PROJECTION: new OpenLayers.Projection("EPSG:4326"),

    constructor: function(values) {

        Ext.apply(this, {
            controls: [
                new OpenLayers.Control.MousePosition({
                    emptyString: this._unavailableExtentMsgIfNoBounds(values.bbox)
                })
            ],
            displayProjection: this.EPSG_4326_PROJECTION,
            metadataExtent: values.bbox,
            uuid: values.uuid
        });

        Portal.search.FacetedSearchResultsMiniMap.superclass.constructor.call(this);
    },

    _unavailableExtentMsgIfNoBounds: function(bbox) {
        return bbox.getBounds() ? '' : OpenLayers.i18n('unavailableExtent');
    },

    addLayersAndRender: function() {
        this._addBaseAndExtentLayers();

        var self = this;
        setTimeout(function() {
            self._renderAndPosition();
        }, 10);
    },

    _addBaseAndExtentLayers: function() {
        this.addLayers([
            this._getBaseLayer(),
            this._getExtentLayer()
        ]);
    },

    _renderAndPosition: function() {
        this.render("fsSearchMap" + this.uuid);

        if (this.metadataExtent.getBounds()) {
            this.setCenter(
                this._getCenterLonLat().transform(
                    this.EPSG_4326_PROJECTION, this.GOOGLE_MAPS_PROJECTION),
                this._calculateZoomLevel(
                    this.metadataExtent.getBounds().transform(
                        this.EPSG_4326_PROJECTION,
                        this.GOOGLE_MAPS_PROJECTION))
            );
        } else {
            this.zoomToExtent(
                new OpenLayers.Bounds.fromString(Portal.app.config.defaultDatelineZoomBbox).transform(
                    this.EPSG_4326_PROJECTION,
                    this.GOOGLE_MAPS_PROJECTION
                )
            );
        }
    },

    _getBaseLayer: function() {
        return new OpenLayers.Layer.Google(
            "Google Satellite Base Layer",
            {
                type: google.maps.MapTypeId.SATELLITE
            }
        );
    },

    _getExtentLayer: function() {
        return this.metadataExtent.getLayer(this.GOOGLE_MAPS_PROJECTION)
    },

    _calculateZoomLevel: function(bounds) {
        var zoomLevel = this.getZoomForExtent(bounds);
        if (zoomLevel == 0) {
            // 0 is too large
            zoomLevel = 1;
        } else if (zoomLevel > 4) {
            // Anything over 4 doesn't show enough to get an idea of where things are
            zoomLevel = 4;
        }
        return zoomLevel;
    },

    _getCenterLonLat: function() {
        var LONGITUDE_OF_AUSTRALIA = 90;
        var bounds = this.metadataExtent.getBounds();
        var centerLonLat = bounds.getCenterLonLat();

        if (this.getZoomForExtent(bounds) == 0) {
            centerLonLat.lon = LONGITUDE_OF_AUSTRALIA;
        }

        return centerLonLat;
    }
});

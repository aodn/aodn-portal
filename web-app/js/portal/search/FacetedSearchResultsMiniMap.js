/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsMiniMap = Ext.extend(OpenLayers.Map, {

    EPSG_4326_PROJECTION: new OpenLayers.Projection("EPSG:4326"),

    constructor: function(values) {
        Ext.apply(this, {
            controls: [],
            metadataExtent: values.bbox,
            uuid: values.uuid,
            storeRowIndex: values.storeRowIndex
        });

        Portal.search.FacetedSearchResultsMiniMap.superclass.constructor.call(this);
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

        var theUuid = "fsSearchMap-" + this.storeRowIndex + "-" + this.uuid;
        // element may have been removed see issue #938
        if (Ext.get(theUuid)) {

            this.render(theUuid);
            if (this.metadataExtent.getBounds()) {
                this.setCenter(
                    this._getCenterLonLat(),
                    this._calculateZoomLevel(this.metadataExtent.getBounds())
                );
            }
            else {
                this.zoomToExtent(new OpenLayers.Bounds.fromString(Portal.app.config.defaultDatelineZoomBbox));
            }
        }
    },

    _getBaseLayer: function() {
        return new OpenLayers.Layer.WMS(
            appConfigStore.getById('minimap.baselayer.name').data.value,
            appConfigStore.getById('minimap.baselayer.url').data.value,
            appConfigStore.getById('minimap.baselayer.params').data.value,
            { wrapDateLine: true }
        );
    },

    _getExtentLayer: function() {
        return this.metadataExtent.getLayer();
    },

    _calculateZoomLevel: function(bounds) {
        var zoomLevel = this.getZoomForExtent(bounds);
        if (zoomLevel == 0) {
            // 0 is too large
            zoomLevel = 1;
        }
        else if (zoomLevel > 4) {
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

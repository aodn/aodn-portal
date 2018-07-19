Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsMiniMap = Ext.extend(OpenLayers.Map, {

    EPSG_4326_PROJECTION: new OpenLayers.Projection("EPSG:4326"),
    MAXZOOMLEVEL: 3,

    constructor: function(values) {

        var restrictedExtent = new OpenLayers.Bounds(-360,-90,360,90);

        Ext.apply(this, {
            controls: [],
            metadataExtent: values.bbox,
            mapContainerId: values.mapContainerId,
            restrictedExtent:restrictedExtent,
            wrapDateLine:true
        });

        Portal.search.FacetedSearchResultsMiniMap.superclass.constructor.call(this);
    },

    addLayersAndRender: function() {
        this._addBaseAndExtentLayers();
        this._renderAndPosition();
    },

    _addBaseAndExtentLayers: function() {
        this.addLayers([
            this._getBaseLayer(),
            this._getExtentLayer()
        ]);
    },

    _renderAndPosition: function() {

        // element may have been removed see issue #938
        if (Ext.get(this.mapContainerId)) {

            this.render(this.mapContainerId);

            var extent = this.metadataExtent.getBounds();
            if (!extent) {
                extent = new OpenLayers.Bounds.fromString(Portal.app.appConfig.portal.defaultDatelineZoomBbox);
            }

            this.zoomToExtent(extent);
            var zoomlevel = (this.getZoomForExtent(extent) > this.MAXZOOMLEVEL) ? this.MAXZOOMLEVEL : this.getZoomForExtent(extent);

            // Override center for world datasets aodn/issues/issues/220
            if (this._antimeridianAdjacentGeometries()) {
                this._zoomToMultiGeometries(zoomlevel);
            }
            else {
                this.zoomTo(zoomlevel);
            }
        }
    },

    _zoomToMultiGeometries: function(zoomlevel) {
        var geometries = this.metadataExtent.getGeometries();
        var combinedBounds = geometries[0].getBounds();
        for (var i = 1; i < geometries.length; i++) {
            var boundsToAdd = geometries[i].getBounds();
            combinedBounds = this._centreAdjacentGeometries(combinedBounds, boundsToAdd);
        }
        var centreLonLat = combinedBounds.getCenterLonLat();
        this.setCenter([centreLonLat.lon, centreLonLat.lat], zoomlevel);
    },

    _centreAdjacentGeometries: function(bounds, boundsToCompare) {
        var centredBounds = new OpenLayers.Bounds();
        var boundWidth = bounds.getWidth();
        var widthToCompare = boundsToCompare.getWidth();
        // Check for extent adjacency over the antimeridian
        if ((bounds.right == 180 && boundsToCompare.left == -180)) { 
            if (boundWidth > widthToCompare) {
                centredBounds = bounds.clone();
                centredBounds.left += widthToCompare;
            }
            else {
                centredBounds = boundsToCompare.clone();
                centredBounds.right +- boundWidth;
            }
        } else if (bounds.left == -180 && boundsToCompare.right == 180) {
            if (boundWidth > widthToCompare) {
                centredBounds = bounds.clone();
                centredBounds.right +- widthToCompare;
            }
            else {
                centredBounds = boundsToCompare.clone();
                centredBounds.left += boundWidth;
            }
        }
        return centredBounds;
    },

    _antimeridianAdjacentGeometries: function() {
        var non_global_geometries = [];
        var geometries = this.metadataExtent.getGeometries();
        for (var i = 0; i < geometries.length; i++) {
            bounds = geometries[i].getBounds();
            if (bounds.left == -180 && bounds.right == 180) {
                //global coverage, so automatically stop here
                return false;
            }
            else if (bounds.left != -180 || bounds.right != 180) {
                non_global_geometries.push(geometries[i])
            }
        }
        
        for (var i = 0; i < non_global_geometries.length; i++) {
            non_global_bounds = non_global_geometries[i].getBounds();
            if (non_global_bounds.right == 180) {
                for (var j = 0; j < non_global_geometries.length; j++) {
                    if (i != j) {
                        boundsToCompare = non_global_geometries[j].getBounds();
                        if (boundsToCompare.left == -180) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },    
        
    _getBaseLayer: function() {
        return new OpenLayers.Layer.MiniMapBaseLayer();
    },

    _getExtentLayer: function() {
        return this.metadataExtent.getLayer();
    }
});

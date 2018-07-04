Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsMiniMap = Ext.extend(OpenLayers.Map, {

    EPSG_4326_PROJECTION: new OpenLayers.Projection("EPSG:4326"),
    MAXZOOMLEVEL: 3,

    constructor: function(values) {

        var restrictedExtent = new OpenLayers.Bounds(-180,-90,180,90);

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
            var zoomlevel =  (this.getZoomForExtent(extent) > this.MAXZOOMLEVEL) ? this.MAXZOOMLEVEL : this.getZoomForExtent(extent);

            // Override center for world datasets aodn/issues/issues/220
            if (Math.abs(extent.left) == Math.abs(extent.right)) {
                var lat = extent.getCenterLonLat().lat;
                this.setCenter([180,lat],zoomlevel)
            }
            else {
                this.zoomTo(zoomlevel);
            }
        }
    },

    _getBaseLayer: function() {
        return new OpenLayers.Layer.MiniMapBaseLayer();
    },

    _getExtentLayer: function() {
        return this.metadataExtent.getLayer();
    }
});

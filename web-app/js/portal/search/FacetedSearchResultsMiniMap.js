Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsMiniMap = Ext.extend(OpenLayers.Map, {

    EPSG_4326_PROJECTION: new OpenLayers.Projection("EPSG:4326"),

    constructor: function(values) {
        Ext.apply(this, {
            controls: [],
            metadataExtent: values.bbox,
            mapContainerId: values.mapContainerId
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
        }
    },

    _getBaseLayer: function() {
        return new OpenLayers.Layer.MiniMapBaseLayer();
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
    }
});

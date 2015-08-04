

Ext.namespace('Portal.search');

Portal.search.MetadataExtent = Ext.extend(Object, {

    constructor:function (cfg) {
        this.geometries = [];
    },

    addBBox: function(geoBox) {
        this.geometries.push(this._geoBoxToGeometry(geoBox));
    },

    addPolygon: function(wktPolygon) {
        var geometry = new OpenLayers.Geometry.fromWKT(wktPolygon);
        if (geometry instanceof OpenLayers.Geometry) {
            this.geometries.push(geometry);
        }
        else {
            log.error("Cannot make polygon out of '" + wktPolygon + "'");
        }
    },

    getLayer: function() {
        var boundingBoxLayer = new OpenLayers.Layer.Vector(
            "Metadata Polygons"
        );
        boundingBoxLayer.addFeatures(this._vectorFeatures());
        return boundingBoxLayer;
    },

    getBounds: function() {
        if (!this.bounds && this.geometries.length > 0) {
            this.bounds = new OpenLayers.Bounds();

            // Create a Bounds object and extend it to contain all given bounds
            // defined in this.geometries
            for (var i = 0; i < this.geometries.length; i++) {
                this.bounds.extend(this.geometries[i].getBounds());
            }
        }
        return this.bounds;
    },

    _vectorFeatures: function() {
        var features = [];
        Ext.each(this.geometries, function(geometry, index, all) {
            features.push(new OpenLayers.Feature.Vector(geometry));
        }, this);

        return features;
    },

    _geoBoxToGeometry: function(geoBoxStr) {
        var bounds = geoBoxStr.split("|");

        var openLayersBounds = new OpenLayers.Bounds(
            parseFloat(bounds[0]), // left
            parseFloat(bounds[1]), // bot
            parseFloat(bounds[2]), // right
            parseFloat(bounds[3])  // top
        );

        return openLayersBounds.toGeometry();
    }
});

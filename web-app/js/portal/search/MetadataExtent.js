/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.MetadataExtent = Ext.extend(Object, {

    constructor:function (cfg) {
        this.polygons = [];
    },

    addBBox: function(geoBox) {
        this.polygons.push(this._toGeoBox(geoBox));
    },

    addPolygon: function(polygon) {
        this.polygons.push(this._wktPolygonToGeoBox(polygon));
    },

    getLayer: function() {
        var boundingBoxLayer = new OpenLayers.Layer.Vector(
            "Metadata Polygons"
        );
        boundingBoxLayer.addFeatures(this._vectorFeatures());
        return boundingBoxLayer;
    },

    getBounds: function() {
        if (!this.bounds && this.polygons.length > 0) {
            this.bounds = new OpenLayers.Bounds();

            // Create a Bounds object and extend it to contain all given bounds
            // defined in this.polygons
            for (var i = 0; i < this.polygons.length; i++) {
                this.bounds.extend(new OpenLayers.Bounds(
                    this.polygons[i].west,
                    this.polygons[i].south,
                    this.polygons[i].east,
                    this.polygons[i].north
                ));
            }
        }
        return this.bounds;
    },

    _vectorFeatures: function() {
        var features = [];
        Ext.each(this.polygons, function(geoBox, index, all) {
            features.push(new OpenLayers.Feature.Vector(this._boundingBoxPolygon(geoBox)));
        }, this);

        return features;
    },

    _boundingBoxPolygon: function(geoBox) {
        return new OpenLayers.Geometry.Polygon(this._boundingBoxLinearRings(geoBox));
    },

    _boundingBoxLinearRings: function(geoBox) {
        return new OpenLayers.Geometry.LinearRing(this._boundingBoxPoints(geoBox));
    },

    _boundingBoxPoints: function(geoBox) {
        return [
            this._point(geoBox.east, geoBox.south),
            this._point(geoBox.east, geoBox.north),
            this._point(geoBox.west, geoBox.north),
            this._point(geoBox.west, geoBox.south)
        ]
    },

    _point: function(x, y) {
        return new OpenLayers.Geometry.Point(x, y);
    },

    _wktPolygonToGeoBox: function(polygon) {
        var wktPolygon = new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT(polygon));
        var bounds = wktPolygon.geometry.getBounds();
        return {
            west: bounds.left,
            south: bounds.bottom,
            east: bounds.right,
            north: bounds.top
        };
    },

    _toGeoBox: function(geoBoxStr) {
        var bounds = geoBoxStr.split("|");
        return {
            west: parseFloat(bounds[0]),
            south: parseFloat(bounds[1]),
            east: parseFloat(bounds[2]),
            north: parseFloat(bounds[3])
        };
    }
});

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

    addPolygon: function(geoBox) {
        this.polygons.push(this._toGeoBox(geoBox))
    },

    getLayer: function(dstProjection) {
        var boundingBoxLayer = new OpenLayers.Layer.Vector(
            "Metadata Polygons"
        );
        boundingBoxLayer.addFeatures(this._vectorFeatures(dstProjection));
        return boundingBoxLayer;
    },

    getBounds: function() {
        if (!this.bounds && this.polygons.length > 0) {
            this.bounds = new OpenLayers.Bounds(this.polygons[0].west, this.polygons[0].south, this.polygons[0].east, this.polygons[0].north);
        }

        return this.bounds;
    },

    _vectorFeatures: function(dstProjection) {
        var features = [];
        Ext.each(this.polygons, function(geoBox, index, all) {
            features.push(new OpenLayers.Feature.Vector(this._boundingBoxPolygon(geoBox, dstProjection)));
        }, this);

        return features;
    },

    _boundingBoxPolygon: function(geoBox, dstProjection) {
        return new OpenLayers.Geometry.Polygon(this._boundingBoxLinearRings(geoBox, dstProjection));
    },

    _boundingBoxLinearRings: function(geoBox, dstProjection) {
        var ring = new OpenLayers.Geometry.LinearRing(this._boundingBoxPoints(geoBox));

        if (dstProjection) {
            ring.transform(new OpenLayers.Projection("EPSG:4326"), dstProjection);
        }
        return [ring];
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

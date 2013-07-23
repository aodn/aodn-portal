/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.MetadataExtent", function() {

    it("creates a geoBox object from a geonetwork geobox string element", function() {
        var extent = new Portal.search.MetadataExtent();
        var geoBox = extent._toGeoBox("140|-60|180|-30");

        expect(geoBox.west).toEqual(140);
        expect(geoBox.south).toEqual(-60);
        expect(geoBox.east).toEqual(180);
        expect(geoBox.north).toEqual(-30);
    });

    it("creates an object that acts as an OpenLayers point", function() {
        var extent = new Portal.search.MetadataExtent();
        var point = extent._point(140, -60);

        expect(point.x).toEqual(140);
        expect(point.y).toEqual(-60);
    });

    it("creates an array of points that mimic a bounding box going SE NE NW SW", function() {
        var geoBox = {
            west: 140,
            south: -60,
            east: 180,
            north: -30
        };

        var extent = new Portal.search.MetadataExtent();
        var points = extent._boundingBoxPoints(geoBox);

        expect(points[0].x).toEqual(geoBox.east);
        expect(points[0].y).toEqual(geoBox.south);
        expect(points[1].x).toEqual(geoBox.east);
        expect(points[1].y).toEqual(geoBox.north);
        expect(points[2].x).toEqual(geoBox.west);
        expect(points[2].y).toEqual(geoBox.north);
        expect(points[3].x).toEqual(geoBox.west);
        expect(points[3].y).toEqual(geoBox.south);
    });

    it("adds a polygon to the extent", function() {
        var extent = new Portal.search.MetadataExtent();
        var before = extent.polygons.length;
        extent.addPolygon("140|-60|180|-30");

        expect(extent.polygons.length).toEqual(before + 1);
    });

    it("creates a feature per polygon", function() {
        var extent = new Portal.search.MetadataExtent();
        extent.addPolygon("140|-60|180|-30");
        extent.addPolygon("-180|-60|-140|-30");

        expect(extent._vectorFeatures().length).toEqual(extent.polygons.length);
    });

    it("creates a layer", function() {
        var extent = new Portal.search.MetadataExtent();
        // The expectation here is that the method executes without error
        extent.getLayer();
    });

    it("does not error returning a bounds when there are no polygons", function() {
        var extent = new Portal.search.MetadataExtent();

        expect(extent.getBounds()).toBeUndefined();
    });

    it("creates a bounds", function() {
        var extent = new Portal.search.MetadataExtent();
        extent.addPolygon("140|-60|180|-30");

        expect(extent.getBounds()).not.toBeUndefined();
    });

    it("creates a bounds from the first polygon when several are included", function() {
        var extent = new Portal.search.MetadataExtent();
        extent.addPolygon("140|-60|180|-30");
        extent.addPolygon("-180|-60|-140|-30");

        var boundsArray = extent.getBounds().toArray();
        expect(boundsArray[0]).toEqual(140);
        expect(boundsArray[1]).toEqual(-60);
        expect(boundsArray[2]).toEqual(180);
        expect(boundsArray[3]).toEqual(-30);
    });
});
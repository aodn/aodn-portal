

describe("Portal.search.MetadataExtent", function() {

    it("creates a geometry out of geoBox string", function() {
        var extent = new Portal.search.MetadataExtent();
        var geometry = extent._geoBoxToGeometry("140|-60|180|-30");

        expect(geometry.toString()).toEqual("POLYGON((140 -60,180 -60,180 -30,140 -30,140 -60))");
    });

    it("adds a bbox to the geometries", function() {
        var extent = new Portal.search.MetadataExtent();
        var before = extent.geometries.length;
        extent.addBBox("140|-60|180|-30");

        expect(extent.geometries.length).toEqual(before + 1);
    });

    it("creates a feature per geometry", function() {
        var extent = new Portal.search.MetadataExtent();
        extent.addBBox("140|-60|180|-30");
        extent.addBBox("-180|-60|-140|-30");

        expect(extent._vectorFeatures().length).toEqual(extent.geometries.length);
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
        extent.addBBox("140|-60|180|-30");

        expect(extent.getBounds()).not.toBeUndefined();
    });

    it("creates a bounds from all polygons", function() {
        var extent = new Portal.search.MetadataExtent();
        extent.addBBox("140|-60|180|-30");
        extent.addBBox("-180|-60|-140|-30");

        var boundsArray = extent.getBounds().toArray();
        expect(boundsArray[0]).toEqual(-180);
        expect(boundsArray[1]).toEqual(-60);
        expect(boundsArray[2]).toEqual(180);
        expect(boundsArray[3]).toEqual(-30);
    });

    it("adds a WKT polygon", function() {
        var extent = new Portal.search.MetadataExtent();
        extent.addPolygon("POLYGON((-120 -38,-120 -40,-122 -40,-124 -40,-124 -38,-122 -38,-122 -36,-120 -36,-118 -36,-118 -38,-120 -38))");

        var boundsArray = extent.getBounds().toArray();
        expect(boundsArray[0]).toEqual(-124);
        expect(boundsArray[1]).toEqual(-40);
        expect(boundsArray[2]).toEqual(-118);
        expect(boundsArray[3]).toEqual(-36);
    });
});

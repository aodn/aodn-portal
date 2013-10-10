/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.FacetMapPanel", function() {

    var facetMapPanel;

    beforeEach(function() {
        facetMapPanel = new Portal.search.FacetMapPanel({
            initialBbox: '1, 2, 3, 4'
        });
    });

    describe('map controls', function() {
        it('zoom panel', function() {
            expect(facetMapPanel.map.controls[0]).toBeInstanceOf(OpenLayers.Control.ZoomPanel);
        });

        it('geofacet map toolbar', function() {
            expect(facetMapPanel.map.controls[1]).toBeInstanceOf(Portal.search.GeoFacetMapToolbar);
        });

        it('activates the geo facet map toolbar default control', function() {
            spyOn(Portal.search.GeoFacetMapToolbar.prototype, 'activateDefaultControl');
            var panel = new Portal.search.FacetMapPanel({
                initialBbox: '1, 2, 3, 4'
            });
            expect(Portal.search.GeoFacetMapToolbar.prototype.activateDefaultControl).toHaveBeenCalled();
        });
    });

    describe('getBoundingPolygonAsWKT', function() {
        it("getBoundingPolygonAsWKT with no features", function() {
            expect(facetMapPanel.getBoundingPolygonAsWKT()).toBeFalsy();
        });

        it("getBoundingPolygonAsWKT with three features", function() {
            facetMapPanel.polygonVector = new OpenLayers.Layer.Vector("GeoFilter Vector");

            var points = [
                new OpenLayers.Geometry.Point(1, 2),
                new OpenLayers.Geometry.Point(3, 4),
                new OpenLayers.Geometry.Point(5, 6)
            ];
            var ring = new OpenLayers.Geometry.LinearRing(points);
            var polygon = new OpenLayers.Geometry.Polygon([ring]);

            var feature = new OpenLayers.Feature.Vector(polygon); //, attributes);
            facetMapPanel.polygonVector.addFeatures([feature]);

            expect(facetMapPanel.getBoundingPolygonAsWKT()).toBeTruthy();
            expect(facetMapPanel.getBoundingPolygonAsWKT()).toBe('POLYGON((1 2,3 4,5 6,1 2))');
        });
    });
});

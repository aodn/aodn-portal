/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.GeoFacetMapToolbar", function() {

    var toolbar;
    var layer;

    beforeEach(function() {
        layer = new OpenLayers.Layer.Vector();
        toolbar = new Portal.search.GeoFacetMapToolbar(layer);
    });

    describe('controls', function() {
        it('navigation', function() {
            expect(toolbar.controls[0]).toBeInstanceOf(OpenLayers.Control.Navigation);
        });

        it('draw feature', function() {
            expect(toolbar.controls[1]).toBeInstanceOf(OpenLayers.Control.DrawFeature);
            expect(toolbar.controls[1].layer).toBe(layer);
        });
    });
});

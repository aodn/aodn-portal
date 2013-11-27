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
});

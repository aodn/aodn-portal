
describe("Portal.search.FacetMapPanel", function() {

    var facetMapPanel;

    beforeEach(function() {
        facetMapPanel = new Portal.search.FacetMapPanel({
            initialBbox: '1, 2, 3, 4'
        });
    });

    describe('synching map mouse position', function() {
        it('calls map.updateSize on map mouse move event', function() {
            spyOn(facetMapPanel.map, 'updateSize');
            OpenLayers.Layer.prototype.getLonLatFromViewPortPx = function(px) { return { lon: 1, lat: 2 } };
            facetMapPanel.map.events.triggerEvent('mousemove');
            expect(facetMapPanel.map.updateSize).toHaveBeenCalled();
        });

        it('calls map.updateSize on map mouse over event', function() {
            spyOn(facetMapPanel.map, 'updateSize');
            facetMapPanel.map.events.triggerEvent('mouseover');
            expect(facetMapPanel.map.updateSize).toHaveBeenCalled();
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

describe("Portal.filter.GeometryFilterService", function() {

    var filterPanel;
    var map;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();
        map.navigationControl = {};
        map.navigationControl.deactivate = returns(null);

        spyOn(Portal.filter.ui.GeometryFilterService.prototype, '_updateWithGeometry');
        filterPanel = new Portal.filter.ui.GeometryFilterService({
            map: map
        });
    });

    describe('map', function() {

        it("subscribes to 'spatialconstraintadded' event", function() {

            var geometry = {};

            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(filterPanel._updateWithGeometry).toHaveBeenCalledWith(geometry);
        });

        it("subscribes to 'spatialconstraintcleared' event", function() {
            map.events.triggerEvent('spatialconstraintcleared');
            expect(filterPanel._updateWithGeometry).toHaveBeenCalledWith();
        });
    });
});

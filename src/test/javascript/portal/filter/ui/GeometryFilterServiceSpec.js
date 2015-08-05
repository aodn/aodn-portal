/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.GeometryFilterService", function() {

    var filterPanel;
    var map;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();
        map.navigationControl = {};
        map.navigationControl.deactivate = returns(null);

        spyOn(Portal.filter.ui.GeometryFilterService.prototype, '_updateWithGeometry');
        filterPanel = new Portal.filter.ui.GeometryFilterService({
            map: map,
            filter: {
                getName: returns('geom_filter'),
                setValue: noOp,
                clearValue: noOp
            }
        });

        spyOn(window, 'trackUsage');
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

    describe('handleRemoveFilter', function() {
        it('clears the spatial constraint', function() {
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(map.spatialConstraintControl, 'clear');

            filterPanel.handleRemoveFilter();
            expect(map.spatialConstraintControl.clear).toHaveBeenCalled();
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Spatial Constraint", "cleared", undefined);
            expect(filterPanel._updateWithGeometry).toHaveBeenCalledWith();
        });
    });
});

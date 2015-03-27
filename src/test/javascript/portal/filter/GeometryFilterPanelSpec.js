/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.GeometryFilterPanel", function() {

    var filterPanel;
    var map;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();
        map.navigationControl = {};
        map.navigationControl.deactivate = function() { return null };

        spyOn(Portal.filter.ui.GeometryFilterPanel.prototype, 'setLayerAndFilter');
        spyOn(Portal.filter.ui.GeometryFilterPanel.prototype, '_updateWithGeometry');
        filterPanel = new Portal.filter.ui.GeometryFilterPanel({
            layer: {
                map: map
            },
            filter: {
                getName: function() { return 'geom_filter' }
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

    describe('getCQL', function () {

        it('calls correct method for polygon geometry type', function () {
            filterPanel.geometry = { toWkt: function() { return "[WKT]" } };
            expect(filterPanel.getCQL()).toBe('INTERSECTS(geom_filter,[WKT])');
        });

        it('returns empty string when geometry is falsy', function() {
            filterPanel.geometry = undefined;
            expect(filterPanel.getCQL()).toEqual(undefined);
        });
    });
});

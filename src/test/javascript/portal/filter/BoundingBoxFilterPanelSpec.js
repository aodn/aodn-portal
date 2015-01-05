/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BoundingBoxFilterPanel", function() {

    var boundingBoxFilter;
    var map;

    beforeEach(function() {
        map = new OpenLayers.SpatialConstraintMap();
        map.navigationControl = {};
        map.navigationControl.deactivate = function() {return null};

        spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, 'setLayerAndFilter');
        spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, '_updateWithGeometry');
        boundingBoxFilter = new Portal.filter.BoundingBoxFilterPanel({
            layer: {
                map: map
            },
            filter: { name: 'geom_filter' }
        });

        spyOn(window, 'trackUsage');
    });

    it('filter name should be undefined', function() {
        boundingBoxFilter.filter = {
            name: 'this name should be ignored'
        };

        expect(boundingBoxFilter.getFilterName()).toEqual(undefined);
    });

    it("isVisualised() should return false", function() {
        expect(boundingBoxFilter.isVisualised()).toBe(false);
    });

    describe('map', function() {

        it("subscribes to 'spatialconstraintadded' event", function() {

            var geometry = {};

            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(boundingBoxFilter._updateWithGeometry).toHaveBeenCalledWith(geometry);
        });

        it("subscribes to 'spatialconstraintcleared' event", function() {
            map.events.triggerEvent('spatialconstraintcleared');
            expect(boundingBoxFilter._updateWithGeometry).toHaveBeenCalledWith();
        });
    });

    describe('handleRemoveFilter', function() {
        it('clears the spatial constraint', function() {
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
            spyOn(map.spatialConstraintControl, 'clear');

            boundingBoxFilter.handleRemoveFilter();
            expect(map.spatialConstraintControl.clear).toHaveBeenCalled();
            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Spatial Constraint", "cleared", undefined);
            expect(boundingBoxFilter._updateWithGeometry).toHaveBeenCalledWith();
        });
    });

    describe('getCQL', function () {

        it('calls correct method for polygon geometry type', function () {
            boundingBoxFilter.geometry = { toWkt: function() { return "[WKT]" } };
            expect(boundingBoxFilter.getCQL()).toBe('INTERSECTS(geom_filter,[WKT])');
        });

        it('returns empty string when geometry is falsy', function() {
            boundingBoxFilter.geometry = undefined;
            expect(boundingBoxFilter.getCQL()).toEqual(undefined);
        });
    });

    describe('is a real polygon', function() {

        it('returns true when a polygon', function() {
            boundingBoxFilter.map.updateSpatialConstraintStyle("polygon");
            expect(boundingBoxFilter.isRealPolygon()).toEqual(true);
        });

        it('returns false when not a polygon', function() {
            boundingBoxFilter.map.updateSpatialConstraintStyle("bogus");
            expect(boundingBoxFilter.isRealPolygon()).toEqual(false);
        });
    });

    it("hasValue() is true if spatial constraint set", function() {
        boundingBoxFilter.geometry = "something";
        expect(boundingBoxFilter.hasValue()).toBe(true);
    });

    it("hasValue() is false if spatial constraint unset", function() {
        boundingBoxFilter.geometry = undefined;
        expect(boundingBoxFilter.hasValue()).toBe(false);
    });

});

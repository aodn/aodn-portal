
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BoundingBoxFilterPanel", function() {

    var boundingBoxFilter;
    var map = new OpenLayers.Map();

    beforeEach(function() {
        spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, 'setLayerAndFilter');
        spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, '_updateWithGeometry');
        boundingBoxFilter = new Portal.filter.BoundingBoxFilterPanel({
            layer: { map: map },
            filter: { name: 'geom_filter' }
        });
    });

    it('colspan should be 2', function() {
        expect(boundingBoxFilter.colspan).toBe(2);
    });

    it('filter name should be undefined', function() {
        boundingBoxFilter.filter = {
            name: 'this name should be ignored'
        };

        expect(boundingBoxFilter.getFilterName()).toEqual(undefined);
    });

    it("isDownloadOnly() should return true", function() {
        expect(boundingBoxFilter.isDownloadOnly()).toBe(true);
    });

    describe('map', function() {

        it("subscribes to 'spatialconstraintadded' event", function() {

            var geometry = {};

            map.events.triggerEvent('spatialconstraintadded', geometry);

            expect(boundingBoxFilter._updateWithGeometry).toHaveBeenCalledWith(geometry);
        });
    });

    describe('getCQL', function () {

        it('calls correct method for polygon geometry type', function () {

            boundingBoxFilter.geometry = { toWkt: function() { return "[WKT]" } };
            var cql = boundingBoxFilter.getCQL();

            expect(cql).toBe('INTERSECTS(geom_filter,[WKT])');
        });
    });
});


/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BoundingBoxFilterPanel", function() {

    var boundingBoxFilter;

    beforeEach(function() {
        spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, 'setLayerAndFilter');
        boundingBoxFilter = new Portal.filter.BoundingBoxFilterPanel(
            { filter: { name: 'geom_filter' } }
        );
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

    describe('getCQL', function () {

        beforeEach(function () {
            spyOn(boundingBoxFilter, '_geometryExpressionForBbox').andReturn('[bbox]');
            spyOn(boundingBoxFilter, '_geometryExpressionForPolygon').andReturn('[poly]');
        });

        it('calls correct method for bbox geometry type', function () {

            boundingBoxFilter.geometry = { isBox: function() { return true } };
            var cql = boundingBoxFilter.getCQL();

            expect(boundingBoxFilter._geometryExpressionForBbox).toHaveBeenCalled();
            expect(boundingBoxFilter._geometryExpressionForPolygon).not.toHaveBeenCalled();
            expect(cql).toBe('BBOX(geom_filter,[bbox])');
        });

        it('calls correct method for polygon geometry type', function () {

            boundingBoxFilter.geometry = { isBox: function() { return false } };
            var cql = boundingBoxFilter.getCQL();

            expect(boundingBoxFilter._geometryExpressionForBbox).not.toHaveBeenCalled();
            expect(boundingBoxFilter._geometryExpressionForPolygon).toHaveBeenCalled();
            expect(cql).toBe('BBOX(geom_filter,[poly])');
        });
    });

    describe('_geometryExpressionForBbox', function () {

        it('uses the correct fields form the geometry', function () {

            boundingBoxFilter.geometry = {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
            };

            expect(boundingBoxFilter._geometryExpressionForBbox()).toBe('left,bottom,right,top');
        });
    });

    describe('_geometryExpressionForPolygon', function () {

        it('uses the correct fields form the geometry', function () {

            boundingBoxFilter.geometry = {
                toWkt: noOp
            };
            spyOn(boundingBoxFilter.geometry, 'toWkt').andReturn('WKT');


            expect(boundingBoxFilter._geometryExpressionForPolygon()).toBe('WKT');
            expect(boundingBoxFilter.geometry.toWkt).toHaveBeenCalled();
        });
    });
});

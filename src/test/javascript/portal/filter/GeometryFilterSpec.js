/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.GeometryFilter", function() {

    var filter;
    var map;

    describe('polygon drawn', function() {

        beforeEach(function() {

            filter = new Portal.filter.GeometryFilter({
                name: 'column_name',
                value: {
                    toWkt: function() { return 'WKT' },
                    getBounds: function() { return 'bounds' }
                }
            });
            filter.map = {
                getSpatialConstraintType: function() { return 'polygon' }
            };
        });

        describe('getCql', function() {

            it('returns CQL', function() {

                expect(filter.getCql()).toBe('INTERSECTS(column_name,WKT)');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns a description', function() {

                expect(filter.getHumanReadableForm()).toBe('Max extent of polygon: bounds');
            });
        });
    });

    describe('rectangle drawn', function() {

        beforeEach(function() {

            filter = new Portal.filter.GeometryFilter({
                name: 'column_name',
                value: {
                    toWkt: function() { return 'WKT' },
                    getBounds: function() { return 'bounds' }
                }
            });
            filter.map = {
                getSpatialConstraintType: function() { return 'box' }
            };
        });

        describe('getCql', function() {

            it('returns CQL', function() {

                expect(filter.getCql()).toBe('INTERSECTS(column_name,WKT)');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns a description', function() {

                expect(filter.getHumanReadableForm()).toBe('Bounding Box: bounds');
            });
        });
    });
});

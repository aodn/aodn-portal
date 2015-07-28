/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.GeometryFilter", function() {

    var filter;

    describe('polygon drawn', function() {

        beforeEach(function() {

            filter = new Portal.filter.GeometryFilter({
                name: 'column_name',
                value: {
                    toWkt: returns('WKT'),
                    getBounds: returns('bounds')
                }
            });
            filter.map = {
                getSpatialConstraintType: returns('polygon')
            };
        });

        describe('getCql', function() {

            it('returns CQL', function() {

                expect(filter.getCql()).toBe('INTERSECTS(column_name,WKT)');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns a description', function() {

                var humanReadableForm = filter.getHumanReadableForm();

                expect(humanReadableForm).toContain(OpenLayers.i18n("spatialExtentHeading"));
                expect(humanReadableForm).toContain(OpenLayers.i18n("spatialExtentPolygonNote"));
                expect(humanReadableForm).toContain('bounds');
            });
        });
    });

    describe('rectangle drawn', function() {

        beforeEach(function() {

            filter = new Portal.filter.GeometryFilter({
                name: 'column_name',
                value: {
                    toWkt: returns('WKT'),
                    getBounds: returns('bounds')
                }
            });
            filter.map = {
                getSpatialConstraintType: returns('box')
            };
        });

        describe('getCql', function() {

            it('returns CQL', function() {

                expect(filter.getCql()).toBe('INTERSECTS(column_name,WKT)');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns a description', function() {

                var humanReadableForm = filter.getHumanReadableForm();

                expect(humanReadableForm).toContain(OpenLayers.i18n("spatialExtentHeading"));
                expect(humanReadableForm).toContain('bounds');
            });
        });
    });
});

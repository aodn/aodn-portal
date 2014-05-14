/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.GogoduckAggregator', function() {

    var aggregator;
    var layer;
    var dateRangeStart;
    var dateRangeEnd;


    beforeEach(function() {
        aggregator = new Portal.data.GogoduckAggregator();
        dateRangeStart = '[date]';
        dateRangeEnd = '[date]';
        layer = {
            wfsLayer: {
                name: 'gogoDingo'
            }
        };
    });

    describe('supportsSubsettedNetCdf', function() {
        it('returns true for a gogoduck aggregator', function() {
            expect(aggregator.supportsSubsettedNetCdf()).toBe(true);
        });
    });

    describe('supportsNetCdfUrlList', function() {
        it('returns false for a gogoduck aggregator', function() {
            expect(aggregator.supportsNetCdfUrlList()).toBe(false);
        });
    });

    describe('_buildParams', function() {

        it('includes some information regardless of geometry', function () {

            var params = aggregator.buildParams(layer, dateRangeStart, dateRangeEnd, null);

            expect(params.layerName).toBe('gogoDingo');
            expect(params.dateRangeStart).toBe('[date]');
            expect(params.dateRangeEnd).toBe('[date]');
            expect(params.productLatitudeRangeStart).toBe(-90);
            expect(params.productLongitudeRangeStart).toBe(-180);
            expect(params.productLatitudeRangeEnd).toBe(90);
            expect(params.productLongitudeRangeEnd).toBe(180);
        });

        it('includes spatialBounds if a geometry is present', function () {

            var geom = {
                getBounds: function() {
                    return {
                        bottom: 10,
                        top: 20,
                        left: 30,
                        right: 40
                    }
                }
            };

            var params = aggregator.buildParams(layer, dateRangeStart, dateRangeEnd, geom);

            expect(params.latitudeRangeStart).toBe(10);
            expect(params.longitudeRangeStart).toBe(30);
            expect(params.latitudeRangeEnd).toBe(20);
            expect(params.longitudeRangeEnd).toBe(40);
        });
    });
});
/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.AodaacAggregator', function() {

    var aggregator;
    var layer;
    var dateRangeStart;
    var dateRangeEnd;

    beforeEach(function() {
        aggregator = new Portal.data.AodaacAggregator();
        dateRangeStart = '[date]';
        dateRangeEnd = '[date]';
        layer = {
            aodaacProducts: [{
                id: 42,
                extents: {
                    lat: [1, 2],
                    lon: [3, 4]
                }
            }]
        };
    });

    describe('supportsSubsettedNetCdf', function() {
        it('returns true for an aodaac aggregator', function() {
            expect(aggregator.supportsSubsettedNetCdf()).toBe(true);
        });
    });

    describe('supportsNetCdfUrlList', function() {
        it('returns false for an aodaac aggregator', function() {
            expect(aggregator.supportsNetCdfUrlList()).toBe(false);
        });
    });

    describe('buildParams', function() {

        it('includes some information regardless of geometry', function () {

            var aodaacParameters = aggregator.buildParams(layer, dateRangeStart, dateRangeEnd, null);

            expect(aodaacParameters.productId).toBe(42);
            expect(aodaacParameters.dateRangeStart).toBe('[date]');
            expect(aodaacParameters.dateRangeEnd).toBe('[date]');
            expect(aodaacParameters.productLatitudeRangeStart).toBe(1);
            expect(aodaacParameters.productLongitudeRangeStart).toBe(3);
            expect(aodaacParameters.productLatitudeRangeEnd).toBe(2);
            expect(aodaacParameters.productLongitudeRangeEnd).toBe(4);
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

            var aodaacParameters = aggregator.buildParams(layer, dateRangeStart, dateRangeEnd, geom);

            expect(aodaacParameters.latitudeRangeStart).toBe(10);
            expect(aodaacParameters.longitudeRangeStart).toBe(30);
            expect(aodaacParameters.latitudeRangeEnd).toBe(20);
            expect(aodaacParameters.longitudeRangeEnd).toBe(40);
        });
    });



});
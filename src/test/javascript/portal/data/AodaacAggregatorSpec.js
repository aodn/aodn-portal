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
    var startDate;
    var endDate;

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
        startDate = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0)); // NB.Months are zero indexed
        endDate = moment.utc(Date.UTC(2014, 11, 21, 22, 30, 30, 500));
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

    describe('generateUrl', function() {

        var url;
        var ncwmsParams;
        var email = 'gogo@duck.com';

        beforeEach(function() {

            ncwmsParams = {
                dateRangeStart: startDate,
                dateRangeEnd: endDate,
                latitudeRangeStart: -42,
                latitudeRangeEnd: -20,
                longitudeRangeStart: 160,
                longitudeRangeEnd: 170,
                productId: '1'
            };

            url = aggregator.generateUrl(ncwmsParams, email);
        });

        it('includes the aodaac endpoint', function() {
            expect(url.indexOf('aodaac/createJob?')).toBeGreaterThan(-1);
        });

        it('includes the output format', function() {
            expect(url).toHaveParameterWithValue('outputFormat', 'nc');
        });

        it('includes the product id', function() {
            expect(url).toHaveParameterWithValue('productId', '1');
        });

        it('includes the date range start', function() {
            expect(url).toHaveParameterWithValue('dateRangeStart', '2013-11-20T00:30:00.000Z');
        });

        it('includes the date range end', function() {
            expect(url).toHaveParameterWithValue('dateRangeEnd', '2014-12-21T22:30:30.500Z');
        });

        it('includes the latitude range start', function() {
            expect(url).toHaveParameterWithValue('latitudeRangeStart','-42');
        });

        it('includes the latitude range end', function() {
            expect(url).toHaveParameterWithValue('latitudeRangeEnd', '-20');
        });

        it('includes the longitude range start', function() {
            expect(url).toHaveParameterWithValue('longitudeRangeStart', '160');
        });

        it('includes the longitude range end', function() {
            expect(url).toHaveParameterWithValue('longitudeRangeEnd', '170');
        });
    });
});
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
    var startDate;
    var endDate;

    beforeEach(function() {
        aggregator = new Portal.data.GogoduckAggregator();
        dateRangeStart = '[date]';
        dateRangeEnd = '[date]';
        layer = {
            wfsLayer: {
                name: 'gogoDingo'
            }
        };
        startDate = moment.utc(Date.UTC(2013, 10, 20, 0, 30, 0, 0)); // NB.Months are zero indexed
        endDate = moment.utc(Date.UTC(2014, 11, 21, 22, 30, 30, 500));
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

    describe('generateUrl', function() {

        var url;
        var geoNetworkRecord;
        var email;

        beforeEach(function() {
            email = 'gogo@duck.com';
            geoNetworkRecord = {
                ncwmsParams: {
                    dateRangeStart: startDate,
                    dateRangeEnd: endDate,
                    latitudeRangeStart: -42,
                    latitudeRangeEnd: -20,
                    longitudeRangeStart: 160,
                    longitudeRangeEnd: 170,
                    layerName: "gogoDingo"
                }
            };
            url = decodeURIComponent(aggregator.generateUrl(geoNetworkRecord.ncwmsParams, email));
        });

        it('generates the gogoduck endpoint', function() {
            expect(url.indexOf('gogoduck/registerJob?jobParameters=')).toBeGreaterThan(-1);
        });

        it('generates the layer name', function() {
            expect(url.indexOf('gogoDingo')).not.toEqual(-1);
        });

        it('generates the longitude range start', function() {
            expect(url.indexOf('160')).not.toEqual(-1);
        });

        it('generates the longitude range end', function() {
            expect(url.indexOf('170')).not.toEqual(-1);
        });

        it('generates the latitude range start', function() {
            expect(url.indexOf('-42')).not.toEqual(-1);
        });

        it('generates the latitude range end', function() {
            expect(url.indexOf('-20')).not.toEqual(-1);
        });

        it('generates the time range start', function() {
            expect(url.indexOf('2013-11-20T00:30:00.000Z')).not.toEqual(-1);
        });

        it('generates the time range end', function() {
            expect(url.indexOf('2014-12-21T22:30:30.500Z')).not.toEqual(-1);
        });
    });
});

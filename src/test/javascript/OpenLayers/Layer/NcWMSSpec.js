/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.NcWMS", function() {
    var cachedLayer;
    var extent;
    var params;

    beforeEach(function() {
        OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
            return "http://someurl/page?param1=blaa";
        };

        params = {};

        cachedLayer = new OpenLayers.Layer.NcWMS(
            null,
            null,
            params,
            null,
            { extent: extent }
        );

        cachedLayer.mergeNewParams = noOp;
    });

    describe('constructor', function() {
        it('extent given', function() {
            var extent = [
                '2001-02-01T00:00',
                '2001-02-03T00:00',
                '2001-02-05T00:00'];

            cachedLayer = new OpenLayers.Layer.NcWMS(
                null,
                null,
                params,
                null,
                { extent: extent }
            );
            cachedLayer.processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.temporalExtent).not.toBeUndefined();
            expect(cachedLayer.temporalExtent.length()).toEqual(3);
        });
    });

    describe("getURL", function() {

        var time = moment('2011-07-08T03:32:45Z');
        var bounds = new OpenLayers.Bounds({
            left: 0,
            right: 10,
            top: 0,
            bottom: 10
        });

        it('time specified', function() {
            cachedLayer.toTime(time);
            expect(cachedLayer.getURL(bounds).split('&')).toContain('TIME=' + time.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'));
        });

        it('no time specified', function() {
            cachedLayer.toTime(null);
            expect(cachedLayer.getURL(bounds).split('&')).not.toContain('TIME=' + time.format());
        });

        it('getURLAtTime', function() {
            var dateTime = moment('2000-02-02T01:01:01+00:00');
            expect(cachedLayer.getURLAtTime(bounds, dateTime).split('&')).toContain('TIME=2000-02-02T01:01:01.000');
        });
    });

    it("extent as array of strings", function() {
        cachedLayer.temporalExtent = null;
        cachedLayer.rawTemporalExtent = [
            '2001-01-01T00:00:00',
            '2001-01-02T00:00:00',
            '2001-01-03T00:00:00'
        ];
        cachedLayer.processTemporalExtent();

        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);

        expect(cachedLayer.temporalExtent.extent[0]).toBeSame(moment.utc('2001-01-01T00:00:00'));
        expect(cachedLayer.temporalExtent.extent[1]).toBeSame(moment.utc('2001-01-02T00:00:00'));
        expect(cachedLayer.temporalExtent.extent[2]).toBeSame(moment.utc('2001-01-03T00:00:00'));
    });

    it("extent as repeating interval", function() {
        // I *think* there can be a 'Rn' at the beginning, but doesn't look like helper.js handles
        // that.

        //  TODO: hangs browser :-)
        //cachedLayer.setTemporalExtent('2000-01-01T00:00:00.000/2000-01-03T00:00:00.000/PT1D');

        cachedLayer.temporalExtent = null;
        cachedLayer.rawTemporalExtent = ['2001-01-01T00:00:00/2001-01-03T00:00:00/PT24H'];
        cachedLayer.processTemporalExtent();
        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);

        var expectedDates = [
            moment.utc('2001-01-01T00:00:00'),
            moment.utc('2001-01-02T00:00:00'),
            moment.utc('2001-01-03T00:00:00')
        ];

        for (var i = 0; i < expectedDates.length; i++) {
            expect(cachedLayer.temporalExtent.extent[i]).toBeSame(expectedDates[i]);
        }
    });

    describe('get next time', function() {
        beforeEach(function() {
            delete cachedLayer.temporalExtent;
            cachedLayer.rawTemporalExtent = ['2001-01-01T00:00:00', '2001-01-02T00:00:00', '2001-01-03T00:00:00'];
            cachedLayer.processTemporalExtent();
            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);
        });

        it('next item returned', function() {
            cachedLayer.toTime(cachedLayer.temporalExtent.extent[0]);
            var res = cachedLayer.nextTimeSlice();
            expect(res).toBeSame(moment.utc('2001-01-02T00:00:00'));
        });

        it('no more items', function() {
            var res = cachedLayer.nextTimeSlice();
            expect(res).toBeUndefined();
        });
    });

    describe('choose nearest available time', function() {

        it('no extent restriction', function() {
            expect(cachedLayer.toTime(moment.utc('2000-01-01T00:00:00'))).toBeSame(moment.utc('2000-01-01T00:00:00'));
        });

        describe('repeating interval', function() {
            beforeEach(function() {
                cachedLayer.rawTemporalExtent = ['2000-01-01T00:00:00.000/2000-01-01T01:00:00.000/PT30M'];
                cachedLayer.temporalExtent = null;
                cachedLayer.processTemporalExtent();
                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);
            });

            it('around first date/time', function() {
                cachedLayer.toTime(moment.utc('1900-12-31T23:59:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:00:00.000'));
                cachedLayer.toTime(moment.utc('1999-12-31T23:59:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
            });

            it ('around half way between two possible values', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:15:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:15:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
            });

            it ('around last date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T01:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeUndefined();
                cachedLayer.toTime(moment.utc('2000-01-01T00:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T01:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T01:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeUndefined();
            });
        });

        describe('time set specified', function() {
            beforeEach(function() {
                cachedLayer.rawTemporalExtent = [
                    '2000-01-01T00:00:00.000',
                    '2000-01-02T00:00:00.000',
                    '2000-01-03T00:00:00.000'
                ];
                cachedLayer.temporalExtent = null;
                cachedLayer.processTemporalExtent();
                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);
            });

            it('around first date/time', function() {
                cachedLayer.toTime(moment.utc('1900-12-31T23:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:00:00.000'));
                cachedLayer.toTime(moment.utc('1999-12-31T23:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
            });

            it('around half way between two possible values', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T11:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T12:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T12:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
            });

            it('around last date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-02T23:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-03T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-03T00:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeUndefined();
                cachedLayer.toTime(moment.utc('2000-01-03T00:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeUndefined();
                cachedLayer.toTime(moment.utc('2010-01-03T00:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeUndefined();
            });
        });
    });

    describe('getExtent min/max', function() {

        var minExtent = moment.utc('2001-02-01T00:00');
        var maxExtent = moment.utc('2001-02-05T00:00');

        beforeEach(function() {
            var extent = [
                '2001-02-01T00:00',
                '2001-02-03T00:00',
                '2001-02-05T00:00'
            ];

            cachedLayer = new OpenLayers.Layer.NcWMS(
                null,
                null,
                params,
                null,
                { extent: extent }
            );

            cachedLayer.temporalExtent = null;
            cachedLayer.processTemporalExtent();
            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

        });

        it('getTemporalExtentMin value', function() {
            expect(cachedLayer.getTemporalExtentMin()).toBeSame(moment.utc('2001-02-01T00:00'));
        });

        it('getTemporalExtentMax value', function() {
            expect(cachedLayer.getTemporalExtentMax()).toBeSame(moment.utc('2001-02-05T00:00'));
        });
    });

    describe('download as gif', function() {
        beforeEach(function() {
            spyOn(window, 'open');
        });

        it('_getGifUrl called', function() {
            var params = {};
            spyOn(cachedLayer, '_getGifUrl');
            cachedLayer.downloadAsGif(params);
            expect(cachedLayer._getGifUrl).toHaveBeenCalledWith(params);
        });

        it('window.open called', function() {
            cachedLayer._getGifUrl = function() {
                return 'http://theurl';
            };

            cachedLayer.downloadAsGif();
            expect(window.open).toHaveBeenCalledWith(
                'http://theurl',
                '_blank',
                'width=200,height=200,menubar=no,location=no,resizable=no,scrollbars=no,status=yes');

        });

        describe('_getGifUrl', function() {
            beforeEach(function() {
                cachedLayer.getFullRequestString = function() {
                    return 'http://somehost/somepath?FORMAT=image%2Fpng';
                }
            });

            it('path', function() {
                expect(cachedLayer._getGifUrl()).toStartWith('proxy/downloadGif?');
            });

            it('url param', function() {
                expect(cachedLayer._getGifUrl()).toContain('url=http://somehost/somepath');
            });

            it('spatial extent', function() {
                var spatialExtent = new OpenLayers.Bounds(1, 2, 3, 4);
                expect(cachedLayer._getGifUrl({ spatialExtent: spatialExtent })).toContain('BBOX=1,2,3,4');
            });

            it('temporal extent in utc', function() {

                cachedLayer.temporalExtent = null;
                cachedLayer.rawTemporalExtent = [
                    '2000-01-01T00:00:00',
                    '2000-01-02T00:00:00',
                    '2000-01-03T00:00:00',
                    '2000-01-04T00:00:00',
                    '2000-01-05T00:00:00'
                ];
                cachedLayer.processTemporalExtent();

                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);

                // Note that _getGifUrl will use utc timezone, hence we gonna
                // get the request shifted to UTC, in other words, -11 hours
                expect(cachedLayer._getGifUrl({ temporalExtent: cachedLayer.temporalExtent })).toContain(
                    'TIME=2000-01-01T00:00:00/2000-01-05T00:00:00');
            });

            it('format', function() {
                expect(cachedLayer._getGifUrl()).toContain('FORMAT=image/gif');
                expect(cachedLayer._getGifUrl()).not.toContain('FORMAT=image/png');
            });

            it('width', function() {
                expect(cachedLayer._getGifUrl()).toContain('WIDTH=512');
            });

            it('height', function() {
                var spatialExtent = new OpenLayers.Bounds(1, 2, 3.99, 4);
                expect(cachedLayer._getGifUrl({ spatialExtent: spatialExtent })).toContain('HEIGHT=342');
                expect(cachedLayer._getGifUrl({ spatialExtent: spatialExtent })).not.toContain('HEIGHT=342.');
            });
        });
    });
});

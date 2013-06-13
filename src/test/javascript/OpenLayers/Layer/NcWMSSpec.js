/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.NcWMS", function() {

    var ncwmsLayer;

    beforeEach(function() {
        OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
            return "http://someurl/page?param1=blaa";
        };
        OpenLayers.Layer.WMS.prototype.moveTo = function() {};

        ncwmsLayer = new OpenLayers.Layer.NcWMS();
    });

    describe('constructor', function() {
        it('extent given', function() {
            var extent = [
                '2001-02-01T00:00',
                '2001-02-03T00:00',
                '2001-02-05T00:00'];

            ncwmsLayer = new OpenLayers.Layer.NcWMS(
                null,
                null,
                null,
                null,
                extent);

            expect(ncwmsLayer.temporalExtent).toBeSame(extent);
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
            ncwmsLayer.toNearestTime(time);
            expect(ncwmsLayer.getURL(bounds).split('&')).toContain('TIME=' + time.utc().format('YYYY-MM-DDTHH:mm:ss'));
        });

        it('no time specified', function() {
            ncwmsLayer.toNearestTime(null);
            expect(ncwmsLayer.getURL(bounds).split('&')).not.toContain('TIME=' + time.format());
        });

        it('getURLAtTime', function() {
            var dateTime = moment('2000-02-02T01:01:01+00:00');
            expect(ncwmsLayer.getURLAtTime(bounds, dateTime).split('&')).toContain('TIME=2000-02-02T01:01:01');
        });
    });

    it("extent as array of moments", function() {
        ncwmsLayer.setTemporalExtent([
            moment('2001-01-01T00:00:00'),
            moment('2001-01-02T00:00:00'),
            moment('2001-01-03T00:00:00')]);

        expect(ncwmsLayer.getTemporalExtent()).toContain(moment('2001-01-01T00:00:00'));
        expect(ncwmsLayer.getTemporalExtent()).toContain(moment('2001-01-02T00:00:00'));
        expect(ncwmsLayer.getTemporalExtent()).toContain(moment('2001-01-03T00:00:00'));
    });

    it("extent as array of strings", function() {
        ncwmsLayer.setTemporalExtent([
            '2001-01-01T00:00:00',
            '2001-01-02T00:00:00',
            '2001-01-03T00:00:00']);

        expect(ncwmsLayer.getTemporalExtent()).toContain(moment('2001-01-01T00:00:00'));
        expect(ncwmsLayer.getTemporalExtent()).toContain(moment('2001-01-02T00:00:00'));
        expect(ncwmsLayer.getTemporalExtent()).toContain(moment('2001-01-03T00:00:00'));
    });

    it("extent as repeating interval", function() {
        // I *think* there can be a 'Rn' at the beginning, but doesn't look like helper.js handles
        // that.

        //  TODO: hangs browser :-)
        //ncwmsLayer.setTemporalExtent('2000-01-01T00:00:00.000Z/2000-01-03T00:00:00.000Z/PT1D');

        // TODO: this is returning 4 times - 3rd Jan is repeated.
        ncwmsLayer.setTemporalExtent('2001-01-01T00:00:00Z/2001-01-03T00:00:00Z/PT24H');

        var expectedDateStrings = [
            '2001-01-01T11:00:00+11:00',
            '2001-01-02T11:00:00+11:00',
            '2001-01-03T11:00:00+11:00'
        ];

        for (var i = 0; i < expectedDateStrings.length; i++) {
            expect(ncwmsLayer.getTemporalExtent()[i]).toBeSame(moment(expectedDateStrings[i]));
        }
    });

    describe('to time', function() {
        it('toTime on tiles called', function() {
            var toTimeSpy = jasmine.createSpy('toTimeSpy');
            
            ncwmsLayer.grid = [];
            ncwmsLayer.grid[0] = [{ toTime: toTimeSpy }, { toTime: toTimeSpy }];
            ncwmsLayer.grid[1] = [{ toTime: toTimeSpy }, { toTime: toTimeSpy }];

            ncwmsLayer.toTime(moment());
            expect(toTimeSpy.callCount).toBe(4);
        });
    });

    describe('choose nearest available time', function() {

        it('no extent restriction', function() {
            expect(ncwmsLayer.toNearestTime('2000-01-01T00:00:00Z')).toBeSame('2000-01-01T00:00:00Z');
            expect(ncwmsLayer.toTime('2000-01-01T00:00:00Z')).toBeSame('2000-01-01T00:00:00Z');
        });

        describe('repeating interval', function() {
            beforeEach(function() {
                ncwmsLayer.setTemporalExtent('2000-01-01T00:00:00.000Z/2000-01-01T01:00:00.000Z/PT30M');
            });

            it('around first date/time', function() {
                expect(ncwmsLayer.toNearestTime('1900-12-31T23:59:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('1999-12-31T23:59:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:00:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:00:01.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
            });

            it ('around half way between two possible values', function() {
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:15:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:15:01.000Z')).toBeSame('2000-01-01T00:30:00.000Z');
            });

            it ('around last date/time', function() {
                expect(ncwmsLayer.toNearestTime('2000-01-01T01:00:00.000Z')).toBeSame('2000-01-01T01:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:59:59.000Z')).toBeSame('2000-01-01T01:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T01:00:01.000Z')).toBeSame('2000-01-01T01:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2010-01-01T01:00:01.000Z')).toBeSame('2000-01-01T01:00:00.000Z');
            });
        });

        describe('time set specified', function() {
            beforeEach(function() {
                ncwmsLayer.setTemporalExtent([
                    '2000-01-01T00:00:00.000Z',
                    '2000-01-02T00:00:00.000Z',
                    '2000-01-03T00:00:00.000Z'
                ]);
            });

            it('around first date/time', function() {
                expect(ncwmsLayer.toNearestTime('1900-12-31T23:59:59.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('1999-12-31T23:59:59.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:00:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T00:00:01.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
            });

            it('around half way between two possible values', function() {
                expect(ncwmsLayer.toNearestTime('2000-01-01T11:59:59.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T12:00:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-01T12:00:01.000Z')).toBeSame('2000-01-02T00:00:00.000Z');
            });

            it('around last date/time', function() {
                expect(ncwmsLayer.toNearestTime('2000-01-02T23:59:59.000Z')).toBeSame('2000-01-03T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-03T00:00:00.000Z')).toBeSame('2000-01-03T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2000-01-03T00:00:01.000Z')).toBeSame('2000-01-03T00:00:00.000Z');
                expect(ncwmsLayer.toNearestTime('2010-01-03T00:00:00.000Z')).toBeSame('2000-01-03T00:00:00.000Z');
            });

            it('unordered date/times', function() {
                ncwmsLayer.setTemporalExtent([
                    '2000-01-01T00:00:00.000Z',
                    '2000-01-03T00:00:00.000Z',
                    '2000-01-02T00:00:00.000Z'
                ]);

                expect(ncwmsLayer.toNearestTime('2000-01-02T01:00:00.000Z')).toBeSame('2000-01-02T00:00:00.000Z');
            });

            it('unordered date/times with earlier date given later in array', function() {
                ncwmsLayer.setTemporalExtent([
                    '2000-01-02T00:00:00.000Z',
                    '2000-01-01T00:00:00.000Z',
                    '2000-01-03T00:00:00.000Z'
                ]);

                expect(ncwmsLayer.toNearestTime('2000-01-01T12:00:00.000Z')).toBeSame('2000-01-01T00:00:00.000Z');
            });
        });
    });

    describe('tiles', function() {
        it('addTile returns TemporalImage', function() {
            ncwmsLayer.tileSize = new OpenLayers.Size(10, 10);
            var tile = ncwmsLayer.addTile(new OpenLayers.Bounds(1, 2, 3, 4), new OpenLayers.Pixel(1, 1));

            expect(tile).toBeInstanceOf(OpenLayers.Tile.TemporalImage);
        });
    });

    describe('eachTile', function() {
        it('returns an Array of tiles processed', function() {
            var grid = [
                [ 0, 1 ],
                [ 2, 3 ]
            ];
            ncwmsLayer.grid = grid;
            
            var processedTiles = ncwmsLayer.eachTile(function(tile) {});
            expect(processedTiles[0]).toBe(0);
            expect(processedTiles[1]).toBe(1);
            expect(processedTiles[2]).toBe(2);
            expect(processedTiles[3]).toBe(3);
        });
    });
        
    describe('get dates on day', function() {
        var extent;
        
        beforeEach(function() {
            extent = [
                '2001-01-01T00:00',
                '2001-02-01T01:20',
                '2001-02-01T20:45',
                '2001-02-03T00:00',
                '2001-02-03T23:59',
                '2001-02-05T00:00'];
        });

        it('no extent', function() {
            expect(ncwmsLayer.getDatesOnDay('2001-01-01')).toBeSame([]);
        });

        it('extent, but no dates falling on day', function() {
            ncwmsLayer = new OpenLayers.Layer.NcWMS(
                null, null, null, null, extent);
            expect(ncwmsLayer.getDatesOnDay('2000-01-01')).toBeSame([]);
        });

        it('dates on day', function() {
            ncwmsLayer = new OpenLayers.Layer.NcWMS(
                null, null, null, null, extent);
            expect(ncwmsLayer.getDatesOnDay('2001-02-01')).toBeSame([
                '2001-02-01T01:20',
                '2001-02-01T20:45'])
        });
    });
});

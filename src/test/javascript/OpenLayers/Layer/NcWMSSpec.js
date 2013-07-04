/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.NcWMS", function() {
    var cachedLayer;
    var extent;
    var timeControl;

    beforeEach(function() {
        // Mock time control
        timeControl = new OpenLayers.Control.Time();
        timeControl.onTick = function() {};
        timeControl.getExtent = function() {
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        };
        timeControl.getDateTimeForStep = function() {
            return moment('2014-04-03T02:11:32');
        }

        OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
            return "http://someurl/page?param1=blaa";
        };
        OpenLayers.Layer.WMS.prototype.moveTo = function() {};

        OpenLayers.Layer.NcWMS.prototype._getTimeControl = function() { return timeControl; }
        OpenLayers.Layer.NcWMS.prototype._getTimesToCache = function() {
            return [
                moment('2000-01-01'), moment('2000-01-02')
            ];
        };

        cachedLayer = new OpenLayers.Layer.NcWMS();
        cachedLayer.grid = [];
        cachedLayer.grid[0] = [];

        spyOn(cachedLayer, '_getTimesToCache').andReturn([
            moment('2000-01-01T00:00:00'),
            moment('2000-01-01T01:00:00')
        ]);
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
                null,
                null,
                extent);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.temporalExtent).toBeSame(extent);
        });

        it('\'(animated)\' appended to name', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS('thename');
            expect(cachedLayer.name).toBe('thename (animated)');
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
            cachedLayer.toNearestTime(time);
            expect(cachedLayer.getURL(bounds).split('&')).toContain('TIME=' + time.utc().format('YYYY-MM-DDTHH:mm:ss'));
        });

        it('no time specified', function() {
            cachedLayer.toNearestTime(null);
            expect(cachedLayer.getURL(bounds).split('&')).not.toContain('TIME=' + time.format());
        });

        it('getURLAtTime', function() {
            var dateTime = moment('2000-02-02T01:01:01+00:00');
            expect(cachedLayer.getURLAtTime(bounds, dateTime).split('&')).toContain('TIME=2000-02-02T01:01:01');
        });
    });

    it("extent as array of strings", function() {
        cachedLayer.temporalExtent = null;
        cachedLayer.rawTemporalExtent = [
            '2001-01-01T00:00:00',
            '2001-01-02T00:00:00',
            '2001-01-03T00:00:00'
        ];
        cachedLayer._processTemporalExtent();

        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);

        expect(cachedLayer.temporalExtent).toContain(moment('2001-01-01T00:00:00'));
        expect(cachedLayer.temporalExtent).toContain(moment('2001-01-02T00:00:00'));
        expect(cachedLayer.temporalExtent).toContain(moment('2001-01-03T00:00:00'));
    });

    it("extent as repeating interval", function() {
        // I *think* there can be a 'Rn' at the beginning, but doesn't look like helper.js handles
        // that.

        //  TODO: hangs browser :-)
        //cachedLayer.setTemporalExtent('2000-01-01T00:00:00.000/2000-01-03T00:00:00.000/PT1D');

        cachedLayer.temporalExtent = null;
        cachedLayer.rawTemporalExtent = ['2001-01-01T00:00:00/2001-01-03T00:00:00/PT24H'];
        cachedLayer._processTemporalExtent();
        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);

        var expectedDates = [
            moment('2001-01-01T00:00:00'),
            moment('2001-01-02T00:00:00'),
            moment('2001-01-03T00:00:00')
        ];

        for (var i = 0; i < expectedDates.length; i++) {
            expect(cachedLayer.temporalExtent[i]).toBeSame(expectedDates[i]);
        }
    });

    describe('to time', function() {
        it('toTime on tiles called', function() {
            var toTimeSpy = jasmine.createSpy('toTimeSpy');
            
            cachedLayer.grid = [];
            cachedLayer.grid[0] = [{ toTime: toTimeSpy }, { toTime: toTimeSpy }];
            cachedLayer.grid[1] = [{ toTime: toTimeSpy }, { toTime: toTimeSpy }];

            cachedLayer.toTime(moment());
            expect(toTimeSpy.callCount).toBe(4);
        });
    });

    describe('choose nearest available time', function() {

        it('no extent restriction', function() {
            expect(cachedLayer.toNearestTime('2000-01-01T00:00:00')).toBeSame('2000-01-01T00:00:00');
            expect(cachedLayer.toTime('2000-01-01T00:00:00')).toBeSame('2000-01-01T00:00:00');
        });

        describe('repeating interval', function() {
            beforeEach(function() {
                cachedLayer.rawTemporalExtent = ['2000-01-01T00:00:00.000/2000-01-01T01:00:00.000/PT30M'];
                cachedLayer.temporalExtent = null;
                cachedLayer._processTemporalExtent();
                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);
            });

            it('around first date/time', function() {
                expect(cachedLayer.toNearestTime('1900-12-31T23:59:00.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('1999-12-31T23:59:00.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T00:00:00.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T00:00:01.000')).toBeSame('2000-01-01T00:00:00.000');
            });

            it ('around half way between two possible values', function() {
                expect(cachedLayer.toNearestTime('2000-01-01T00:15:00.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T00:15:01.000')).toBeSame('2000-01-01T00:30:00.000');
            });

            it ('around last date/time', function() {
                expect(cachedLayer.toNearestTime('2000-01-01T01:00:00.000')).toBeSame('2000-01-01T01:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T00:59:59.000')).toBeSame('2000-01-01T01:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T01:00:01.000')).toBeSame('2000-01-01T01:00:00.000');
                expect(cachedLayer.toNearestTime('2010-01-01T01:00:01.000')).toBeSame('2000-01-01T01:00:00.000');
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
                cachedLayer._processTemporalExtent();
                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);
            });

            it('around first date/time', function() {
                expect(cachedLayer.toNearestTime('1900-12-31T23:59:59.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('1999-12-31T23:59:59.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T00:00:00.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T00:00:01.000')).toBeSame('2000-01-01T00:00:00.000');
            });

            it('around half way between two possible values', function() {
                expect(cachedLayer.toNearestTime('2000-01-01T11:59:59.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T12:00:00.000')).toBeSame('2000-01-01T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-01T12:00:01.000')).toBeSame('2000-01-02T00:00:00.000');
            });

            it('around last date/time', function() {
                expect(cachedLayer.toNearestTime('2000-01-02T23:59:59.000')).toBeSame('2000-01-03T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-03T00:00:00.000')).toBeSame('2000-01-03T00:00:00.000');
                expect(cachedLayer.toNearestTime('2000-01-03T00:00:01.000')).toBeSame('2000-01-03T00:00:00.000');
                expect(cachedLayer.toNearestTime('2010-01-03T00:00:00.000')).toBeSame('2000-01-03T00:00:00.000');
            });
        });
    });

    describe('tiles', function() {
        it('addTile returns TemporalImage', function() {
            cachedLayer.tileSize = new OpenLayers.Size(10, 10);
            var tile = cachedLayer.addTile(new OpenLayers.Bounds(1, 2, 3, 4), new OpenLayers.Pixel(1, 1));

            expect(tile).toBeInstanceOf(OpenLayers.Tile.TemporalImage);
        });
    });

    describe('eachTile', function() {
        it('returns an Array of tiles processed', function() {
            var grid = [
                [ 0, 1 ],
                [ 2, 3 ]
            ];
            cachedLayer.grid = grid;
            
            var processedTiles = cachedLayer.eachTile(function(tile) {});
            expect(processedTiles[0]).toBe(0);
            expect(processedTiles[1]).toBe(1);
            expect(processedTiles[2]).toBe(2);
            expect(processedTiles[3]).toBe(3);
        });
    });
    
    describe('get dates on day', function() {
        var extent;
        
        beforeEach(function() {
            cachedLayer.temporalExtent = [
                moment('2001-01-01T00:00'),
                moment('2001-02-01T01:20'),
                moment('2001-02-01T20:45'),
                moment('2001-02-03T00:00'),
                moment('2001-02-03T23:59'),
                moment('2001-02-05T00:00')
            ];
        });

        it('no extent', function() {
            cachedLayer.temporalExtent = [];
            expect(cachedLayer.getDatesOnDay(moment('2001-01-01'))).toBeSame([]);
        });

        it('extent, but no dates falling on day', function() {
            expect(cachedLayer.getDatesOnDay(moment('2000-01-01'))).toBeSame([]);
        });

        it('dates on day, date exists', function() {
            var datesOnDay = cachedLayer.getDatesOnDay(moment('2001-02-01'));
            expect(datesOnDay[0].format()).toBe(moment('2001-02-01T01:20').format());
            expect(datesOnDay[1].format()).toBe(moment('2001-02-01T20:45').format());
            expect(cachedLayer.getDatesOnDay(moment('2001-02-05T20:00')).length).toBe(1);
        });

        it('dates on day, date doesn\'t exist', function() {
            expect(cachedLayer.getDatesOnDay(moment('2001-02-04T10:00')).length).toBe(0);
            expect(cachedLayer.getDatesOnDay(moment('2001-02-04T13:00'))).toBeSame([]);
        });
    });

    describe('getExtent min/max', function() {

        var minExtent = moment('2001-02-01T00:00');
        var maxExtent = moment('2001-02-05T00:00');
        
        beforeEach(function() {
            var extent = [
                minExtent,
                '2001-02-03T00:00',
                maxExtent];

            cachedLayer = new OpenLayers.Layer.NcWMS();
            cachedLayer.temporalExtent = extent;
        });

        it('getTemporalExtentMin value', function() {
            expect(cachedLayer.getTemporalExtentMin()).toBeSame('2001-02-01T00:00');
        });

        it('getTemporalExtentMin is copy', function() {
            expect(cachedLayer.getTemporalExtentMin()).not.toBe(minExtent);
        });

        it('getTemporalExtentMax value', function() {
            expect(cachedLayer.getTemporalExtentMax()).toBeSame('2001-02-05T00:00');
        });
        
        it('getTemporalExtentMax is copy', function() {
            expect(cachedLayer.getTemporalExtentMax()).not.toBe(maxExtent);
        });
    });
    
    describe('getMissingDays', function() {
        var extent = [
            '2001-01-01T00:00',
            '2001-01-03T01:20',
            '2001-01-03T20:45',
            '2001-01-03T00:00',
            '2001-01-03T23:59',
            '2001-01-03T00:00',
            '2001-01-04T00:00',
            '2001-01-05T01:20',
            '2001-01-05T20:45',
            '2001-01-05T00:00',
            '2001-01-05T23:59',
            '2001-01-05T00:00',
            '2001-01-07T00:00',
            '2001-01-09T01:20',
            '2001-01-09T20:45',
            '2001-01-09T00:00',
            '2001-01-09T23:59',
            '2001-01-09T00:00',
            '2001-01-13T00:00',
            '2001-01-13T23:59',
            '2001-01-14T00:00'];

        it('gets missing days from temporal extent', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, extent);
            cachedLayer._processTemporalExtent();
            expect(cachedLayer.getMissingDays()).toBeSame(['2001-01-02', '2001-01-06', '2001-01-08', '2001-01-10', '2001-01-11', '2001-01-12']);
        });

        it('gets missing days over a month boundary first of month', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, ['2012-01-31', '2012-02-02']);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2012-02-01']);
        });

        it('gets missing days over a month boundary end of month', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, ['2012-01-30', '2012-02-01']);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2012-01-31']);
        });

        it('gets missing days over a leap year month boundary start of month', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, ['2012-02-29', '2012-03-02']);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2012-03-01']);
        });

        it('gets missing days over a leap year month boundary end of month', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, ['2012-02-28', '2012-03-01']);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2012-02-29']);
        });

        it('gets missing days over a year boundary start of year', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, ['2012-12-31', '2013-01-02']);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2013-01-01']);
        });

        it('gets missing days over a year boundary end of year', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, ['2012-12-30', '2013-01-01']);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2012-12-31']);
        });

        it('gets the same missing days memoized', function() {
            cachedLayer = new OpenLayers.Layer.NcWMS(null, null, null, null, extent);
            cachedLayer._processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.getMissingDays()).toBeSame(['2001-01-02', '2001-01-06', '2001-01-08', '2001-01-10', '2001-01-11', '2001-01-12']);
            expect(cachedLayer.getMissingDays()).toBeSame(['2001-01-02', '2001-01-06', '2001-01-08', '2001-01-10', '2001-01-11', '2001-01-12']);
        });
    });

    describe('set opacity', function() {
        it('set opacity called on each tile', function() {
            var opacitySpy = jasmine.createSpy('setOpacity');
            cachedLayer.grid = [];
            cachedLayer.grid[0] = [{ setOpacity: opacitySpy }, { setOpacity: opacitySpy }];
            cachedLayer.grid[1] = [{ setOpacity: opacitySpy }, { setOpacity: opacitySpy }];

            cachedLayer.setOpacity(0.6);
            expect(opacitySpy.callCount).toBe(4);
            expect(opacitySpy.calls[0].args[0]).toBe(0.6);
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
            }
            
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

            it('temporal extent', function() {
                var temporalExtent = {
                    min: moment('2000-01-01T11:00'),
                    max: moment('2000-01-05T11:00')
                }
                // Note that _getGifUrl will use utc timezone, hence we gonna
                // get the request shifted to UTC, in other words, -11 hours
                expect(cachedLayer._getGifUrl({ temporalExtent: temporalExtent })).toContain(
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

    it('_precache called after moveTo', function() {
        var precacheSpy = jasmine.createSpy('precache');
        cachedLayer._precache = precacheSpy;
        cachedLayer.moveTo(new OpenLayers.Bounds(1, 2, 3, 4), false, false);
        expect(precacheSpy).toHaveBeenCalled();
    });

    it('_processTemporalExtent called after _precache async', function() {
        runs(function() {
            cachedLayer.temporalExtent = null;
            cachedLayer.rawTemporalExtent = [];
            cachedLayer._precache();
        });
        waitsFor(function() {
            return cachedLayer.temporalExtent !== null;
        }, "Temporal extent not processed", 1000);
        runs(function() {
            expect(cachedLayer.rawTemporalExtent).toEqual(null);
            expect(cachedLayer.temporalExtent).toEqual([]);
        });
    });

    it('Null temporal extent processed on moveTo', function() {
        runs(function() {
            cachedLayer.rawTemporalExtent = null;
            cachedLayer.moveTo(new OpenLayers.Bounds(1, 2, 3, 4), false, false);
        });
        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);
        runs(function() {
            expect(cachedLayer.temporalExtent).toEqual([]);
        });
    });

    it('Temporal extent (string) processed on moveTo', function() {
        expectedDates = [
            moment("2010-07-16T06:00:00"),
            moment("2010-07-16T07:00:00"),
            moment("2010-07-16T08:00:00"),
            moment("2010-07-16T09:00:00"),
            moment("2010-07-16T10:00:00")
        ];
        runs(function() {
            cachedLayer.rawTemporalExtent = 
                '2010-07-16T06:00:00,2010-07-16T07:00:00,2010-07-16T08:00:00,2010-07-16T09:00:00,2010-07-16T10:00:00';
            cachedLayer.temporalExtent = null;
            cachedLayer.moveTo(new OpenLayers.Bounds(4, 3, 2, 1), false, false);
        });
        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);
        runs(function() {
            for (var i = 0; i < expectedDates.length; i++) {
                expect(cachedLayer.temporalExtent[i].isSame(expectedDates[i]));
            }
        });
    });

    /* Most tests below run _precache(true) which will run
     * things synchronously in NcWMS, this is to avoid
     * designing nasty tests. Otherwise we check the behaviour
     * of things by making sure that basic things in the async
     * mechanism work. */

    describe('precache tiles', function() {
        var tilePrecacheSpy;
        var tileClearCacheSpy;

        beforeEach(function() {
            tilePrecacheSpy = jasmine.createSpy('precache');
            tileClearCacheSpy = jasmine.createSpy('clearCache');

            var dummyTile = {
                precache: tilePrecacheSpy,
                clearCache: tileClearCacheSpy,
                getNumImagesComplete: function() {
                    return 1;
                }
            }
            var grid = [
                [ dummyTile, dummyTile ],
                [ dummyTile, dummyTile ]
            ];
            cachedLayer.grid = grid;
        });

        it('clearCache called on each tile', function() {
            cachedLayer._precache(true);
            expect(tileClearCacheSpy.callCount).toBe(4);
        });

        it('precache called on each tile for each time', function() {
            cachedLayer._precache(true);
            expect(tilePrecacheSpy.callCount).toBe(8);

            for (var i = 0; i < 4; i++) {
                expect(tilePrecacheSpy.calls[i].args[0]).toBeSame(moment('2000-01-01T00:00:00'));
            }
            for (var i = 4; i < 8; i++) {
                expect(tilePrecacheSpy.calls[i].args[0]).toBeSame(moment('2000-01-01T01:00:00'));
            }
        });
    });

    describe('currently precaching images', function() {
        describe('after precache', function() {
            beforeEach(function() {
                var dummyTile = {
                    precache: function() {},
                    clearCache: function() {},
                    getNumImagesComplete: function() {
                        return 1;
                    }
                }
                var grid = [
                    [ dummyTile, dummyTile ],
                    [ dummyTile, dummyTile ]
                ];
                cachedLayer.grid = grid;

                cachedLayer._getTimesToCache = function() {
                    return [
                        moment('2000-01-01'), moment('2000-01-02')
                    ];
                };
            });

            it('total precaching', function() {
                cachedLayer._precache(true);
                expect(cachedLayer._getTotalImagesComplete()).toBe(4);
            });

            it('total images', function() {
                cachedLayer._precache(true);
                expect(cachedLayer._getTotalImages()).toBe(8);
            });

            it('calculate progress', function() {
                cachedLayer._precache(true);
                expect(cachedLayer._calculateProgress()).toBe(0.25);
            });
        });
    });

    describe('events and states', function() {

        var img00;
        var img01;
        var img10;
        var img11;

        beforeEach(function() {
            // 1 x 2 grid of tiles, 2 date/times.
            // First time.
            img00 = document.createElement('img');  
            img00.src = 'someurl';
            img00.onload = function() {
                cachedLayer._imageLoaded(img00);
            };

            img01 = document.createElement('img');  
            img01.src = 'someurl';
            img01.onload = function() {
                cachedLayer._imageLoaded(img01);
            };

            // Second time.
            img10 = document.createElement('img');  
            img10.src = 'someurl';
            img10.onload = function() {
                cachedLayer._imageLoaded(img10);
            };

            img11 = document.createElement('img');  
            img11.src = 'someurl';
            img11.onload = function() {
                cachedLayer._imageLoaded(img11);
            };

            cachedLayer.grid = [];
            cachedLayer.grid.push([
                {
                    precache: function(dateTime) {
                        return dateTime.isSame(moment('2000-01-01T00:00:00')) ? img00 : img10;
                    },
                    clearCache: function() {},
                    getNumImagesComplete: function() { return 0; }
                },
                {
                    precache: function(dateTime) {
                        return dateTime.isSame(moment('2000-01-01T00:00:00')) ? img01 : img11;
                    },
                    clearCache: function() {},
                    getNumImagesComplete: function() { return 0; }
                }
            ]);
        });

        it('precachestart', function() {
            var precachestartSpy = jasmine.createSpy('precachestartSpy');
            cachedLayer.events.on({
                'precachestart': precachestartSpy,
                scope: this
            });

            cachedLayer._precache(true);
            expect(precachestartSpy).toHaveBeenCalledWith(cachedLayer);
        });

        it('precacheprogress initially 0', function() {
            var precacheprogressSpy = jasmine.createSpy('precacheprogressSpy');
            cachedLayer.events.on({
                'precacheprogress' : precacheprogressSpy,
                scope: this
            });

            cachedLayer._precache(true);
            expect(precacheprogressSpy).toHaveBeenCalled();
            expect(precacheprogressSpy.calls[0].args[0].layer).toBe(cachedLayer);
            expect(precacheprogressSpy.calls[0].args[0].progress).toBe(0);
        });

        it('precacheprogress after image load', function() {
            var precacheprogressSpy = jasmine.createSpy('precacheprogressSpy');
            cachedLayer.events.on({
                'precacheprogress' : precacheprogressSpy,
                scope: this
            });

            cachedLayer._precache(true);
            expect(precacheprogressSpy.calls[0].args[0].layer).toBe(cachedLayer);
            expect(precacheprogressSpy.calls[0].args[0].progress).toBe(0);

            cachedLayer._calculateProgress = function() { return 1/4; }
            $(img00).trigger('onload');
            expect(precacheprogressSpy.calls[1].args[0].layer).toBe(cachedLayer);
            expect(precacheprogressSpy.calls[1].args[0].progress).toBe(1/4);

            cachedLayer._calculateProgress = function() { return 2/4; }
            $(img01).trigger('onload');
            expect(precacheprogressSpy.calls[2].args[0].layer).toBe(cachedLayer);
            expect(precacheprogressSpy.calls[2].args[0].progress).toBe(2/4);

            cachedLayer._calculateProgress = function() { return 3/4; }
            $(img10).trigger('onload');
            expect(precacheprogressSpy.calls[3].args[0].layer).toBe(cachedLayer);
            expect(precacheprogressSpy.calls[3].args[0].progress).toBe(3/4);

            cachedLayer._calculateProgress = function() { return 4/4; }
            $(img11).trigger('onload');
            expect(precacheprogressSpy.calls[4].args[0].layer).toBe(cachedLayer);
            expect(precacheprogressSpy.calls[4].args[0].progress).toBe(4/4);
        });

        // This scenario can happen if several images load and caching is finished before the first of the several
        // image load callbacks is called.
        //
        // Without this check, it would be possible for a precacheprogress event (with value 1.0) to be sent after
        // the precacheend, resuling in "Loading... 100%" being displayed on the UI, rather than the appropriate
        // date/time.
        it('precacheprogress not sent if already CACHED', function() {
            var precacheprogressSpy = jasmine.createSpy('precacheprogressSpy');
            cachedLayer.events.on({
                'precacheprogress' : precacheprogressSpy,
                scope: this
            });

            cachedLayer._precache(true);
            expect(precacheprogressSpy.callCount).toBe(1);

            cachedLayer.state = cachedLayer.STATES.CACHED;
            $(img00).trigger('onload');
            expect(precacheprogressSpy.callCount).toBe(1);
        });

        describe('precacheend', function() {
            var precacheendSpy;

            beforeEach(function() {
                precacheendSpy = jasmine.createSpy('precacheendSpy');
                cachedLayer.events.on({
                    'precacheend': precacheendSpy,
                    scope: this
                });
            });

            it('precacheend', function() {
                expect(precacheendSpy).not.toHaveBeenCalled();
                cachedLayer._getTotalImages = function() { return 1; }
                cachedLayer._getTotalImagesComplete = function() { return 1; }
                cachedLayer._precache(true);

                $(img11).trigger('onload');
                expect(precacheendSpy).toHaveBeenCalledWith(cachedLayer);
            });

            it('precacheend sent only once', function() {
                expect(precacheendSpy).not.toHaveBeenCalled();
                cachedLayer._getTotalImages = function() { return 1; }
                cachedLayer._getTotalImagesComplete = function() { return 1; }
                cachedLayer._precache(true);

                $(img01).trigger('onload');
                $(img11).trigger('onload');
                expect(precacheendSpy.callCount).toBe(1);
            });
        });

        describe('caching state', function() {
            it('initially UNCACHED', function() {
                expect(cachedLayer.state).toBe(cachedLayer.STATES.UNCACHED);
            });

            it('CACHING after precache called', function() {
                cachedLayer._precache(true);
                expect(cachedLayer.state).toBe(cachedLayer.STATES.CACHING);
            });

            it('CACHED when all tiles cached', function() {
                cachedLayer._getTotalImages = function() { return 1; }
                cachedLayer._getTotalImagesComplete = function() { return 1; }
                cachedLayer._precache(true);

                $(img01).trigger('onload');
                expect(cachedLayer.state).toBe(cachedLayer.STATES.CACHED);
            });

            it('back to CACHING when precache called again', function() {
                cachedLayer.state = cachedLayer.STATES.CACHED;

                cachedLayer._precache(true);
                expect(cachedLayer.state).toBe(cachedLayer.STATES.CACHING);
            });
        });
    });
});

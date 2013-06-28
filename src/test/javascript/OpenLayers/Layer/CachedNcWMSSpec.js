/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.CachedNcWMS", function() {
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

        OpenLayers.Layer.CachedNcWMS.prototype._getTimesToCache = function() {
            return [
                moment('2000-01-01'), moment('2000-01-02')
            ];
        };

        cachedLayer = new OpenLayers.Layer.CachedNcWMS();
        cachedLayer._getTimeControl = function() { return timeControl; }
        cachedLayer.grid = [];
        cachedLayer.grid[0] = [];

        spyOn(cachedLayer, '_getTimesToCache').andReturn([
            moment('2000-01-01T00:00:00'),
            moment('2000-01-01T01:00:00')
        ]);
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
        temporalExtentResult = [
            moment("2010-07-16T06:00:00Z"),
            moment("2010-07-16T07:00:00Z"),
            moment("2010-07-16T08:00:00Z"),
            moment("2010-07-16T09:00:00Z"),
            moment("2010-07-16T10:00:00Z")
        ];
        runs(function() {
            cachedLayer.rawTemporalExtent = 
                '2010-07-16T06:00:00Z,2010-07-16T07:00:00Z,2010-07-16T08:00:00Z,2010-07-16T09:00:00Z,2010-07-16T10:00:00Z';
            cachedLayer.temporalExtent = null;
            cachedLayer.moveTo(new OpenLayers.Bounds(4, 3, 2, 1), false, false);
        });
        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);
        runs(function() {
            expect(cachedLayer.temporalExtent).toEqual(temporalExtentResult);
        });
    });

    /* Most tests below run _precache(true) which will run
     * things synchronously in CachedNcWMS, this is to avoid
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

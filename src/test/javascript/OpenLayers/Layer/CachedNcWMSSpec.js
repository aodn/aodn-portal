/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.CachedNcWMS", function() {
    var cachedLayer;
    var extent;

    beforeEach(function() {
        OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
            return "http://someurl/page?param1=blaa";
        };
        OpenLayers.Layer.WMS.prototype.moveTo = function() {};

        cachedLayer = new OpenLayers.Layer.CachedNcWMS();
        
        spyOn(cachedLayer, '_getTimesToCache').andReturn([
            moment('2000-01-01T00:00:00'),
            moment('2000-01-01T01:00:00')
        ]);
    });
    
    it('precache called on moveTo', function() {
        spyOn(cachedLayer, '_precache');
        cachedLayer.moveTo(new OpenLayers.Bounds(1, 2, 3, 4), false, false);
        expect(cachedLayer._precache).toHaveBeenCalled();
    });

    it('precache called on each tile for each time', function() {

        var tilePrecacheSpy = jasmine.createSpy('precache');
        cachedLayer.grid = [];
        cachedLayer.grid.push([
            {
                precache: tilePrecacheSpy,
                getNumImagesComplete: function() {}
            },
            {
                precache: tilePrecacheSpy,
                getNumImagesComplete: function() {}
            }
        ]);
        cachedLayer.grid.push([
            {
                precache: tilePrecacheSpy,
                getNumImagesComplete: function() {}
            },
            {
                precache: tilePrecacheSpy,
                getNumImagesComplete: function() {}
            }
        ]);

        cachedLayer.moveTo(new OpenLayers.Bounds(1, 2, 3, 4), false, false);
        expect(tilePrecacheSpy.callCount).toBe(8);

        for (var i = 0; i < 4; i++) {
            expect(tilePrecacheSpy.calls[i].args[0]).toBeSame(moment('2000-01-01T00:00:00'));
        }
        for (var i = 4; i < 8; i++) {
            expect(tilePrecacheSpy.calls[i].args[0]).toBeSame(moment('2000-01-01T01:00:00'));
        }
    });

    describe('currently precaching images', function() {
        describe('after precache', function() {
            beforeEach(function() {
                var dummyTile = {
                    precache: function() {
                    },
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
                cachedLayer._precache();
                expect(cachedLayer._getTotalImagesComplete()).toBe(4);
            });

            it('total images', function() {
                cachedLayer._precache();
                expect(cachedLayer._getTotalImages()).toBe(8);
            });

            it('calculate progress', function() {
                cachedLayer._precache();
                expect(cachedLayer._calculateProgress()).toBe(0.5);
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
                    getNumImagesComplete: function() {}
                },
                {
                    precache: function(dateTime) {
                        return dateTime.isSame(moment('2000-01-01T00:00:00')) ? img01 : img11;
                    },
                    getNumImagesComplete: function() {}
                }
            ]);
        });
            
        it('precachestart', function() {
            var precachestartSpy = jasmine.createSpy('precachestartSpy');
            cachedLayer.events.on({
                'precachestart': precachestartSpy,
                scope: this
            });

            cachedLayer._precache();
            expect(precachestartSpy).toHaveBeenCalledWith(cachedLayer);
        });

        it('precacheprogress initially 0', function() {
            var precacheprogressSpy = jasmine.createSpy('precacheprogressSpy');
            cachedLayer.events.on({
                'precacheprogress' : precacheprogressSpy,
                scope: this
            });

            cachedLayer._precache();
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

            cachedLayer._precache();
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
                cachedLayer._calculateProgress = function() { return 1; }
                cachedLayer._precache();
                
                $(img11).trigger('onload');
                expect(precacheendSpy).toHaveBeenCalledWith(cachedLayer);
            });

            it('precacheend sent only once', function() {
                expect(precacheendSpy).not.toHaveBeenCalled();
                cachedLayer._calculateProgress = function() { return 1; }
                cachedLayer._precache();
                
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
                cachedLayer._precache();
                expect(cachedLayer.state).toBe(cachedLayer.STATES.CACHING);
            });
            
            it('CACHED after which progress reached 1', function() {
                cachedLayer._precache();
                cachedLayer._calculateProgress = function() { return 1; }
                
                $(img01).trigger('onload');
                expect(cachedLayer.state).toBe(cachedLayer.STATES.CACHED);
            });

            it('back to CACHING when precache called again', function() {
                cachedLayer.state = cachedLayer.STATES.CACHED;
                
                cachedLayer._precache();
                expect(cachedLayer.state).toBe(cachedLayer.STATES.CACHING);
            });
        });
    });
});

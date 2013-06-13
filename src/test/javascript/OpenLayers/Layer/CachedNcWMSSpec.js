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

        cachedLayer = new OpenLayers.Layer.NcWMS();
        //cachedLayer = new OpenLayers.Layer.NcWMS();
        
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
                precache: tilePrecacheSpy
            },
            {
                precache: tilePrecacheSpy
            }
        ]);
        cachedLayer.grid.push([
            {
                precache: tilePrecacheSpy
            },
            {
                precache: tilePrecacheSpy
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
        it('initially 0', function() {
            expect(cachedLayer.precacheImages.length).toBe(0);
        });

        it('0 after moveTo', function() {
            cachedLayer.precacheImages = [0, 0, 0];
            expect(cachedLayer.precacheImages.length).not.toBe(0);

            cachedLayer.moveTo(new OpenLayers.Bounds(1, 2, 3, 4), false, false);
            expect(cachedLayer.precacheImages.length).toBe(0);
        });

        describe('after precache', function() {
            beforeEach(function() {
                var dummyTile = {
                    precache: function() {
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
                expect(cachedLayer.precacheImages.length).toBe(8);
            });

            // it('total images', function() {
            //     cachedLayer._precache();
            //     expect(cachedLayer._getTotalImages()).toBe(8);
            // });
        });
    });

    describe('events', function() {
        it('precachestart', function() {
            var precachestartSpy = jasmine.createSpy('precachestartSpy');
            cachedLayer.events.on({
                'precachestart': precachestartSpy,
                scope: this
            });

            cachedLayer._precache();
            expect(precachestartSpy).toHaveBeenCalledWith(cachedLayer);
        });

        it('precacheprogress', function() {
        });
        
        it('precacheend', function() {
        });
    });
});

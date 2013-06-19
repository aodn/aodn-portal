/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Tile.TemporalImage", function() {

    var tile;

    beforeEach(function() {
        OpenLayers.Tile.TemporalImage.prototype.imgCache = {};
        
        tile = new OpenLayers.Tile.TemporalImage(
            this,
            new OpenLayers.Pixel(1, 1),
            new OpenLayers.Bounds(1, 2, 3, 4),
            null,
            new OpenLayers.Size(10, 10));
        
        tile.layer = {
            getURL: function() { return 'http://host/image.png' },
            getURLAtTime: function() { return 'http://host/image.png' }
        };
    });

    describe('initialisation', function() {
        it('each tile has own cache', function() {
            var differentTile = new OpenLayers.Tile.TemporalImage(
                this,
                new OpenLayers.Pixel(1, 1),
                new OpenLayers.Bounds(1, 2, 3, 4),
                null,
                new OpenLayers.Size(10, 10));

            expect(tile.imgCache).not.toBe(differentTile.imgCache);
        });
    });
    
    describe('caching', function() {
        var dateTime;
        
        beforeEach(function() {
            dateTime = moment('2012-06-07T23:12:56+07:00');
        });
        
        it('is not cached', function() {
            expect(tile._isCached(dateTime)).toBeFalsy();
        });

        it('is cached', function() {
            tile.imgCache[tile._getKey(dateTime)] = true;
            expect(tile._isCached(dateTime)).toBeTruthy();
        });

        it('cache', function() {
            expect(tile._isCached(dateTime)).toBeFalsy();
            tile._cache(dateTime);
            expect(tile._isCached(dateTime)).toBeTruthy();
        });

        it('clearCache', function() {
            var imgCache = {};
            var parentDiv = {};
            tile.imgCache = imgCache;
            tile.parentDiv = parentDiv;
            
            tile.clearCache();
            expect(tile.imgCache).not.toBe(imgCache);
            expect(tile.parentDiv).not.toBe(parentDiv);
        });
        
        describe('get cached', function() {
            it('not in cache', function() {
                expect(tile._isCached(dateTime)).toBeFalsy();
                expect(tile._getCached(dateTime)).toBeTruthy();
                expect(tile._isCached(dateTime)).toBeTruthy();
            });
            
            it('in cache', function() {
                tile.imgCache[tile._getKey(dateTime)] = true;
                expect(tile._isCached(dateTime)).toBeTruthy();
                expect(tile._getCached(dateTime)).toBeTruthy();
                expect(tile._isCached(dateTime)).toBeTruthy();
            });
        });
        
        it('key', function() {
            var dateTime = moment('2012-06-07T23:12:56+07:00');
            expect(tile._getKey(dateTime)).toBe('x=1,y=1-1339085576000');
        });

        it('num loaded', function() {
            tile.imgCache = {
                'key1': { complete: true },
                'key2': { complete: false },
                'key3': { complete: true }
            };

            expect(tile.getNumImagesComplete()).toBe(2);
        });
    });

    describe('image creation', function() {

        var imgDiv;
        var dateTime;
        var cachedImg;
        
        beforeEach(function() {
            imgDiv = document.createElement('img');
            imgDiv.className = 'olTile';
            imgDiv.style = 'hidden=false;';
            tile.imgDiv = imgDiv;
            
            dateTime = moment('2013-06-09T06:07:08');

            cachedImg = tile._getCached(dateTime);
        });
        
        it('src', function() {
            expect(cachedImg.src).toBe('http://host/image.png');
        });

        it('class', function() {
            expect(cachedImg.className).toBe('olTile');
        });
        
        it('style', function() {
            expect(cachedImg.style.hidden).toBeFalsy();
        });
    });

    describe('image switching', function() {

        var dateTime0 = moment(0);
        var dateTime1 = moment(1);
        var dateTime2 = moment(2);

        var img0 = document.createElement('img');;
        var img1 = document.createElement('img');;
        var img2 = document.createElement('img');;
        
        beforeEach(function() {
            tile._getCached = function(dateTime) {
                var retImg;
                switch (dateTime) {
                case dateTime0:
                    retImg = img0;
                    break;
                case dateTime1:
                    retImg = img1;
                    break;
                case dateTime2:
                    retImg = img2;
                    break;
                }

                return retImg;
            };

            tile.parentDiv = document.createElement('div');
        });
        
        it('image to time', function() {
            tile._imageToTime(dateTime0);
            expect(tile.parentDiv.childNodes.length).toBe(1);
            expect(tile.parentDiv.childNodes[0]).toBe(img0);

            tile._imageToTime(dateTime1);
            expect(tile.parentDiv.childNodes.length).toBe(1);
            expect(tile.parentDiv.childNodes[0]).toBe(img1);

            tile._imageToTime(dateTime2);
            expect(tile.parentDiv.childNodes.length).toBe(1);
            expect(tile.parentDiv.childNodes[0]).toBe(img2);
        });
    });

    describe('to time', function() {

        beforeEach(function() {
            tile._updateParentDiv = function() {
                this.parentDiv = document.createElement('div');
            };
            spyOn(tile, 'show');
        });
        
        it('parent div is initialised first time', function() {
            expect(tile.parentDiv).toBe(null);
            tile.toTime(moment('2013-01-01'));
            expect(tile.parentDiv).not.toBe(null);
        });

        it('show is called', function() {
            tile.toTime(moment('2013-01-01'));
            expect(tile.show).toHaveBeenCalled();
        });

        it('image to time called', function() {
            spyOn(tile, '_imageToTime');
            var dateTime = moment('2013-01-01');
            tile.toTime(dateTime);
            expect(tile._imageToTime).toHaveBeenCalledWith(dateTime);
        });
    });

    describe('precache', function() {
        it('precache loads image in to cache', function() {
            spyOn(tile, '_getCached').andCallThrough();
            var dateTime = moment('2010-03-03T03:03:03');
            tile.precache(dateTime, function() {}, this);
            expect(tile._getCached.calls[0].args[0]).toBeSame(dateTime);
        });

        it('precache updates parent div', function() {
            spyOn(tile, '_updateParentDiv');
            var dateTime = moment('2010-03-03T03:03:03');
            tile.precache(dateTime, function() {}, this);
            expect(tile._updateParentDiv).toHaveBeenCalled();
        });

        it('precache fills cache', function() {
            var dateTime = moment('2010-03-03T03:03:03');
            expect(tile.imgCache[tile._getKey(dateTime)]).toBeFalsy();
            tile.precache(dateTime, function() {}, this);
            expect(tile.imgCache[tile._getKey(dateTime)]).toBeTruthy();
            
        });

        describe('onload', function() {
            it('onload called immediately if image is complete', function() {
                var onloadSpy = jasmine.createSpy('onloadSpy');
                tile._getCached = function(dateTime) {
                    return { complete: true };
                };
                var dateTime = moment('2010-03-03T03:03:03');
                
                tile.precache(dateTime, onloadSpy, this);
                expect(onloadSpy).toHaveBeenCalled();
            });

            it('onload called when image is loaded', function() {
                var onloadSpy = jasmine.createSpy('onloadSpy');

                var cachedImg;
                tile._getCached = function(dateTime, onloadCallback) {
                    var img = document.createElement('img');  
                    img.src = 'someurl';
                    img.onload = onloadSpy;

                    cachedImg = img;
                    
                    return img;
                };
                
                tile.precache(moment('2010-03-03T03:03:03'), onloadSpy, this);
                expect(onloadSpy).not.toHaveBeenCalled();

                $(cachedImg).trigger('onload');
                expect(onloadSpy).toHaveBeenCalled();
                
            });
        });
    });
});

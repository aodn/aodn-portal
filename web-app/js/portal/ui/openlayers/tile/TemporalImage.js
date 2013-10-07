/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Tile.TemporalImage = OpenLayers.Class(OpenLayers.Tile.Image, {

    imgCache: null,

    parentDiv: null,

    initialize: function(layer, position, bounds, url, size) {
        this.imgCache = {};
        OpenLayers.Tile.Image.prototype.initialize.apply(this, arguments);
    },

    setOpacity: function(opacity) {
        for (var key in this.imgCache) {
            if (this.imgCache.hasOwnProperty(key) && this.imgCache[key].complete) {

                $(this.imgCache[key]).fadeTo(0, opacity);
            }
        }
    },

    toTime: function(dateTime) {
        this._updateParentDiv();
        this._imageToTime(dateTime);
        this.show();
    },

    clearCache: function() {
        this.imgCache = {};
    },

    precache: function(dateTime, onloadCallback, context) {
        this._updateParentDiv();

        var cachedImg = this._getCached(dateTime);
        this._registerOnLoad(cachedImg, onloadCallback, context);

        return cachedImg;
    },

    getNumImagesComplete: function() {
        var numComplete = 0;

        for (var key in this.imgCache) {
            if (this.imgCache.hasOwnProperty(key) && this._imageIsLoaded(this.imgCache[key])) {
                numComplete++;
            }
        }

        return numComplete;
    },

    _registerOnLoad: function(cachedImg, onloadCallback, context) {

        if (onloadCallback) {

            if (this._imageIsLoaded(cachedImg)) {
                onloadCallback.call(context);
            } else {
                $(cachedImg).load(function() {
                    onloadCallback.call(context);
                });
            }
        }
    },

    _updateParentDiv: function() {
        if (!this.parentDiv) {
            this.parentDiv = $(this.imgDiv).parent().get(0);
        }
    },

    _getKey: function(dateTime) {
        return this.position.toString() + '-' + dateTime.valueOf();
    },

    _isCached: function(dateTime) {
        return this.imgCache[this._getKey(dateTime)];
    },

    _cache: function(dateTime) {
        this.imgCache[this._getKey(dateTime)] = this._createImageAtDateTime(dateTime);
    },

    _createImageAtDateTime: function(dateTime) {
        this.url = this.layer.getURLAtTime(this.bounds, dateTime);

        var img = new Image();
        img.src = this.url;
        $(img).addClass($(this.imgDiv).attr('class'));
        $(img).attr('style', $(this.imgDiv).attr('style'));

        return img;
    },

    _getCached: function(dateTime) {
        if (!this._isCached(dateTime)) {
            this._cache(dateTime);
        }

        return this.imgCache[this._getKey(dateTime)];
    },

    _imageToTime: function(dateTime) {
        this._getCached(dateTime).style.display = '';
        $(this.parentDiv).empty();
        $(this.parentDiv).append(this._getCached(dateTime));
    },

    _imageIsLoaded: function(img) {

        return img.width > 0;
    }
});

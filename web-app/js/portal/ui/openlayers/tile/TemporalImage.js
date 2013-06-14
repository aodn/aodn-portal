/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Tile.TemporalImage = OpenLayers.Class(OpenLayers.Tile.Image, {

    imgCache: {},

    parentDiv: null,
    
    toTime: function(dateTime) {
        this._updateParentDiv();
        this._imageToTime(dateTime);
        this.show();
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
        this.url = this.layer.getURL(this.bounds);

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
        $(this.parentDiv).empty();
        $(this.parentDiv).append(this._getCached(dateTime));
    }
});

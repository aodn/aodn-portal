/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.CachedNcWMS = OpenLayers.Class(OpenLayers.Layer.NcWMS, {

    initialize: function(name, url, params, options, extent) {
        this.precachedTimes = [];
        this.EVENT_TYPES.push('precachestart');
        this.EVENT_TYPES.push('precacheprogress');
        this.EVENT_TYPES.push('precacheend');
        
        OpenLayers.Layer.NcWMS.prototype.initialize.apply(this, arguments);
    },
    
    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.WMS.prototype.moveTo.apply(this, arguments);

        this._precache();
    },
    
    _precache: function() {
        this.events.triggerEvent('precachestart', this);
        this.events.triggerEvent('precacheprogress', {
            layer: this,
            progress: 0
        });
        
        this.precachedTimes = this._getTimesToCache();
        var self = this;

        for (var i = 0; i < this.precachedTimes.length; i++) {
            this.eachTile(function(tile) {
                tile.precache(self.precachedTimes[i], self._imageLoaded, self);
            });
        }
    },

    _imageLoaded: function(img) {
        var progress = this._calculateProgress();
        this.events.triggerEvent('precacheprogress', {
            layer: this,
            progress: progress
        });

        if (progress == 1) {
            this.events.triggerEvent('precacheend', this);
        }
    },

    _getTimesToCache: function() {
        var timeControl = this.map.getControlsByClass('OpenLayers.Control.Time')[0];

        if (timeControl) {
            return timeControl.timer.tickDateTimes;
        }

        return [];
    },

    _getTotalImages: function() {
        return this.precachedTimes.length * this._getNumTiles();
    },
    
    _getTotalImagesComplete: function() {
        var totalComplete = 0;

        this.eachTile(function(tile) {
            totalComplete += tile.getNumImagesComplete();
        });

        return totalComplete;
    },

    _calculateProgress: function() {
        return this._getTotalImagesComplete() / this._getTotalImages();
    }
});

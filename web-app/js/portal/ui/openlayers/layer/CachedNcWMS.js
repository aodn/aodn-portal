/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.CachedNcWMS = OpenLayers.Class(OpenLayers.Layer.NcWMS, {

    initialize: function(name, url, params, options, extent) {
        // Store the currently precaching images, so that we can calculate progress when precaching the layer.
        this.precacheImages = [];
        this.EVENT_TYPES.push('precachestart');
        
        OpenLayers.Layer.NcWMS.prototype.initialize.apply(this, arguments);
    },
    
    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.WMS.prototype.moveTo.apply(this, arguments);

        this.precacheImages = [];
        this._precache();
    },
    
    _precache: function() {
        this.events.triggerEvent('precachestart', this);

        var self = this;
        var timesToCache = this._getTimesToCache();
        for (var i = 0; i < timesToCache.length; i++) {
            this.eachTile(function(tile) {
                var img = tile.precache(timesToCache[i]);
                self.precacheImages.push(img);
            });
        }
    },

    _getTimesToCache: function() {
        var timeControl = this.map.getControlsByClass('OpenLayers.Control.Time')[0];

        if (timeControl) {
            return timeControl.timer.tickDateTimes;
        }

        return [];
    }
});

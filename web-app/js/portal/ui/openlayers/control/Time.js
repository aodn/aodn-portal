/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Control.Time = OpenLayers.Class(OpenLayers.Control, {
    initialize: function(options) {
    
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    play: function() {
        this.map.play();
    },

    stop: function() {
        this.map.stop();
    }
});

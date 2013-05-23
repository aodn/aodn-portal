/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.TemporalMap = OpenLayers.Class(OpenLayers.Map, {
    
    initialize: function(div, options) {
    
        OpenLayers.Map.prototype.initialize.apply(this, [div, options]);
    },

    play: function() {
    },

    stop: function() {
    }
});


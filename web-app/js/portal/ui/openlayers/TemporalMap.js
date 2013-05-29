/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.TemporalMap = OpenLayers.Class(OpenLayers.Map, {
    
    initialize: function(div, options) {
    
        OpenLayers.Map.prototype.initialize.apply(this, arguments);
    },

    toTime: function(dateTime) {

        for (var i = 0, len = this.layers.length; i < len; i++) {
            var layer = this.layers[i];

            if (layer.toTime) {
                layer.toTime(dateTime);
                layer.redraw();
            }
        }
    },

    CLASS_NAME: "OpenLayers.TemporalMap"
});


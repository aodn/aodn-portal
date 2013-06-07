/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Tile.TemporalImage = OpenLayers.Class(OpenLayers.Tile.Image, {

    initialize: function(name, url, extent, size, options) {
        OpenLayers.Tile.Image.prototype.initialize.apply(this, arguments);
    }
});

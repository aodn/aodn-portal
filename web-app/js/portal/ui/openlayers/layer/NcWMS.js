/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.NcWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    initialize: function(name, url, params, options) {

        console.log("NcWMS layer init");
        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [name, url, params, options]);
    },

    /**
     * Method: getURL
     * Return a GetMap query string for this layer
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} A bounds representing the bbox for the
     *                                request.
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters.
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        
        var imageSize = this.getImageSize();
        var newParams = {};
        // WMS 1.3 introduced axis order
        var reverseAxisOrder = this.reverseAxisOrder();
        newParams.BBOX = this.encodeBBOX ?
            bounds.toBBOX(null, reverseAxisOrder) :
            bounds.toArray(reverseAxisOrder);
        newParams.WIDTH = imageSize.w;
        newParams.HEIGHT = imageSize.h;



        // 2011-03-18T13:00:00Z
        // 2012-10-28T08:00:00Z
//        newParams.TIME = '2011-03-18T13:00:00Z'
        newParams.TIME = '2012-10-28T08:00:00Z'
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },

    /**
     * Method: addTile
     * addTile creates a tile, initializes it, and adds it to the layer div. 
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
     */
    addTile:function(bounds,position) {
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                         null, this.tileSize);
    }
});

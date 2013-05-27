/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.NcWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    /**
     * Moment in time that this layer represents.
     */
    time: null,
    
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
        // 2011-03-18T13:00:00Z
        // 2012-10-28T08:00:00Z
        var url = OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);
        url = url + '&TIME=' + this.time.format();

        return url;
    },

    toTime: function(dateTime) {
        this.time = dateTime;
    }
});

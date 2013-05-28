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
     * Valid temporal extent of the layer as Array of times.
     */
    temporalExtent: null,

    initialize: function(name, url, params, options, extent) {
        if (extent) {
            this.setTemporalExtent(extent);
        }

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, arguments);
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
    getURL: function(bounds) {
        // 2011-03-18T13:00:00Z
        // 2012-10-28T08:00:00Z

        var url = OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);

        if (this.time) {
            url = url + '&TIME=' + this.time.format();
        }

        return url;
    },

    toTime: function(dateTime) {

        // No extent restriction.
        if (!this.temporalExtent || this.temporalExtent.length == 0) {
            this.time = moment(dateTime);
        }
        else {
            // Find nearest in temporalExtent.
            var goalDateTime = moment(dateTime);

            var closestDateTime;

            for (var i = 0; i < this.temporalExtent.length; i++) {
                if (   closestDateTime == null
                       || (  Math.abs(this.temporalExtent[i].diff(goalDateTime))
                             < Math.abs(goalDateTime.diff(closestDateTime)))) {

                    closestDateTime = this.temporalExtent[i];
                }
                // Handle the case where two dates are equally close - take the earlier.
                else if (Math.abs(this.temporalExtent[i].diff(goalDateTime))
                         == Math.abs(goalDateTime.diff(closestDateTime))) {
                    closestDateTime =
                        this.temporalExtent[i].isBefore(closestDateTime) ? this.temporalExtent[i] : closestDateTime;
                }
            }

            this.time = closestDateTime;
        }

        return this.time;
    },

    /**
     * @param extent Can be either Array of times (String or Moment), or ISO8601 repeating interval.
     */
    setTemporalExtent: function(extent) {

        if (extent instanceof Array) {
            this.temporalExtent = this._arrayOfStringsToMoments(extent);
        }
        else {
            // ISO8601 repeating interval.
            var expandedTimes = expandExtendedISO8601Dates(extent).split(',');

            for (var i = 0; i < expandedTimes.length; i++) {
                expandedTimes[i] = moment(expandedTimes[i]);
            }
            this.temporalExtent = this._arrayOfStringsToMoments(expandExtendedISO8601Dates(extent).split(','));
        }
    },

    _arrayOfStringsToMoments: function(timesAsStrings) {

        var timesAsMoments = [];
        for (var i = 0; i < timesAsStrings.length; i++) {
            timesAsMoments[i] = moment(timesAsStrings[i]);
        }

        return timesAsMoments;
    },

    getTemporalExtent: function() {
        return this.temporalExtent;
    }
});

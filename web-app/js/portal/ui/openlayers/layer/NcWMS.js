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

    getURLAtTime: function(bounds, dateTime) {
        return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]) + '&TIME='
            + dateTime.utc().format('YYYY-MM-DDTHH:mm:ss');
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

        if (this.time) {
            return this.getURLAtTime(bounds, this.time);
        }

        return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);
    },

    toNearestTime: function(dateTime) {

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

    toTime: function(dateTime) {
        this.time = dateTime;

        // We do the following so that loadstart/loadend events aren't triggered (which would cause the
        // "Layer Loading..." popup to be continually displayed).
        var existingEvents = this.events;
        this.events = new OpenLayers.Events(this, this.div, 
                                            this.EVENT_TYPES);


        this.eachTile(function(tile) {
            tile.toTime(dateTime);
        });
        
        this.events = existingEvents;
        
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
    },

    addTile: function(bounds, position) {
        return new OpenLayers.Tile.TemporalImage(this, position, bounds, null, this.tileSize);
    },

    eachTile: function(applyToTileFunction) {

        var processedTiles = [];
        
        for (var rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
            for (var colIndex = 0; colIndex < this.grid[rowIndex].length; colIndex++) {
                applyToTileFunction(this.grid[rowIndex][colIndex]);
                processedTiles.push(this.grid[rowIndex][colIndex]);
            }
        }

        return processedTiles;
    },

    _getNumTiles: function() {
        return this.grid.length * this.grid[0].length;
    },
    
    getDatesOnDay: function(dateTime) {

        var retDates = [];
        
        if (!this.temporalExtent) {
            return retDates;
        }

        for (var i = 0; i < this.temporalExtent.length; i++) {
            var dateTimeAsMoment = moment(dateTime);
            var dateToCheck = this.temporalExtent[i];

            if (   dateTimeAsMoment.year() == dateToCheck.year()
                && dateTimeAsMoment.month() == dateToCheck.month()
                && dateTimeAsMoment.date() == dateToCheck.date()) {
                retDates.push(dateToCheck);
            }
        }
        
        return retDates;
    }
});

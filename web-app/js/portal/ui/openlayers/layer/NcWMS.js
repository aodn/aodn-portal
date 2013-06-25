/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.NcWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    DEFAULT_GIF_HEIGHT: 512,
    
    /**
     * Moment in time that this layer represents.
     */
    time: null,

    /**
     * Valid temporal extent of the layer as Array of times.
     */
    temporalExtent: null,

    initialize: function(name, url, params, options, extent) {

        name += ' (animated)';
        
        if (extent) {
            this.setTemporalExtent(extent);
        }

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, arguments);
        
    },

    setOpacity: function(opacity) {
        OpenLayers.Layer.WMS.prototype.setOpacity.apply(this, arguments);

        this.eachTile(function(tile) {
            tile.setOpacity(opacity);
        });
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

    getTemporalExtentMin: function() {
        return moment(this.temporalExtent[0]);
    },
    
    getTemporalExtentMax: function() {
        return moment(this.temporalExtent.last());
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
            this.temporalExtent = expandExtendedISO8601Dates(extent);
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
            var dateTimeAsMoment = moment(dateTime).local();
            var dateToCheck = moment(this.temporalExtent[i]).local();

            if (this._momentIsEqualByYearMonthDate(dateTimeAsMoment, dateToCheck)) {
                retDates.push(dateToCheck);
            }
            else {
                if (retDates.length > 0) {
                    break;
                }
            }
        }
        
        return retDates;
    },

    getMissingDays: function() {
        // Memoize
        if (this.missingDays) {
            return this.missingDays;
        }

        this.missingDays = [];
        var candidate = this.temporalExtent[0].clone();
        for (var i = 0; i < this.temporalExtent.length; i++) {
            var nextDate = this.temporalExtent[i].clone();

            if (!this._momentIsEqualByYearMonthDate(candidate, nextDate)) {
                var upperBound = nextDate.subtract('days', 1);
                if (!this._momentIsEqualByYearMonthDate(candidate, upperBound)) {
                    while (!this._momentIsEqualByYearMonthDate(candidate, upperBound)) {
                        candidate.add('days', 1);
                        this.missingDays.push(candidate.clone().startOf('day'));
                    }
                }
                candidate = this.temporalExtent[i].clone();
            }
        }
        return this.missingDays;
    },

    downloadAsGif: function(params) {
        var gifUrl = this._getGifUrl(params);

        window.open(
            gifUrl,
            '_blank',
            'width=200,height=200,menubar=no,location=no,resizable=no,scrollbars=no,status=yes');
    },
    
    _getGifUrl: function(params) {
        var url = this.getFullRequestString();

        if (params) {
            if (params.spatialExtent) {
                url = this._appendParam(url, 'BBOX', params.spatialExtent.toBBOX());
                url = this._appendParam(
                    url,
                    'HEIGHT',
                    Math.floor(this.DEFAULT_GIF_HEIGHT * params.spatialExtent.getHeight() / params.spatialExtent.getWidth()));
            }

            if (params.temporalExtent) {
                var format = 'YYYY-MM-DDTHH:mm:ss';
                url = this._appendParam(url, 'TIME', params.temporalExtent.min.utc().format(format) + '/' +
                                        params.temporalExtent.max.utc().format(format));
            }
        }
        
        url = this._appendParam(url, 'FORMAT', 'image/gif');
        url = this._appendParam(url, 'WIDTH', this.DEFAULT_GIF_HEIGHT);

        url = url.replace('FORMAT=image%2Fpng&', '')
        
        return 'proxy/downloadGif?url=' + url;
    },

    _appendParam: function(base, name, value) {
        return base += '&' + name + '=' + value;
    },
    
    _momentIsEqualByYearMonthDate: function(left, right) {
        return left.year() == right.year()
            && left.month() == right.month()
            && left.date() == right.date();
    }
});

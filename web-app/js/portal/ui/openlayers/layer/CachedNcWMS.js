/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.CachedNcWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    DEFAULT_GIF_HEIGHT: 512,

    STATES: {
        UNCACHED: 'UNCACHED',
        CACHING: 'CACHING',
        CACHED: 'CACHED'
    },

    /**
     * Moment in time that this layer represents.
     */
    time: null,

    /**
     * Valid temporal extent of the layer as Array of times.
     */
    temporalExtent: null,
    /**
     * Raw temporal extent, before transformation.
     */
    rawTemporalExtent: null,

    initialize: function(name, url, params, options, extent) {
        name += ' (animated)';

        this.precachedTimes = [];
        this.state = this.STATES.UNCACHED;

        this.EVENT_TYPES.push('precachestart');
        this.EVENT_TYPES.push('precacheprogress');
        this.EVENT_TYPES.push('precacheend');

        // If it's a string, we'll process it later, asynchronously
        // If it's an array (assuming of moments), we'll just use it
        this.rawTemporalExtent = extent;
        if (!extent) { this.temporalExtent = []; this.temporalExtentLengthToProcess = 0; }

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, arguments);
    },

    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.WMS.prototype.moveTo.apply(this, arguments);
        this._precache();
    },

    /**
     * private functions dealing with caching
     */

    /* This function is run asynchronously unless specified otherwise
     * Normal behaviour is to run this asynchronously
     */
    _precache: function(sync) {
        // Always run async, unless specified by a test
        sync = typeof sync !== 'undefined' ? sync : false;

        // Start caching
        this.state = this.STATES.CACHING;
        this.events.triggerEvent('precachestart', this);

        // Run synchronously ONLY for test/mock purposes as running
        // tests with jasmine and async calls proved to be rather difficult
        var self = this;
        if (!sync) {
            setTimeout(function() {
                self._processTemporalExtent();
            }, 0);
        } else {
            this._processTemporalExtent();
        }
    },

    _processTemporalExtent: function() {
        if (this.temporalExtent) {
            // Already processed
            this._processTemporalExtentDone();
            return;
        }

        var arrayOfStringDates = [];
        if (this.rawTemporalExtent instanceof Array) {
            arrayOfStringDates = this.rawTemporalExtent;
        } else {
            arrayOfStringDates = this.rawTemporalExtent.split(",");
        }

        this.temporalExtent = [];
        var chunkSize = 1024;
        // Used for showing/tracking progress, also in _calculateProgress()
        this.temporalExtentLengthToProcess = arrayOfStringDates.length;
        this._progressFeedback();

        var that = this;
        (function () {
            var chunkStart;
            function processDates() {
                var chunkStart = 0;
                (function () {
                    var chunkEnd = chunkStart + chunkSize;
                    if (chunkEnd >= that.temporalExtentLengthToProcess) {
                        chunkEnd = that.temporalExtentLengthToProcess;
                    }

                    // Concat array in place
                    that.temporalExtent.push.apply(
                        that.temporalExtent,
                        expandExtendedISO8601Dates(
                            arrayOfStringDates,chunkStart, chunkEnd)
                    );
                    chunkStart = chunkEnd;
                    that._progressFeedback();

                    if (that.temporalExtentLengthToProcess > chunkStart) {
                        setTimeout(arguments.callee, 0);
                    } else {
                        // Need to reconfigure layer as we processed times
                        // TODO: Configure for last 10 frames, a bit
                        // ugly and hardcoded
                        var timeControl = that._getTimeControl();
                        timeControl.configureForLayer(that, 10);
                        that._processTemporalExtentDone();
                    }
                })();
            }
            processDates();
        })();
    },

    _processTemporalExtentDone: function() {
        // Unset rawTemporalExtent, meaning that we're done
        this.rawTemporalExtent = null;
        this._precacheTiles();
    },

    // This function is run asynchronously
    _precacheTiles: function() {
        this.events.triggerEvent('precacheprogress', {
            layer: this,
            progress: 0
        });

        this.precachedTimes = this._getTimesToCache();
        var self = this;

        this.eachTile(function(tile) {
            tile.clearCache();
        });

        // TODO: Can potentially open a gazillion requests for simul-caching
        for (var i = 0; i < this.precachedTimes.length; i++) {
            this.eachTile(function(tile) {
                tile.precache(self.precachedTimes[i], self._imageLoaded, self);
            });
        }
    },

    _precacheDone: function() {
        if (this.state !== this.STATES.CACHED) {
            this.events.triggerEvent('precacheend', this);
            this.state = this.STATES.CACHED;
        }
    },

    _progressFeedback: function() {
        var progress = this._calculateProgress();
        this.events.triggerEvent('precacheprogress', {
            layer: this,
            progress: progress
        });
    },

    _getTimesToCache: function() {
        var timeControl = this._getTimeControl();

        if (timeControl) {
            return timeControl.timer.tickDateTimes;
        }

        return [];
    },

    _getTimeControl: function() {
        return this.map.getControlsByClass('OpenLayers.Control.Time')[0];
    },

    _getTotalImages: function() {
        return this.precachedTimes.length * this._getNumTiles();
    },

    _getTotalImagesComplete: function() {
        var totalComplete = 0;

        this.eachTile(function(tile) {
            totalComplete += tile.getNumImagesComplete();
        });

        return totalComplete;
    },

    _calculateProgress: function() {
        var dateProcessProgress = 0;
        var imageCacheProgress = 0;

        if (this.temporalExtentLengthToProcess != 0) {
            dateProcessProgress = this.temporalExtent.length / this.temporalExtentLengthToProcess;
        } else {
            dateProcessProgress = 0;
        }

        if (this._getTotalImages() != 0) {
            imageCacheProgress = this._getTotalImagesComplete() / this._getTotalImages();
        } else {
            imageCacheProgress = 0;
        }

        return (dateProcessProgress + imageCacheProgress) / 2;
    },

    _imageLoaded: function(img) {
        if (this.state !== this.STATES.CACHED) {
            this._progressFeedback();
        }

        if (this._getTotalImages() == this._getTotalImagesComplete()) {
            this._precacheDone();
        }
    },

    /**
     * Temporal extent functions
     */

    getTemporalExtent: function() {
        return this.temporalExtent;
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

    _momentIsEqualByYearMonthDate: function(left, right) {
        return left.year() == right.year()
            && left.month() == right.month()
            && left.date() == right.date();
    },

    /**
     * URL handling functions
     */

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

    getURLAtTime: function(bounds, dateTime) {
        return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]) + '&TIME='
            + dateTime.utc().format('YYYY-MM-DDTHH:mm:ss');
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

    /**
     * Tile related functions
     */

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
        if(!this.grid || !this.grid[0]) { return 0; }
        return this.grid.length * this.grid[0].length;
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

    setOpacity: function(opacity) {
        OpenLayers.Layer.WMS.prototype.setOpacity.apply(this, arguments);

        this.eachTile(function(tile) {
            tile.setOpacity(opacity);
        });
    }
});

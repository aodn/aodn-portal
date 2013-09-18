/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.NcWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    DEFAULT_GIF_HEIGHT: 512,

    FRAMES_TO_LOAD_ON_INIT: 10,

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

    /**
     * Missing days in temporal extent
     */
    missingDays: null,

    initialize: function(name, url, params, options, extent) {

        var nameWithStatus = name + ' (animated)';

        this.precachedTimes = [];
        this.state = this.STATES.UNCACHED;

        this.EVENT_TYPES.push('precachestart');
        this.EVENT_TYPES.push('precacheprogress');
        this.EVENT_TYPES.push('precacheend');

        // If it's a string, we'll process it later, asynchronously
        // If it's an array (assuming of moments), we'll just use it
        this.rawTemporalExtent = extent;
        if (!extent) {
            this.temporalExtent = [];
            this.temporalExtentLengthToProcess = 0;
        }

        // Initialize missingDays
        this.missingDays = [];

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [nameWithStatus, url, params, options, extent]);
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
            this.render();
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
                    // Process missing days
                    that._generateMissingDays(chunkStart, chunkEnd);

                    // Increment chunkEnd
                    chunkStart = chunkEnd;

                    // Provide the user with some feedback, we're doing stuff.
                    that._progressFeedback();

                    if (that.temporalExtentLengthToProcess > chunkStart) {
                        setTimeout(arguments.callee, 0);
                    } else {
                        that._processTemporalExtentDone();
                        that._configureTimeControl();
                    }
                })();
            }
            processDates();
        })();
    },

    _configureTimeControl: function() {
        // Need to reconfigure layer as we processed times
        // TODO: Configure for last 10 frames, a bit
        // ugly and hardcoded
        var timeControl  = this._getTimeControl();
        var framesToLoad =
            Math.min(this.getTemporalExtent().length, this.FRAMES_TO_LOAD_ON_INIT);

        timeControl.configureForLayer(this, framesToLoad);
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
            progress: 0.5
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

    _imageLoaded: function() {
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
        this.render();
        this.events = existingEvents;
        
        return this.time;
    },

    render: function() {
        var dateTime = this.time;
        
        this.eachTile(function(tile) {
            tile.toTime(dateTime);
        });
    },
    
    // Returns true if left and right has the same date (not time),
    // false otherwise
    isSameDay: function(left, right) {
        return left.year() == right.year()
            && left.month() == right.month()
            && left.date() == right.date();
    },

    // TODO: transform temporalExtent to a 2 dimensional array, indexed by date
    // will be significantly more elegant than this binary search
    // Returns all dates in temporalExtent which have the same date (not time)
    // as dateTime
    getDatesOnDay: function(dateTime) {
        if (!this.temporalExtent) { return []; }

        // Will give us an occurance of the date given, not necessarily
        // the first or last
        var indexOfSameDate = binSearch(
            this.temporalExtent, dateTime,
            this.isSameDay);

        // No dates found - return
        if (indexOfSameDate == -1) { return []; }

        // Find first date withing that day
        // Go back (left) in array until we get to a different date
        // then it means we find the first index of that date
        var startIndex = indexOfSameDate;
        while (startIndex - 1 >= 0 &&
               this.isSameDay(this.temporalExtent[startIndex - 1], dateTime)) {
            --startIndex;
        }

        var endIndex = indexOfSameDate;
        while (endIndex + 1 < this.temporalExtent.length &&
               this.isSameDay(this.temporalExtent[endIndex + 1], dateTime)) {
            ++endIndex;
        }

        return this.temporalExtent.slice(startIndex, endIndex + 1);
    },

    _generateMissingDays: function(startIndex, endIndex) {
        startIndex = typeof startIndex !== 'undefined' ? startIndex : 0;
        endIndex   = typeof endIndex   !== 'undefined' ? endIndex   : this.temporalExtent.length;

        // Find leaps in the array, in terms of dates
        // Note: i does not necessarily start from 0, as we do
        // chunk processing here...
        for (var i = startIndex; i < endIndex; i++) {
            // If we're at 0, then skip the first iteration, as we reference
            // temporalExtent[i-1]
            if (i > 0) {
                var previousExistingDay = this.temporalExtent[i-1].clone().startOf('day');
                var currentExistingDay  = this.temporalExtent[i]  .clone().startOf('day');

                // Fill in all the days in this gap (if there's any), a day after
                // the previous existing date, until a day before the current
                // existing date
                for (var nonExistingDay = previousExistingDay.clone().add('days', 1);
                     nonExistingDay.isBefore(currentExistingDay);
                     nonExistingDay = nonExistingDay.add('days', 1)) {
                     this.missingDays.push(nonExistingDay.clone());
                }
            }
        }
    },

    getMissingDays: function() {
        return this.missingDays;
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
            + dateTime.clone().utc().format('YYYY-MM-DDTHH:mm:ss');
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

    /* Overrides */
    getFeatureInfoRequestString: function(clickPoint, overrideParams) {
        var timeControl = this._getTimeControl();

        overrideParams.TIME =
            timeControl.getExtentMin().clone().utc().format('YYYY-MM-DDTHH:mm:ss')
            + "/" +
            timeControl.getExtentMax().clone().utc().format('YYYY-MM-DDTHH:mm:ss');

        overrideParams.FORMAT = "image/png";
        overrideParams.INFO_FORMAT = "image/png";
        return OpenLayers.Layer.WMS.prototype.getFeatureInfoRequestString.call(this, clickPoint, overrideParams);
    },

    /* Overrides */
    getFeatureInfoFormat: function() {
        // Setting this in getExtraFeatureInfo, but we need to override the
        // default 'text/xml' one
        // See below as it is being wrapped with a <div> and <img src=''>
        return "";
    },

    /* Overrides */
    formatFeatureInfoHtml: function(resp, options) {
        return "<div><img src='" + options.url + "'></div>";
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

    isAnimatable: function() {
        return true;
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
                url = this._appendParam(url, 'TIME', params.temporalExtent.min.clone().utc().format(format) + '/' +
                                        params.temporalExtent.max.clone().utc().format(format));
            }
        }

        url = this._appendParam(url, 'FORMAT', 'image/gif');
        url = this._appendParam(url, 'WIDTH', this.DEFAULT_GIF_HEIGHT);

        url = url.replace('FORMAT=image%2Fpng&', '');

        return 'proxy/downloadGif?url=' + url;
    },

    _appendParam: function(base, name, value) {
        return base + '&' + name + '=' + value;
    },

    setOpacity: function(opacity) {
        OpenLayers.Layer.WMS.prototype.setOpacity.apply(this, arguments);

        this.eachTile(function(tile) {
            tile.setOpacity(opacity);
        });
    }
});

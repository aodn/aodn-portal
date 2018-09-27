
OpenLayers.Layer.NcWms = OpenLayers.Class(OpenLayers.Layer.WMS, {

    /**
     * Moment in time that this layer represents.
     */
    time: null,

    /**
     * Valid temporal extent of the layer as Array of times.
     */
    temporalExtent: null,

    /**
     * Pending ajax requests for obtaining times of day
     */
    pendingRequests: null,

    initialize: function(name, url, params, options) {
        this.temporalExtent = new Portal.visualise.animations.TemporalExtent();
        this.pendingRequests = new Portal.utils.Set();

        params['SERVICE'] = "ncwms";
        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [name, url, params, options]);

        this._setExtraLayerInfoFromNcwms();
        this._loadTimeSeriesDates();
        this._loadStyles();
    },

    _setExtraLayerInfoFromNcwms: function() {
        Ext.Ajax.proxyRequestJSON({
            scope: this,
            url: this._getExtraLayerInfoFromNcwms(),
            success: function(resp, options) {
                try {
                    this.extraLayerInfo = Ext.util.JSON.decode(resp.responseText);
                    this._setNumColorBands();

                    this.events.triggerEvent('extraLayerInfoloaded', this);
                    // This means we are "GFI ready"
                    this.params.QUERYABLE = true;
                }
                catch (e) {
                    log.error("Could not parse extra layer info for NcWMS layer '" + this.params.LAYERS + "'");
                }
            },
            failure: function() {
                log.error("Could not get extra layer info for NcWMS layer '" + this.params.LAYERS + "'");
            }
        });
    },

    _setNumColorBands: function() {
            if (this.extraLayerInfo.numColorBands != undefined) {
                this.mergeNewParams({ NUMCOLORBANDS: this.extraLayerInfo.numColorBands });
            }
    },

    _loadTimeSeriesDates: function() {
        var url = this._getFiltersUrl();

        Ext.Ajax.request({
            scope: this,
            url: url,
            success: function(resp, options) {

                // Assume only one filter which is the one we're after
                var dateFilter = Ext.util.JSON.decode(resp.responseText)[0];
                var datesToProcess = dateFilter['possibleValues'];

                if (datesToProcess.length > 0) {
                    try {
                        this._parseDatesWithDataAsync(datesToProcess);
                    }
                    catch (e) {
                        log.error("Could not parse dates for NcWMS layer '" + this.params.LAYERS + "'");
                        this.events.triggerEvent('temporalextentloaded', this);
                    }
                }
                else {
                    this.events.triggerEvent('temporalextentloaded', this);
                }
            },
            failure: function() {
                log.error("Could not get filters for NcWMS layer '" + this.params.LAYERS + "'");
            }
        });
    },

    _loadStyles: function() {
        var url = this._getStylesUrl();

        Ext.Ajax.request({
            scope: this,
            url: url,
            success: function(resp, options) {
                try {
                    this._stylesLoaded(Ext.util.JSON.decode(resp.responseText));
                }
                catch (e) {
                    log.error("Could not parse styles for NcWMS layer '" + this.params.LAYERS + "'");
                }
            },
            failure: function() {
                log.error("Could not get styles for NcWMS layer '" + this.params.LAYERS + "'");
            }
        });
    },

    _timeSeriesDatesLoaded: function() {
        this.loadTimeSeriesForDay(this.temporalExtent.getFirstDay());
        this.loadTimeSeriesForDay(this.temporalExtent.getLastDay());
    },

    _stylesLoaded: function(response) {
        var styles = [];

        var includesVectorStyle = false;

        Ext.each(response.palettes.sort(), function(palette) {

            Ext.each(response.styles.sort(), function(style) {

                if (style == 'vector') {
                    includesVectorStyle = true;
                }

                styles.push({
                    name: style,
                    palette: palette
                });
            });
        }, this);

        this.styles = styles;

        if (response.defaultPalette != null) {
            var defaultStyle = (includesVectorStyle ? 'vector' : 'boxfill');
            this.defaultStyle = defaultStyle + '/' + response.defaultPalette;
        }

        this.events.triggerEvent('stylesloaded', this);
    },

    _initToMostRecentTime: function() {
        this.time = moment.utc(this.temporalExtent.max());
    },

    getTimeSeriesForDay: function(date) {
        if (this.temporalExtent.getDay(date) && this.temporalExtent.getDay(date).length > 0) {
            return this.temporalExtent.getDay(date);
        }
        else {
            // Might not be loaded, will need to call loadTimeSeriesForDay before that!
            return null;
        }
    },

    loadTimeSeriesForDay: function(date) {
        if (this.getTimeSeriesForDay(date)) {
            this._timeSeriesLoadedForDate();
        }
        else {
            this._fetchTimeSeriesForDay(date);
        }
    },

    _timeSeriesLoadedForDate: function() {
        if (0 == this.pendingRequests.size()) {
            this._initSubsetExtent();

            if (!this.time) {
                this._initToMostRecentTime();
                this.params['TIME'] = this._getTimeParameter(this.time);
            }

            this.events.triggerEvent('temporalextentloaded', this);
        }
    },

    _fetchTimeSeriesForDay: function(date) {
        var url = this._getTimeSeriesUrl(date);
        this.pendingRequests.add(url);

        Ext.Ajax.request({
            scope: this,
            url: url,
            success: function(resp, options) {
                try {
                    var dateArray = Ext.util.JSON.decode(resp.responseText);
                    Ext.each(dateArray, function(date) {
                        this.temporalExtent.add(date);
                    }, this);
                    this.pendingRequests.remove(url);
                    this._timeSeriesLoadedForDate();
                }
                catch (e) {
                    log.error("Could not parse times for day '" + date.format('YYYY-MM-DD') + "' for layer '" + this.params.LAYERS + "'");
                    this.pendingRequests.remove(url);
                }
            },
            failure: function() {
                log.error("Could not get times for day '" + date.format('YYYY-MM-DD') + "' for layer '" + this.params.LAYERS + "'");
                this.pendingRequests.remove(url);
            }
        });
    },

    _destroyed: function() {
        return !this.events;
    },

    /**
     * Temporal extent functions
     */

    getLoadedExtent: function() {
        return this.temporalExtent.getLoadedExtent();
    },

    getTemporalExtent: function() {
        return this.temporalExtent;
    },

    getTemporalExtentMin: function() {
        return this.temporalExtent.min();
    },

    getTemporalExtentMax: function() {
        return this.temporalExtent.max();
    },

    setTime: function(dateTime) {
        // Don't send a request if we don't have to
        if (!this.time || this._isValidTime(dateTime)) {
            this.time = dateTime;
            this.mergeNewParams({ TIME: this._getTimeParameter(this.time) });
        }
        return this.time;
    },

    setZAxis: function(elevation) {
        // ELEVATION is the zaxis
        this.mergeNewParams({ ELEVATION: (elevation == undefined) ? null : elevation });
    },

    getMissingDays: function() {
        return this.temporalExtent.getMissingDays();
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
        return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);
    },

    _parseDatesWithDataAsync: function(datesToProcess) {

        // Interleave processing into chunks, browser will be more responsive
        var chunkSize = 256;
        var idx = 0;
        var that = this;
        (function() {
            var chunkEnd = idx + chunkSize;
            var datesWithDataArray = [];
            for (; idx < datesToProcess.length && idx < chunkEnd; ++idx) {
                datesWithDataArray.push(new moment.utc(datesToProcess[idx]));
            }

            that.temporalExtent.addDays(datesWithDataArray);

            if (idx >= datesToProcess.length) {
                // We're done, stop processing
                that._timeSeriesDatesLoaded();
            }
            else {
                setTimeout(arguments.callee, 0);
            }
        })();
    },

    _getTimeParameter: function(dateTime) {
        return dateTime.clone().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    },

    _getExtraLayerInfoFromNcwms: function() {
        return String.format(
            "{0}?layerName={1}&SERVICE=ncwms&REQUEST=GetMetadata&item=layerDetails",
            this.url,
            encodeURIComponent(this.params.LAYERS)
        );
    },

    _getFiltersUrl: function() {
        return String.format(
            "layer/getFilters?serverType=ncwms&server={0}&layer={1}",
            encodeURIComponent(this.url),
            encodeURIComponent(this.params.LAYERS)
        );
    },

    _getStylesUrl: function() {
        return String.format(
            "layer/getStyles?serverType=ncwms&server={0}&layer={1}",
            encodeURIComponent(this.url),
            encodeURIComponent(this.params.LAYERS)
        );
    },

    _getTimeSeriesUrl: function(date) {
        return String.format(
            "layer/getFilterValues?serverType=ncwms&server={0}&layer={1}&filter={2}",
            encodeURIComponent(this.url),
            encodeURIComponent(this.params.LAYERS),
            date.clone().startOf('day').toISOString()
        );
    },

    /* Overrides */
    getFeatureInfoRequestString: function(clickPoint, overrideParams) {
        if (this.time) {
            overrideParams.TIME = this._getTimeParameter(this.time);
        }
        overrideParams.INFO_FORMAT = this.getFeatureInfoFormat();
        return OpenLayers.Layer.WMS.prototype.getFeatureInfoRequestString.call(this, clickPoint, overrideParams);
    },

    /* Overrides */
    getFeatureInfoFormat: function() {
        return "text/xml";
    },

    /* Overrides */
    formatFeatureInfoHtml: function(resp, options) {
        return formatGetFeatureInfo(resp, options);
    },

    isNcwms: function() {
        return true;
    },

    getPreviousTimeSlice: function() {
        if (this.time) {
            var previousDay = this.temporalExtent.previousValidDate(this.time);
            this.loadTimeSeriesForDay(previousDay);
        }
    },

    goToPreviousTimeSlice: function() {
        if (this.temporalExtent.previous(this.time)) {
            this.setTime(this.temporalExtent.previous(this.time));
        }
    },

    getNextTimeSlice: function() {
        if (this.time) {
            var nextDay = this.temporalExtent.nextValidDate(this.time);
            this.loadTimeSeriesForDay(nextDay);
        }
    },

    goToNextTimeSlice: function() {
        if (this.temporalExtent.next(this.time)) {
            this.setTime(this.temporalExtent.next(this.time));
        }
    },

    _initSubsetExtent: function() {
        if (!this.subsetExtent) {
            this.setSubsetExtentView(this.temporalExtent.min(), this.temporalExtent.max());
        }
    },

    setSubsetExtentView: function(min, max) {
        this.subsetExtent = {
            min: min,
            max: max
        };
    },

    getSubsetExtentMin: function() {
        return (this.subsetExtent) ? this.subsetExtent.min : null;
    },

    getSubsetExtentMax: function() {
        return (this.subsetExtent) ? this.subsetExtent.max : null;
    },

    _isValidTime: function(dateTime) {
        return dateTime && this.temporalExtent.isValid(dateTime) && this.time.valueOf() != dateTime.valueOf();
    }
});

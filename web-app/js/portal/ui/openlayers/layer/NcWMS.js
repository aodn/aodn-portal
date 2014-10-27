/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Layer.NcWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    DEFAULT_GIF_HEIGHT: 512,
    FRAMES_TO_LOAD_ON_INIT: 1,

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

        this.EVENT_TYPES.push('temporalextentloaded');
        this.EVENT_TYPES.push('stylesloaded');

        this.temporalExtent = new Portal.visualise.animations.TemporalExtent();

        this.pendingRequests = new Portal.utils.Set();

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, this._propagateDelete, this);

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [name, url, params, options]);

        // We assume that before the first GFI request we will be quick enough
        // to complete that little tiny request
        this._setMetadataFromNcWMS();

        this._loadTimeSeriesDates();
        this._loadStyles();
    },

    _setMetadataFromNcWMS: function() {
        Ext.Ajax.proxyRequest({
            scope: this,
            url: this._getMetadataFromNcWMS(),
            success: function(resp, options) {
                try {
                    this.metadata = Ext.util.JSON.decode(resp.responseText);
                }
                catch (e) {
                    log.error("Could not parse metadata for NcWMS layer '" + this.params.LAYERS + "'");
                }
            },
            failure: function() {
                log.error("Could not get metadata for NcWMS layer '" + this.params.LAYERS + "'");
            }
        });
    },

    _loadTimeSeriesDates: function() {
        Ext.Ajax.request({
            scope: this,
            url: "layer/getFiltersAsJSON" + "?serverType=ncwms&server=" + this.url + "&layer=" + this.params.LAYERS,
            success: function(resp, options) {
                try {
                    this._timeSeriesDatesLoaded(Ext.util.JSON.decode(resp.responseText));
                }
                catch (e) {
                    log.error("Could not parse filters for NcWMS layer '" + this.params.LAYERS + "'");
                }
            },
            failure: function() {
                log.error("Could not get filters for NcWMS layer '" + this.params.LAYERS + "'");
            }
        });
    },

    _loadStyles: function() {
        var url = "layer/getStylesAsJSON" + "?serverType=ncwms&server=" + this.url + "&layer=" + this.params.LAYERS;

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

    _timeSeriesDatesLoaded: function(response) {
        var datesWithData = this._parseDatesWithData(response);

        this.temporalExtent.addDays(datesWithData);

        this.loadTimeSeriesForDay(this.temporalExtent.getFirstDay());
        this.loadTimeSeriesForDay(this.temporalExtent.getLastDay());
    },

    _stylesLoaded: function(response) {
        var styles = [];

        Ext.each(response.styles.sort(), function(style) {
            Ext.each(response.palettes.sort(), function(palette) {
                styles.push({
                    name: style,
                    palette: palette
                });
            });
        }, this);

        this.styles = styles;

        this.events.triggerEvent('stylesloaded', this);
    },

    _initToMostRecentTime: function() {
        this.time = moment.utc(this.temporalExtent.max());
    },

    _propagateDelete: function(label, thelayer) {
        if (thelayer == this) {
            delete this;
        }
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

    toTime: function(dateTime) {
        // Don't send a request if we don't have to
        if (!this.time || this._isValidTime(dateTime)) {
            this.time = dateTime;
            this.mergeNewParams({ TIME: this._getTimeParameter(this.time) });
        }
        return this.time;
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

    _parseDatesWithData: function(response) {
        datesWithDataArray = [];

        // Assume only one filter which is the one we're after
        var dateFilter = response[0];

        if (dateFilter['possibleValues']) {
            Ext.each(dateFilter['possibleValues'], function(dateString) {
                var dateWithData = new moment.utc(dateString);
                datesWithDataArray.push(dateWithData);
            });
        }

        return datesWithDataArray;
    },

    _getTimeParameter: function(dateTime) {
        return dateTime.clone().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
    },

    _getMetadataFromNcWMS: function() {
        var metadataUrl = this.url + "?layerName=" + this.params.LAYERS + "&REQUEST=GetMetadata&item=layerDetails";
        return metadataUrl;
    },

    _getTimeSeriesUrl: function(date) {
        var timeSeriesUrl = "layer/getFilterValuesAsJSON" + "?serverType=ncwms&server=" + this.url + "&layer=" + this.params.LAYERS + "&filter=" + date.clone().startOf('day').toISOString();
        return timeSeriesUrl;
    },

    /* Overrides */
    getFeatureInfoRequestString: function(clickPoint, overrideParams) {
        overrideParams.TIME = this._getTimeParameter(this.time);
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
        var previousDay = this.temporalExtent.previousValidDate(this.time);
        this.loadTimeSeriesForDay(previousDay);
    },

    goToPreviousTimeSlice: function() {
        if (this.temporalExtent.previous(this.time)) {
            this.toTime(this.temporalExtent.previous(this.time));
        }
    },

    getNextTimeSlice: function() {
        var nextDay = this.temporalExtent.nextValidDate(this.time);
        this.loadTimeSeriesForDay(nextDay);
    },

    goToNextTimeSlice: function() {
        if (this.temporalExtent.next(this.time)) {
            this.toTime(this.temporalExtent.next(this.time));
        }
    },

    getCqlForTemporalExtent: function() {
        if (!this.bodaacFilterParams) {
            return null;
        }

        var cqlParts = [];

        var start = this.bodaacFilterParams.dateRangeStart;
        if (start) {
            cqlParts.push('time >= ' + start.toISOString());
        }

        var end = this.bodaacFilterParams.dateRangeEnd;
        if (end) {
            cqlParts.push('time <= ' + end.toISOString());
        }

        return cqlParts.join(" and ");
    },

    _buildGetFeatureRequestUrl: function(baseUrl, layerName, outputFormat) {
        // Call the WMS class and apply NO download filters (null)
        var wfsRequest = OpenLayers.Layer.WMS.prototype._buildGetFeatureRequestUrl.apply(
            this,
            [
                baseUrl,
                layerName,
                outputFormat,
                null
            ]
        );

        var cql = this.getCqlForTemporalExtent();
        if (cql) {
            wfsRequest += "&CQL_FILTER=" + encodeURIComponent(cql);
        }

        return wfsRequest;
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

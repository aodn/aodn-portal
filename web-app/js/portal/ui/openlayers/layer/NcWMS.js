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
     * Raw temporal extent, before transformation.
     */
    rawTemporalExtent: null,

    /**
     * Missing days in temporal extent
     */
    missingDays: null,

    initialize: function(name, url, params, options, temporalInfo) {

        this.EVENT_TYPES.push('temporalextentloaded');

        this.rawTemporalExtent = temporalInfo.extent;
        this._initToMostRecentTime(temporalInfo.defaultValue);
        params['TIME'] = this._getTimeParameter(this.time);

        if (!temporalInfo.extent) {
            this.temporalExtent = new Portal.visualise.animations.TemporalExtent();
        }

        // Initialize missingDays
        this.missingDays = [];

        Ext.MsgBus.subscribe(PORTAL_EVENTS.LAYER_REMOVED, this._propogateDelete, this);

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [name, url, params, options]);
    },

    _initToMostRecentTime: function(dateTimeString) {
        this.time = moment.utc(dateTimeString);
    },

    _propogateDelete: function(label, thelayer) {
        if (thelayer == this) {
            delete this;
        }
    },

    processTemporalExtent: function() {
        if (this._destroyed()) {
            return;
        }

        if (this.temporalExtent) {
            // Already processed
            this._processTemporalExtentDone();
            return;
        }

        this.temporalExtent = new Portal.visualise.animations.TemporalExtent();
        this.temporalExtent.on('extentparsed', this._processTemporalExtentDone, this);
        this.temporalExtent.parse(this.rawTemporalExtent);
    },

    _processTemporalExtentDone: function() {
        // Unset rawTemporalExtent, meaning that we're done
        this.rawTemporalExtent = null;
        this.time = this.temporalExtent.max();
        this.events.triggerEvent('temporalextentloaded', this);
    },

    _destroyed: function() {
        return !this.events;
    },

    /**
     * Temporal extent functions
     */

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
        this.time = dateTime;
        if (this.time) {
            this.mergeNewParams({ TIME: this._getTimeParameter(dateTime) });
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

        if (this.time) {
            return this.getURLAtTime(bounds, this.time);
        }

        return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);
    },

    getURLAtTime: function(bounds, dateTime) {

        var baseUrl = OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);
        var time = this._getTimeParameter(dateTime);

        return baseUrl + '&TIME=' + time;
    },

    _getTimeParameter: function(dateTime) {
        return dateTime.clone().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
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

    isAnimatable: function() {
        return true;
    },

    _appendParam: function(base, name, value) {
        return base + '&' + name + '=' + value;
    },

    previousTimeSlice: function() {
        var previous = this.temporalExtent.previous(this.time);
        if (previous) {
            return this.toTime(previous);
        }
    },

    nextTimeSlice: function() {
        var next = this.temporalExtent.next(this.time);
        if (next) {
            return this.toTime(next);
        }
    }
});

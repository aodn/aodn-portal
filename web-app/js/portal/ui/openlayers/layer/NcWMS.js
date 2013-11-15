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
        overrideParams.TIME = this._getTimeParameter(this.time); //this.time.clone().utc().format('YYYY-MM-DDTHH:mm:ss');
        overrideParams.FORMAT = "text/xml";
        overrideParams.INFO_FORMAT = overrideParams.FORMAT;
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

    isAnimatable: function() {
        return true;
    },

    // @deprecated
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
                url = this._appendParam(url, 'TIME', params.temporalExtent.min().clone().utc().format(format) + '/' +
                                        params.temporalExtent.max().clone().utc().format(format));
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

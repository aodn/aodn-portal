/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Timer = OpenLayers.Class({

    /**
     * The set of dates that ticks correspond to.
     */
    tickDateTimes: [],

    /**
     * The interval between 'ticks'.
     */
    tickInterval: null,

    currTickIndex: 0,

    observers: [],

    /**
     * Reference to the javascript 'interval' object, which is used to generate the tick events.
     */
    intervalRef: null,

    initialize: function(options) {

        this.tickDateTimes = [];

        if (options && options.startDateTime && options.endDateTime) {
            var startDateTime = moment(options.startDateTime);
            var endDateTime = moment(options.endDateTime);
            var currDateTime = moment(startDateTime);
            var numTicks = options.numTicks ? options.numTicks : 10;

            var i = 0;

            var interval =  this._getTickDateTimeInterval(startDateTime, endDateTime, numTicks);

            while (!currDateTime.isAfter(endDateTime)) {
                this.tickDateTimes[i] = moment(currDateTime);
                currDateTime.add(interval);

                i++;
            }
        }
        else if (options && options.tickDateTimes) {
            this.setTickDateTimes(options.tickDateTimes);
        }

        this.tickInterval = moment.duration(options && options.tickInterval ? options.tickInterval : 500);
        this.observers = [];
    },

    setTickDateTimes: function(tickDateTimes) {
        this.tickDateTimes = tickDateTimes;
    },

    getStartDateTime: function() {
        return this.tickDateTimes[0];
    },

    getEndDateTime: function() {
        return this.tickDateTimes[this.tickDateTimes.length - 1];
    },

    getNumTicks: function() {
        if (this.tickDateTimes.length == 0) {
            return undefined;
        }
        
        return this.tickDateTimes.length;
    },

    _getDuration: function(startDateTime, endDateTime) {
        return moment.duration(endDateTime.diff(startDateTime));
    },

    _getTickDateTimeInterval: function(startDateTime, endDateTime, numTicks) {
        return moment.duration(this._getDuration(startDateTime, endDateTime) / (numTicks - 1));
    },

    getDuration: function() {
        return moment.duration(this.getEndDateTime().diff(this.getStartDateTime()));
    },

    getCurrTickIndex: function() {
        return this.currTickIndex;
    },

    tickForward: function() {
        this.currTickIndex = (this.currTickIndex + 1) % this.getNumTicks();
        this.onTick(this.currTickIndex);
    },

    tickBackward: function() {
        this.currTickIndex = (this.getNumTicks() + this.currTickIndex - 1) % this.getNumTicks();
        this.onTick(this.currTickIndex);
    },

    getTickDateTime: function(tickIndex) {
        return this.tickDateTimes[tickIndex];
    },

    on: function(eventName, observer, context) {

        if (!observer) {
            this.observers[eventName] = undefined;
        }
        else {
            this.observers[eventName] = {
                callback: observer,
                context: context
            };
        }
    },

    onTick: function(tickIndex) {
        if (this.observers['tick']) {

            var context;
            if (this.observers['tick'].context) {
                context = this.observers['tick'].context;
            }
            else {
                context = this;
            }
            context.callback = this.observers['tick'].callback;
            context.callback({
                index: tickIndex,
                dateTime: this.getTickDateTime(tickIndex)
            });
        }
    },

    start: function() {

        // Send one straight away.
        this.onTick(this.currTickIndex);
        this._setTimeout();
    },

    _setTimeout: function() {
        var self = this;

        var callbackWrapper = function() {
            self.tickForward();
            self.intervalRef = window.setTimeout(callbackWrapper, self.tickInterval.asMilliseconds());
        };
        
        this.intervalRef = window.setTimeout(callbackWrapper, this.tickInterval.asMilliseconds());
    },

    stop: function() {
        if (this.intervalRef) {
            this._clearTimeout();
        }
    },

    _clearTimeout: function() {
        clearTimeout(this.intervalRef);
    },

    _resetTimeout: function() {
        this._clearTimeout();
        this._setTimeout();
    },
    
    doubleFrequency: function() {
        this.tickInterval = moment.duration(this.tickInterval.asMilliseconds() / 2);
        this._resetTimeout();
    },

    halveFrequency: function() {
        this.tickInterval = moment.duration(this.tickInterval.asMilliseconds() * 2);
        this._resetTimeout();
    },
    
    CLASS_NAME: "OpenLayers.Timer"
});

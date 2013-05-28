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

        if (options.startDateTime && options.endDateTime) {
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
        else if (options.tickDateTimes) {
            this.setTickDateTimes(options.tickDateTimes);
        }
        else {
            // error
        }

        this.tickInterval = moment.duration(options.tickInterval ? options.tickInterval : 500);
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

    on: function(eventName, observer) {
        this.observers[eventName] = observer;
    },

    onTick: function(tickIndex) {
        if (this.observers['tick']) {
            this.observers['tick']({
                index: tickIndex,
                dateTime: this.getTickDateTime(tickIndex)
            });
        }
    },

    start: function() {

        // Send one straight away.
        this.onTick(this.currTickIndex);

        var self = this;

        this.intervalRef = window.setInterval(function() {
            self.tickForward();
        }, this.tickInterval.asMilliseconds());
    },

    stop: function() {
        if (this.intervalRef) {
            clearInterval(this.intervalRef);
        }
    },

    CLASS_NAME: "OpenLayers.Timer"
});

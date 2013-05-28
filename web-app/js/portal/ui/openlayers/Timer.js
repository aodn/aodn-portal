/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Timer = OpenLayers.Class({

    startDateTime: null,

    // TODO: add doco that the last time tick will include this value.
    endDateTime: null,

    /**
     * The number of ticks.  The ticks will be spaced evenly across the full range of time.
     */
    numTicks: 10,

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

        this.startDateTime = moment(options.startDateTime);
        this.endDateTime = moment(options.endDateTime);

        if (options.numTicks) {
            this.numTicks = options.numTicks;
        }

        this.tickInterval = moment.duration(options.tickInterval ? options.tickInterval : 500);
        this.observers = [];
    },

    getDuration: function() {
        return moment.duration(this.endDateTime.diff(this.startDateTime));
    },

    getTickInterval: function() {
        return moment.duration(this.getDuration() / (this.numTicks - 1));
    },
    
    getCurrTickIndex: function() {
        return this.currTickIndex;
    },

    tickForward: function() {
        this.currTickIndex = (this.currTickIndex + 1) % this.numTicks;
        this.onTick(this.currTickIndex);
    },

    tickBackward: function() {
        this.currTickIndex = (this.numTicks + this.currTickIndex - 1) % this.numTicks;
        this.onTick(this.currTickIndex);
    },

    getTickDateTime: function(tickIndex) {
        var tickDateTime = moment(this.startDateTime);
        return tickDateTime.add(tickIndex * this.getTickInterval());
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

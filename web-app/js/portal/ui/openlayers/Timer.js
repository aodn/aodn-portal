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
    numTicks: 10,

    currTickIndex: 0,
    
    initialize: function(options) {

        this.startDateTime = moment(options.startDateTime);
        this.endDateTime = moment(options.endDateTime);

        if (options.numTicks) {
            this.numTicks = options.numTicks;
        }
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
    },

    tickBackward: function() {
        this.currTickIndex = (this.numTicks + this.currTickIndex - 1) % this.numTicks;
    },

    getTickDateTime: function(tickIndex) {
        var tickDateTime = moment(this.startDateTime);
        return tickDateTime.add(tickIndex * this.getTickInterval());
    },
    
    CLASS_NAME: "OpenLayers.Timer"
    
});

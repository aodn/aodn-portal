/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Control.Time = OpenLayers.Class(OpenLayers.Control, {

    /**
     * The timer generates 'tick' events given a date range and a frequency.
     */
    timer: null,

    /**
     * The map that this control is controlling.
     */
    map: null,

    initialize: function(options) {

        this.timer = new OpenLayers.Timer(options);
        this.map = options.map;

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    play: function() {
        this.timer.on('tick', this.onTick);
        this.timer.start()
    },

    stop: function() {
        this.timer.stop();
        this.timer.on('tick', undefined);
    },

    onTick: function(tickEvent) {
        this.map.toTime(tickEvent.dateTime);
    }
});

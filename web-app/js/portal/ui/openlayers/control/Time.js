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

    initialize: function(options) {

        this.timer = new OpenLayers.Timer(options);

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
    },

    configureForLayer: function(layer, numTicksToUse) {
        var layerExtentLength = layer.getTemporalExtent().length;
        this.timer.setTickDateTimes(layer.getTemporalExtent().slice(layerExtentLength - numTicksToUse, layerExtentLength));

        // Update the map straight away.
        this.onTick({
            index: 0,
            dateTime: this.timer.getStartDateTime()
        });
    }
});

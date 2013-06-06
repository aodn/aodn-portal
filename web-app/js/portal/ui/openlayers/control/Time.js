/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Control.Time = OpenLayers.Class(OpenLayers.Control, {

	STATES : {
		PLAYING : 'PLAYING',
		STOPPED: 'STOPPED'
	},

    state: null,
    
    /**
     * The timer generates 'tick' events given a date range and a frequency.
     */
    timer: null,

    initialize: function(options) {

        this.timer = new OpenLayers.Timer(options);
        this.state = this.STATES.STOPPED;

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.timer.on('tick', this.onTick, this);
    },

    play: function() {
        if (this.state != this.STATES.PLAYING) {
            this.state = this.STATES.PLAYING;
            this.timer.on('tick', this.onTick, this);
            this.timer.start()
        }
    },

    stop: function() {
        if (this.state != this.STATES.STOPPED) {
            this.timer.stop();
            this.timer.on('tick', undefined);
            this.state = this.STATES.STOPPED;
        }
    },

    speedUp: function() {
        this.timer.doubleFrequency();
    },

    slowDown: function() {
        this.timer.halveFrequency();
    },

    setStep: function(stepIndex) {
        this.timer.setCurrTickIndex(stepIndex);
    },
    
    onTick: function(tickEvent) {
        this.map.toTime(tickEvent.dateTime);
    },

    configureForLayer: function(layer, numTicksToUse) {

        if (layer instanceof OpenLayers.Layer.NcWMS) { 
            var layerExtentLength = layer.getTemporalExtent().length;
            this.timer.setTickDateTimes(
                layer.getTemporalExtent().slice(layerExtentLength - numTicksToUse, layerExtentLength));

            // Update the map straight away.
            this.onTick({
                index: 0,
                dateTime: this.timer.getStartDateTime()
            });
        }
    },

    getStep: function() {
        return this.timer.getCurrTickIndex();
    },
    
    getExtent: function() {
        if (this.timer) {
            return this.timer.tickDateTimes;
        }
    },

    CLASS_NAME: 'OpenLayers.Control.Time'
});

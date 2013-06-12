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

    SPEED_LIMIT: 32,

    state: null,
    
    /**
     * The timer generates 'tick' events given a date range and a frequency.
     */
    timer: null,

    relativeSpeed: 1,
    
    initialize: function(options) {

        this.timer = new OpenLayers.Timer(options);
        this.state = this.STATES.STOPPED;

        OpenLayers.Control.prototype.initialize.apply(this, [options]);

        // The 'addEventType' function is supposedly deprecated and unecessary, but be my guest
        // if you can get the tests to pass without calling it.
        this.events.addEventType('speedchanged');
        this.events.addEventType('temporalextentchanged');
        
        this.timer.on('tick', this.onTick, this);
    },

    play: function() {
        if (this.state != this.STATES.PLAYING) {
            this.state = this.STATES.PLAYING;
            this.timer.start()
        }
    },

    stop: function() {
        if (this.state != this.STATES.STOPPED) {
            this.timer.stop();
            this.state = this.STATES.STOPPED;
        }
    },

    speedUp: function() {
        if (this.relativeSpeed <= (this.SPEED_LIMIT / 2)) {
            this.relativeSpeed = this.relativeSpeed * 2;
            this.timer.doubleFrequency();
            this.events.triggerEvent('speedchanged', this);
            return true;
        }

        return false;
    },

    slowDown: function() {
        if (this.relativeSpeed >= (2 / this.SPEED_LIMIT)) {
            this.relativeSpeed = this.relativeSpeed / 2;
            this.timer.halveFrequency();
            this.events.triggerEvent('speedchanged', this);
            
            return true;
        }

        return false;
    },

    isAtSlowestSpeed: function() {
        return this.relativeSpeed == 1 / this.SPEED_LIMIT;
    },

    isAtFastestSpeed: function() {
        return this.relativeSpeed == 1 * this.SPEED_LIMIT;
    },
    
    setStep: function(stepIndex) {
        this.timer.setCurrTickIndex(stepIndex);
    },
    
    onTick: function(tickEvent) {
        this.map.toTime(tickEvent.dateTime);
    },

    /**
     * @range can be an integer, meaning use the last 'n' date times from the layer's extent;
     * or it could be an array with two elements - a start date/time and an end date/time.
     */
    configureForLayer: function(layer, range) {

        var timerTickDateTimes;
        var layerExtentLength = layer.getTemporalExtent().length;
        
        if (range instanceof Array) {
            timerTickDateTimes = this._getExtentForRange(layer, range);
        }
        else {
            timerTickDateTimes = this._getLastNFromExtent(layer, range);
        }
        
        this.timer.setTickDateTimes(timerTickDateTimes);

        this.events.triggerEvent(
            'temporalextentchanged',
            {
                layer: {
                    min: layer.getTemporalExtent()[0],
                    max: layer.getTemporalExtent()[layerExtentLength - 1]
                },
                timer: {
                    min: timerTickDateTimes[0],
                    max: timerTickDateTimes[timerTickDateTimes.length - 1]
                }
            }
        );
        
        // Update the map straight away.
        this.onTick({
            index: 0,
            dateTime: this.timer.getStartDateTime()
        });
    },

    _getLastNFromExtent: function(layer, n) {
        var layerExtentLength = layer.getTemporalExtent().length;
        return layer.getTemporalExtent().slice(layerExtentLength - n, layerExtentLength);
    },
    
    _getExtentForRange: function(layer, range) {
        var layerExtentLength = layer.getTemporalExtent().length;
        
        var startDateTime = moment(range[0]);
        var endDateTime = moment(range[1]);

        var startIndex;
        var endIndex;

        for (var i = 0; i < layerExtentLength; i++) {

            if ((startIndex == undefined) && layer.getTemporalExtent()[i].isSame(startDateTime)) {
                startIndex = i
            }
            
            if (layer.getTemporalExtent()[i].isSame(endDateTime)) {
                endIndex = i
            }
        }

        return layer.getTemporalExtent().slice(startIndex, endIndex + 1);
    },
    
    getStep: function() {
        return this.timer.getCurrTickIndex();
    },
    
    getExtent: function() {
        if (this.timer) {
            return this.timer.tickDateTimes;
        }
    },

    getRelativeSpeed: function() {
        return this.relativeSpeed;
    },
    
    CLASS_NAME: 'OpenLayers.Control.Time'
});

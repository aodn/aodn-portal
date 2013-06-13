/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.AnimationControlsPanel = Ext.extend(Ext.Panel, {

	state : {
		LOADING : "LOADING",
		PLAYING : "PLAYING",
		REMOVED : "REMOVED",
        PAUSED : "PAUSED"
	},

	constructor : function(cfg) {
		var config = Ext.apply({
					layout : 'form',
					stateful : false,
					bodyStyle : 'padding:6px; margin:2px',
					defaults : {
						cls : 'fullTransparency'
					},
					width : '100%'
				}, cfg);

		Portal.details.AnimationControlsPanel.superclass.constructor.call(this, config);

        
        Ext.MsgBus.subscribe('removeLayer', function(mesg,openLayer) {

        }, this);
        
        Ext.MsgBus.subscribe('selectedLayerChanged', this._onSelectedLayerChanged, this);

        if (this.timeControl) {
            this.timeControl.events.on({
                'speedchanged': this._onSpeedChanged,
                'temporalextentchanged': this._onTemporalExtentChanged,
                scope: this
            });
        }
	},

	initComponent : function() {
		var parentAnimationControl = this;

		this.warn = new Ext.form.Label({
					padding : 5,
					width : 280,
					text : OpenLayers.i18n('warn_label')
				});

		this.speedUp = new Ext.Button({
					icon : 'images/animation/last.png',
					plain : true,
					padding : 5,
					listeners : {
						scope : this,
						'click' : function(button, event) {
                            this._startPlaying();

                            this.timeControl.speedUp();
                            // this._updateSpeedLabel();
                            // this._updateSpeedUpSlowDownButtons();
						}
					},
					tooltip : OpenLayers.i18n('speedUp')
				});

		this.slowDown = new Ext.Button({
					icon : 'images/animation/first.png',
					padding : 5,
					listeners : {
						scope : this,
						'click' : function(button, event) {
                            this._startPlaying();
                            this.timeControl.slowDown();
                            // this._updateSpeedLabel();
                            // this._updateSpeedUpSlowDownButtons();
						}
					},
					tooltip : OpenLayers.i18n('slowDown')
				});

		this.label = new Ext.form.Label({
					html : "<h4>Select Time Period</h4>"
				});

		this.stepSlider = new Ext.slider.SingleSlider({
					ref : 'stepSlider',
					width : 115,
					flex : 3,
					listeners : {
						scope : this,
						drag : function(slider, ev) {
                            this.timeControl.setStep(slider.getValue());
						}
					}
				});

		this.playButton = new Ext.Button({
					padding : 5,
					plain : true,
					disabled : false, // readonly
					icon : 'images/animation/play.png',
					listeners : {
						scope : this,
						'click' : this._togglePlay
					},
					tooltip : OpenLayers.i18n('play')
				});

		this.currentState = this.state.REMOVED;

		this.stepLabel = new Ext.form.Label({
					flex : 1,
					width : 115,
					style : 'padding-top: 5; padding-bottom: 5'
				});

		this.speedLabel = new Ext.form.Label({
			flex : 1,
			style : 'padding: 5',
            text: '1x'
		});

		this.buttonsPanel = new Ext.Panel({
					layout : 'hbox',
					plain : true,
					items : [this.slowDown, this.playButton, this.speedUp],
					height : 40,
					flex : 2
				});

        this.dateTimeSelectorPanel = new Portal.details.AnimationDateTimeSelectorPanel({
            parentAnimationControl: this,
            timeControl: this.timeControl,
            width: 350
        });
        
		this.getAnimationButton = new Ext.Button({
			icon : 'images/animation/download.png',
			text : 'download',
			hidden : true,
			listeners : {
				scope : this,
				click : function() {
					if (this.originalLayer.slides.length > 0) {
						// need to workout BBOX
						var clonedLayer = this.originalLayer.slides[0].clone();
						var bounds = this.originalLayer.map.getExtent();

						clonedLayer.mergeNewParams({
							TIME : this.originalLayer.slides[0].params.TIME
									+ "/"
									+ this.originalLayer.slides[this.originalLayer.slides.length
											- 1].params.TIME,
							BBOX : bounds.toBBOX(),
							FORMAT : "image/gif", // must be gif!!
							WIDTH : 512,
							HEIGHT : Math.floor(512
									* (bounds.getHeight() / bounds.getWidth()))
						});

						clonedLayer.map = this.originalLayer.map;

						var fullUrl = "proxy/downloadGif?url="
								+ clonedLayer.getFullRequestString();
						window
								.open(
										fullUrl,
										'_blank',
										"width=200,height=200,menubar=no,location=no,resizable=no,scrollbars=no,status=yes");
					}
				}
			}
		});

		this.controlPanel = new Ext.Panel({
					layout : 'form',
					plain : true,
					items : [{
						xtype : 'container',
						defaultMargins : "15 5 20 5",
						layout : {
							type : 'hbox',
							pack : 'start'

						},
						items : [this.buttonsPanel, this.stepSlider,
								this.speedLabel, this.stepLabel]
					}, this.dateTimeSelectorPanel, this.getAnimationButton],
					width : 330,
					height : '100%'
				});

		this.items = [this.controlPanel];

		this.speed = this.BASE_SPEED;
		this.mapPanel = undefined;

		this.pausedTime = "";
		this.timerId = -1;

		Portal.details.AnimationControlsPanel.superclass.initComponent.call(this);
	},

	setMap : function(theMap) {
	    
		// TODO: ok, there's now a dependency on the OpenLayers Map (instead of MapPanel),
		// but hopefully this will vanish when animation is refactored.
		this.map = theMap;
        this.map.events.register('moveend', this, this._onMove);
        this.map.events.register('timechanged', this, this._onTimeChanged);
	},

    _onSelectedLayerChanged: function(subject, openLayer) {

        if (this.selectedLayer) {
            this.selectedLayer.events.un({
                'precacheprogress': this._onSelectedLayerPrecacheProgress,
                scope: this
            });
        }
        
        if (openLayer && openLayer.isAnimatable()) {
            this.selectedLayer = openLayer;

            this.timeControl.configureForLayer(openLayer, 10);
            this.stepSlider.setMinValue(0);
            this.stepSlider.setMaxValue(this.timeControl.getExtent().length - 1);

            this.selectedLayer.events.on({
                'precacheprogress': this._onSelectedLayerPrecacheProgress,
                scope: this
            });
        }
    },

    _onSelectedLayerPrecacheProgress: function(evt) {
//        console.log('onSelectedLayerPrecacheProgress', evt.progress);
    },
    
    _onSpeedChanged: function(timeControl) {
        this._updateSpeedLabel();
        this._updateSpeedUpSlowDownButtons();
    },

    _onTemporalExtentChanged: function(evt) {
        this.stepSlider.setMinValue(0);
        this.stepSlider.setMaxValue(this.timeControl.getExtent().length - 1);
    },

    _updateSpeedUpSlowDownButtons: function() {
        if (this.timeControl.isAtFastestSpeed()) {
            this.speedUp.disable();
        }
        else {
            this.speedUp.enable();
        }

        if (this.timeControl.isAtSlowestSpeed()) {
            this.slowDown.disable();
        }
        else {
            this.slowDown.enable();
        }
    },
    
    _updateSpeedLabel: function() {
        this.speedLabel.setText(this.timeControl.getRelativeSpeed() + 'x');
    },

	_togglePlay : function(button, event) {
		if (this.currentState == this.state.PLAYING) {
			this._stopPlaying();
		} else {
			this._startPlaying();
		}
	},

	_stopPlaying : function() {
        this.timeControl.stop();

		this._updateButtons(this.state.PAUSED);
	},

	_startPlaying : function() {
        this._updateButtons(this.state.PLAYING);

        this.timeControl.play();
	},

    _onTimeChanged: function(dateTime) {
        this.stepSlider.setValue(this.timeControl.getStep());
        this._setStepLabelText(dateTime.format('YYYY-MM-DD HH:mm:ss'));
    },
    
	_updateButtons : function(state) {
		this.currentState = state;

		if (state == this.state.LOADING) {
			// can't change the time when it's loading
			this.playButton.setIcon('images/animation/pause.png');
			this.stepSlider.disable();
			this.speedUp.disable();
			this.slowDown.disable();
			this.speedLabel.setVisible(false);
			this.getAnimationButton.setVisible(false);
		} else if (state == this.state.PLAYING) {
			// can't change the time when it's playing
			this.playButton.setIcon('images/animation/pause.png');
			this.stepSlider.enable();
			this.speedLabel.setVisible(true);
			this.getAnimationButton.setVisible(true);
			this._updateSpeedButtons();

            this.dateTimeSelectorPanel.disable();
		} else if (state == this.state.REMOVED) {
			this.playButton.setIcon('images/animation/play.png');
			this.playButton.enable();
            this.stepSlider.setValue(0);
			// nothing's playing, so stop and pause doesn't make sense

			this.speedLabel.setVisible(false);
			this.getAnimationButton.setVisible(false);

			this._updateSpeedButtons();
            this.dateTimeSelectorPanel.enable();
		} else if (state == this.state.PAUSED) {
            this.playButton.setIcon('images/animation/play.png');
            this.playButton.enable();
            // nothing's playing, so stop and pause doesn't make sense

            this.speedLabel.setVisible(false);
            this.getAnimationButton.setVisible(true);

            this._updateSpeedButtons();
            this.dateTimeSelectorPanel.enable();
        }
	},

	// Grey out speed buttonss if reached max multiplier
	_updateSpeedButtons : function() {
		if (this.speed * 1000 <= this.BASE_SPEED * 1000
				/ this.MAX_SPEED_MULTIPLIER) {
			this.speedUp.disable();
		} else if (this.speed >= this.MAX_SPEED_MULTIPLIER * this.BASE_SPEED) {
			this.slowDown.disable();
		} else {
			this.slowDown.enable();
			this.speedUp.enable();
		}
	},

	isAnimating : function() {
        // TODO: this is most likely dodgy.
        // Need to check when and how this function is called.
        return false;
	},

	loadFromSavedMap : function(layer, stamps) {
		this.setSelectedLayer(layer);
	},

	_setStepLabelText : function(text) {
		this.stepLabel.setText(text, false);
	}
});

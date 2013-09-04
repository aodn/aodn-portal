/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.AnimationControlsPanel = Ext.extend(Ext.Panel, {

    constructor : function(cfg) {
        var config = Ext.apply({
            layout : 'form',
            stateful : false,
            bodyStyle : 'padding:6px; margin:2px',
            width : '100%'
        }, cfg);

        Portal.details.AnimationControlsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, this._onBeforeSelectedLayerChanged, this);

        if (this.timeControl) {
            this.timeControl.events.on({
                'speedchanged': this._onSpeedChanged,
                'temporalextentchanged': this._onTemporalExtentChanged,
                scope: this
            });
        }
    },

    initComponent : function() {

        this.cls = 'animationSubPanel';

        this.warn = new Ext.form.Label({
            padding : 5,
            width : 280,
            text : OpenLayers.i18n('warn_label')
        });

        this.speedUp = new Portal.visualise.animations.AnimationSpeedButton({
            iconCls : 'ffButton',
            plain : true,
            padding : 5,
            listeners : {
                scope : this,
                'click' : function() {
                    this._startPlaying();
                    this.timeControl.speedUp();
                }
            },
            tooltip : OpenLayers.i18n('speedUp')
        });

        this.slowDown = new Portal.visualise.animations.AnimationSpeedButton({
            iconCls : 'rewindButton',
            padding : 5,
            listeners : {
                scope : this,
                'click' : function() {
                    this._startPlaying();
                    this.timeControl.slowDown();
                }
            },
            tooltip : OpenLayers.i18n('slowDown')
        });

        this.label = new Ext.form.Label({
            html : "<h4>Select Time Period</h4>"
        });

        this.stepSlider = new Portal.visualise.animations.AnimationStepSlider({
            ref : 'stepSlider',
            width : 115,
            flex : 3,
            listeners : {
                scope : this,
                drag : function(slider) {
                    this.timeControl.setStep(slider.getValue());
                }
            }
        });

        this.playButton = new Portal.visualise.animations.AnimationPlayButton({
            padding : 5,
            plain : true,
            disabled : false, // readonly
            iconCls : 'playButton',
            listeners : {
                scope : this,
                'click' : this._togglePlay
            },
            tooltip : OpenLayers.i18n('play')
        });

        this.stepLabel = new Ext.form.Label({
            flex : 1,
            width : 115,
            style : 'padding-top: 5; padding-bottom: 5'
        });

        this.speedLabel = new Portal.visualise.animations.AnimationSpeedLabel({
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
            iconCls : 'downloadButton',
            text : 'download',
            listeners : {
                scope : this,
                click: function() {
                    this.selectedLayer.downloadAsGif({
                        spatialExtent: this.map.getExtent(),
                        temporalExtent: {
                            min: this.timeControl.getExtentMin(),
                            max: this.timeControl.getExtentMax()
                        }
                    });
                }
            }
        });

        this.items = [
            {
                xtype : 'container',
                defaultMargins : "15 5 20 5",
                layout : {
                    type : 'hbox',
                    pack : 'start'

                },
                items : [this.buttonsPanel, this.stepSlider,
                         this.speedLabel, this.stepLabel]
            },
            this.dateTimeSelectorPanel,
            this.getAnimationButton
        ];

        this.mapPanel = undefined;

        this.timerId = -1;
        this.stateBasedControls = [
            this.playButton,
            this.stepSlider,
            this.speedUp,
            this.slowDown,
            this.speedLabel,
            this.dateTimeSelectorPanel
        ];

//        this.state = new Portal.visualise.animations.AnimationState({
//            observers: [
//                { fn: this.dateTimeSelectorPanel.updateForState, scope: this.dateTimeSelectorPanel }
//            ]
//        });
        this.state = new Portal.visualise.animations.AnimationState({});
        this.state.setRemoved();

        Portal.details.AnimationControlsPanel.superclass.initComponent.call(this);
    },

    setMap : function(theMap) {

        // TODO: ok, there's now a dependency on the OpenLayers Map (instead of MapPanel),
        // but hopefully this will vanish when animation is refactored.
        this.map = theMap;
        this.map.events.register('timechanged', this, this._onTimeChanged);
    },

    _onBeforeSelectedLayerChanged: function(subject, openLayer) {

        if (this.selectedLayer) {
            this.selectedLayer.events.un({
                'precachestart': this._onSelectedLayerPrecacheStart,
                'precacheprogress': this._onSelectedLayerPrecacheProgress,
                'precacheend': this._onSelectedLayerPrecacheEnd,
                scope: this
            });
        }

        if (openLayer && openLayer.isAnimatable()) {
            this.selectedLayer = openLayer;
            this.stepSlider.setMinValue(0);
            this.stepSlider.setMaxValue(0);
            this.selectedLayer.events.on({
                'precachestart': this._onSelectedLayerPrecacheStart,
                'precacheprogress': this._onSelectedLayerPrecacheProgress,
                'precacheend': this._onSelectedLayerPrecacheEnd,
                scope: this
            });
        }
    },

    isPlaying: function() {
        return (this.currentState == this.state.PLAYING);
    },

    _onSelectedLayerPrecacheStart: function() {
        this.disable();

        if (this.isPlaying()) {
            this._stopPlaying();
            this.pausedWhilePrecaching = true;
        }
    },

    _onSelectedLayerPrecacheProgress: function(evt) {
        this._setStepLabelText('Loading...' + Math.floor(evt.progress * 100) + '%');
    },

    _onSelectedLayerPrecacheEnd: function() {
        this.stepSlider.setMinValue(0);
        this.stepSlider.setMaxValue(this.timeControl.getExtent().length - 1);

        this.dateTimeSelectorPanel.setMissingDays(this.selectedLayer.getMissingDays());
        var dateTime = this.timeControl.getDateTimeForStep(this.stepSlider.getValue());
        this._setStepLabelTextToDateTime(dateTime);

        this.enable();

        if (this.pausedWhilePrecaching) {
            this.pausedWhilePrecaching = undefined;
            this._startPlaying();
        }
    },

    _onSpeedChanged: function() {
        this._updateSpeedLabel();
        this._updateSpeedUpSlowDownButtons();
    },

    _onTemporalExtentChanged: function() {
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

    _togglePlay : function() {
        if (this.isPlaying()) {
            this._stopPlaying();
        } else {
            this._startPlaying();
        }
    },

    _stopPlaying : function() {
        this.timeControl.stop();
        this.state.setPaused();
        this._updateButtons();
    },

    _startPlaying : function() {
        this.state.setPlaying();
        this._updateButtons();
        this.timeControl.play();
    },

    _onTimeChanged: function(dateTime) {
        this.stepSlider.setValue(this.timeControl.getStep());
        this._setStepLabelTextToDateTime(dateTime);
    },

    _updateButtons : function() {
        Ext.each(this.stateBasedControls, function(control, index, all) {
            control.updateForState(this.state);
        }, this);
    },

    isAnimating : function() {
        // TODO: this is most likely dodgy.
        // Need to check when and how this function is called.
        return false;
    },

    _setStepLabelTextToDateTime: function(dateTime) {
        this._setStepLabelText(dateTime.format('YYYY-MM-DD HH:mm:ss'));
    },

    _setStepLabelText : function(text) {
        this.stepLabel.setText(text, false);
    }
});

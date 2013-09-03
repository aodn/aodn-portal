
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.AnimationControlsPanel", function() {

    var animationControlsPanel;
    var openLayer;
    var ncWmsLayer;
    var timeControl;

    beforeEach(function() {

        timeControl = new OpenLayers.Control.Time();
        timeControl.onTick = function() {};
        timeControl.getExtent = function() {
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        };
        timeControl.getDateTimeForStep = function() {
            return moment('2014-04-03T02:11:32');
        };

        animationControlsPanel = new Portal.details.AnimationControlsPanel({
            timeControl: timeControl
        });

        openLayer = new OpenLayers.Layer.WMS(
            "the title",
            "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {},
            { isBaseLayer: false }
        );

        temporalExtent = [
            moment('2012-04-01T12:00:00'),
            moment('2012-04-01T13:00:00'),
            moment('2012-04-01T14:00:00')
        ];

        ncWmsLayer = new OpenLayers.Layer.NcWMS(
            'some NcWMS layer',
            'http://some.url',
            {},
            {},
            temporalExtent
        );
        // Mock temporalExtent in map class
        ncWmsLayer.temporalExtent = temporalExtent;
        ncWmsLayer.dimensions = [{
            'name': 'time',
            'extent': temporalExtent
        }];
        ncWmsLayer.getDatesOnDay = function() { return [moment(0)]; };

        animationControlsPanel.selectedLayer = ncWmsLayer;
        timeControl.configureForLayer(ncWmsLayer, 10);
    });

    afterEach(function() {
        Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, null);
        Ext.MsgBus.unsubscribe(
            PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, animationControlsPanel._onBeforeSelectedLayerChanged, animationControlsPanel);
    });

    describe('initialisation', function() {
        it('dateTimeSelectorPanel', function() {
            expect(animationControlsPanel.dateTimeSelectorPanel).toBeInstanceOf(
                Portal.details.AnimationDateTimeSelectorPanel);
            expect(animationControlsPanel.dateTimeSelectorPanel.width).toBe(350);
            expect(animationControlsPanel.dateTimeSelectorPanel.parentAnimationControl).toBe(animationControlsPanel);
        });
    });

    describe('time control', function() {

        var animatedLayers;

        beforeEach(function() {
            // mock out unrelated functions.
            animationControlsPanel._getFormDates = function() { return [{}, {}] };
            animationControlsPanel._waitForOriginalLayer = function() {};
            animationControlsPanel._updateButtons = function() {};

            // Save the original value (and restore later), otherwise it breaks others tests
            // (TODO: which it shouldn't).
            animatedLayers = animationControlsPanel.animatedLayers;
            animationControlsPanel.animatedLayers = [{
                params: { "TIME": {} }
            }];
        });

        afterEach(function() {
            animationControlsPanel.animatedLayers = animatedLayers;
        });

        it('initialisation', function() {
            expect(animationControlsPanel.timeControl).toBe(timeControl);
            expect(animationControlsPanel.speedLabel.text).toBe('1x');
        });

        describe('on selectedLayerChanged', function() {

            var temporalExtent;

            it('slider updated', function() {
                Ext.MsgBus.publish('selectedLayerChanged', ncWmsLayer);
                expect(animationControlsPanel.stepSlider.minValue).toBe(0);
                expect(animationControlsPanel.stepSlider.maxValue).toBe(9);
            });

            it('selectedLayer updated', function() {
                Ext.MsgBus.publish('selectedLayerChanged', ncWmsLayer);
                expect(animationControlsPanel.selectedLayer).toBe(ncWmsLayer);
            });
        });
    });

    describe('timechanged event handling', function() {

        var map;

        beforeEach(function() {
            map = new OpenLayers.TemporalMap('map');
            animationControlsPanel.setMap(map);
        });

        it('onTimeChanged callback', function() {
            spyOn(animationControlsPanel, '_onTimeChanged');

            // TODO: investigate why this has to be called again (otherwise
            // the above spy doesn't seem to have any effect).
            animationControlsPanel.setMap(map);

            var dateTime = moment();
            map.toTime(dateTime);

            expect(animationControlsPanel._onTimeChanged).toHaveBeenCalledWith(dateTime);
        });

        it('slider updated on timeChanged', function() {
            timeControl.getStep = function() {
                return 5;
            };

            expect(animationControlsPanel.stepSlider.getValue()).not.toBe(5);
            map.toTime(moment());
            expect(animationControlsPanel.stepSlider.getValue()).toBe(5);
        });

        it('step label updated on timeChanged', function() {
            spyOn(animationControlsPanel, '_setStepLabelText');
            map.toTime(moment('2012-03-04T05:06:07'));

            expect(animationControlsPanel._setStepLabelText).toHaveBeenCalledWith('2012-03-04 05:06:07');
        });
    });

    describe('UI controls', function() {
        var map;

        beforeEach(function() {
            map = new OpenLayers.TemporalMap('map');

            animationControlsPanel.setMap(map);
            animationControlsPanel.timeControl.map = map;
            animationControlsPanel.timeControl.configureForLayer(ncWmsLayer);
        });

        describe('calls in to time control', function() {
            it('on play, time.play is called', function() {
                spyOn(timeControl, 'play');
                animationControlsPanel.playButton.fireEvent('click');
                expect(timeControl.play).toHaveBeenCalled();
            });

            it('on play, dateTimeSelectorPanel is disabled', function() {
                spyOn(animationControlsPanel.dateTimeSelectorPanel, 'disable');
                animationControlsPanel.playButton.fireEvent('click');
                expect(animationControlsPanel.dateTimeSelectorPanel.disable).toHaveBeenCalled();

            });

            it('on stop, time.stop is called', function() {
                animationControlsPanel.currentState = animationControlsPanel.state.PLAYING;
                animationControlsPanel.counter = 0;

                spyOn(timeControl, 'stop');

                animationControlsPanel.playButton.fireEvent('click');
                expect(timeControl.stop).toHaveBeenCalled();
            });

            it('on stop, dateTimeSelectorPanel is enabled', function() {
                animationControlsPanel.currentState = animationControlsPanel.state.PLAYING;
                spyOn(animationControlsPanel.dateTimeSelectorPanel, 'enable');

                animationControlsPanel.playButton.fireEvent('click');
                expect(animationControlsPanel.dateTimeSelectorPanel.enable).toHaveBeenCalled();
            });

            it('on speed up, time.speedUp is called', function() {
                spyOn(timeControl, 'speedUp');
                animationControlsPanel.speedUp.fireEvent('click');
                expect(timeControl.speedUp).toHaveBeenCalled();
            });

            it('on slow down, time.slowDown is called', function() {
                spyOn(timeControl, 'slowDown');
                animationControlsPanel.slowDown.fireEvent('click');
                expect(timeControl.slowDown).toHaveBeenCalled();
            });

            it('slider drag updates time control', function() {
                spyOn(timeControl, 'setStep');
                animationControlsPanel.stepSlider.setValue(3);

                animationControlsPanel.stepSlider.fireEvent('drag', animationControlsPanel.stepSlider);
                expect(timeControl.setStep).toHaveBeenCalledWith(3);
            });
        });

        describe('event listeners', function() {


            // We have to do some ugly stuff here, namely spying on the prototype function, since
            // spying on the instance function doesn't seem to work, for some reason.

            var origOnSpeedChanged;
            var localAnimationControlsPanel;

            beforeEach(function() {
                origOnSpeedChanged = Portal.details.AnimationControlsPanel._onSpeedChanged;
                spyOn(Portal.details.AnimationControlsPanel.prototype, '_onSpeedChanged').andCallThrough();

                localAnimationControlsPanel = new Portal.details.AnimationControlsPanel({
                    timeControl: timeControl
                });
            });

            afterEach(function() {
                Portal.details.AnimationControlsPanel._onSpeedChanged = origOnSpeedChanged;
                afterEach(function() {
                    Ext.MsgBus.unsubscribe(
                        'selectedLayerChanged',
                        localAnimationControlsPanel._onBeforeSelectedLayerChanged,
                        localAnimationControlsPanel);
                });
            });

            it('on speed up, _onSpeedChanged called', function() {
                localAnimationControlsPanel.speedUp.fireEvent('click');
                expect(localAnimationControlsPanel._onSpeedChanged).toHaveBeenCalled();
            });

            it('on slow down, _onSpeedChanged called', function() {
                localAnimationControlsPanel.slowDown.fireEvent('click');
                expect(localAnimationControlsPanel._onSpeedChanged).toHaveBeenCalled();
            });

            it('slider drag results in timechangedevent', function() {
                spyOn(animationControlsPanel, '_onTimeChanged');
                animationControlsPanel.setMap(map);  // TODO: why is this necessary - see above?

                animationControlsPanel.stepSlider.fireEvent('drag', animationControlsPanel.stepSlider);
                expect(animationControlsPanel._onTimeChanged).toHaveBeenCalled();
            });

            it('speed label and slow/speed buttons updated on speedchanged', function() {
                spyOn(localAnimationControlsPanel, '_updateSpeedLabel');
                spyOn(localAnimationControlsPanel, '_updateSpeedUpSlowDownButtons');
                localAnimationControlsPanel._onSpeedChanged();
                expect(localAnimationControlsPanel._updateSpeedLabel).toHaveBeenCalled();
                expect(localAnimationControlsPanel._updateSpeedUpSlowDownButtons).toHaveBeenCalled();
            });
        });

        describe('UI state', function() {
            var extentEvent;

            beforeEach(function() {
                timeControl.getExtent = function() {
                    return [0, 1, 2];
                };

                extentEvent = {
                    layer: {
                        min: moment('2008-01-01T12:34:56'),
                        max: moment('2010-01-01T12:34:56')
                    },
                    timer: {
                        min: moment('2009-01-01T12:34:56'),
                        max: moment('2010-01-01T12:34:56')
                    }
                };
            });

            it('speed label on speed up', function() {
                animationControlsPanel.speedUp.fireEvent('click');
                expect(animationControlsPanel.speedLabel.text).toBe('2x');
                animationControlsPanel.speedUp.fireEvent('click');
                expect(animationControlsPanel.speedLabel.text).toBe('4x');
            });

            it('speed up button disabled', function() {
                animationControlsPanel.timeControl.relativeSpeed = 16;
                expect(animationControlsPanel.speedUp.disabled).toBeFalsy();

                animationControlsPanel.speedUp.fireEvent('click'); // 32
                expect(animationControlsPanel.speedUp.disabled).toBeTruthy();

                animationControlsPanel.slowDown.fireEvent('click'); // 16
                expect(animationControlsPanel.speedUp.disabled).toBeFalsy();
            });

            it('slow down label on slow down', function() {
                animationControlsPanel.slowDown.fireEvent('click');
                expect(animationControlsPanel.speedLabel.text).toBe('0.5x');
                animationControlsPanel.slowDown.fireEvent('click');
                expect(animationControlsPanel.speedLabel.text).toBe('0.25x');
            });

            it('slow down button disabled', function() {
                animationControlsPanel.timeControl.relativeSpeed = 1/16;
                expect(animationControlsPanel.slowDown.disabled).toBeFalsy();

                animationControlsPanel.slowDown.fireEvent('click'); // 1/32
                expect(animationControlsPanel.slowDown.disabled).toBeTruthy();

                animationControlsPanel.speedUp.fireEvent('click'); // 1/16
                expect(animationControlsPanel.slowDown.disabled).toBeFalsy();
            });

            it('step slider updated on temporal extent changed event', function() {
                spyOn(animationControlsPanel.stepSlider, 'setMinValue');
                spyOn(animationControlsPanel.stepSlider, 'setMaxValue');

                timeControl.events.triggerEvent('temporalextentchanged', extentEvent);

                expect(animationControlsPanel.stepSlider.setMinValue).toHaveBeenCalledWith(0);
                expect(animationControlsPanel.stepSlider.setMaxValue).toHaveBeenCalledWith(2);
            });

            it('step label updated with slider time when loading finished', function() {
                spyOn(animationControlsPanel, '_setStepLabelText');
                var dateTime = moment('2011-11-11T11:11:11');
                animationControlsPanel.timeControl.getDateTimeForStep = function() {
                    return dateTime;
                };
                animationControlsPanel._onSelectedLayerPrecacheEnd();
                expect(animationControlsPanel._setStepLabelText).toHaveBeenCalledWith(
                    dateTime.format('YYYY-MM-DD HH:mm:ss'))
            });
        });
    });

    describe('layer progress', function() {

        beforeEach(function() {
            spyOn(animationControlsPanel, '_onSelectedLayerPrecacheStart').andCallThrough();
            spyOn(animationControlsPanel, '_onSelectedLayerPrecacheProgress').andCallThrough();
            spyOn(animationControlsPanel, '_onSelectedLayerPrecacheEnd').andCallThrough();

            Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, ncWmsLayer);

            ncWmsLayer.events.triggerEvent('precacheprogress', {
                layer: ncWmsLayer,
                progress: 0.12
            });
        });

        it('register listener', function() {
            expect(animationControlsPanel._onSelectedLayerPrecacheProgress).toHaveBeenCalled();
        });

        it('listener unregistered when layer changes', function() {
            expect(animationControlsPanel._onSelectedLayerPrecacheProgress.callCount).toBe(1);

            var newLayer = new OpenLayers.Layer.NcWMS();
            // Mock temporalExtent
            newLayer.temporalExtent = [ moment() ];

            Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, newLayer);
            ncWmsLayer.events.triggerEvent('precacheprogress', {
                layer: ncWmsLayer,
                progress: 0.8
            });
            expect(animationControlsPanel._onSelectedLayerPrecacheProgress.callCount).toBe(1);
        });

        it('listener called with correct value', function() {
            expect(animationControlsPanel._onSelectedLayerPrecacheProgress.calls[0].args[0].layer).toBe(ncWmsLayer);
            expect(animationControlsPanel._onSelectedLayerPrecacheProgress.calls[0].args[0].progress).toBe(0.12);
        });

        it('step label updated with loading value', function() {
            spyOn(animationControlsPanel, '_setStepLabelText');

            ncWmsLayer.events.triggerEvent('precacheprogress', {
                layer: ncWmsLayer,
                progress: 0
            });
            expect(animationControlsPanel._setStepLabelText.calls[0].args[0]).toBe('Loading...0%');

            ncWmsLayer.events.triggerEvent('precacheprogress', {
                layer: ncWmsLayer,
                progress: 0.12
            });
            expect(animationControlsPanel._setStepLabelText.calls[1].args[0]).toBe('Loading...12%');

            ncWmsLayer.events.triggerEvent('precacheprogress', {
                layer: ncWmsLayer,
                progress: 0.123
            });
            expect(animationControlsPanel._setStepLabelText.calls[2].args[0]).toBe('Loading...12%');
        });

        describe('onprecacheend', function() {

            it('onSelectedLayerPrecacheEnd called', function() {
                ncWmsLayer.events.triggerEvent('precacheend');
                expect(animationControlsPanel._onSelectedLayerPrecacheEnd).toHaveBeenCalled();
            });

            it('onSelectedLayerPrecacheEnd unregistered when layer changes', function() {
                expect(animationControlsPanel._onSelectedLayerPrecacheEnd).not.toHaveBeenCalled();

                var newLayer = new OpenLayers.Layer.NcWMS();
                // Mock temporalExtent
                newLayer.temporalExtent = [ moment() ];
                timeControl.configureForLayer(newLayer, 10);
                Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, newLayer);
                ncWmsLayer.events.triggerEvent('precacheend');
                expect(animationControlsPanel._onSelectedLayerPrecacheEnd).not.toHaveBeenCalled();
            });
        });

        describe('onprecachestart', function() {

            it('onSelectedLayerPrecacheStart called', function() {
                ncWmsLayer.events.triggerEvent('precachestart');
                expect(animationControlsPanel._onSelectedLayerPrecacheStart).toHaveBeenCalled();
            });

            it('onSelectedLayerPrecacheStart unregistered when layer changes', function() {
                expect(animationControlsPanel._onSelectedLayerPrecacheStart).not.toHaveBeenCalled();

                var newLayer = new OpenLayers.Layer.NcWMS();
                // Mock temporalExtent
                newLayer.temporalExtent = [ moment() ];
                Ext.MsgBus.publish(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, newLayer);
                ncWmsLayer.events.triggerEvent('precachestart');
                expect(animationControlsPanel._onSelectedLayerPrecacheStart).not.toHaveBeenCalled();
            });
        });

        describe('enable/disable as appropriate', function() {
            it('controls disabled on precachestart', function() {
                spyOn(animationControlsPanel, 'disable');

                ncWmsLayer.events.triggerEvent('precachestart');
                expect(animationControlsPanel.disable).toHaveBeenCalled();
            });

            it('controls enabled on precacheend', function() {
                spyOn(animationControlsPanel, 'enable');

                ncWmsLayer.events.triggerEvent('precacheend');
                expect(animationControlsPanel.enable).toHaveBeenCalled();
            });
        });

        describe('temporarily pause while precaching', function() {

            beforeEach(function() {
                spyOn(animationControlsPanel, '_stopPlaying');
                spyOn(animationControlsPanel, '_startPlaying');
            });

            it('pause on precache start if playing', function() {
                animationControlsPanel.currentState = animationControlsPanel.state.PLAYING;

                ncWmsLayer.events.triggerEvent('precachestart');
                expect(animationControlsPanel._stopPlaying).toHaveBeenCalled();
                expect(animationControlsPanel.pausedWhilePrecaching).toBeTruthy();
            });

            it('don\'t pause on precache start if not playing', function() {
                animationControlsPanel.currentState = animationControlsPanel.state.PAUSED;

                ncWmsLayer.events.triggerEvent('precachestart');
                expect(animationControlsPanel._stopPlaying).not.toHaveBeenCalled();
                expect(animationControlsPanel.pausedWhilePrecaching).toBeFalsy();
            });

            it('start on precache end if paused while caching', function() {
                animationControlsPanel.pausedWhilePrecaching = true;

                ncWmsLayer.events.triggerEvent('precacheend');
                expect(animationControlsPanel._startPlaying).toHaveBeenCalled();
                expect(animationControlsPanel.pausedWhilePrecaching).toBeFalsy();
            });

            it('don\'t start on precache end if not paused while caching', function() {
                animationControlsPanel.pausedWhilePrecaching = undefined;

                ncWmsLayer.events.triggerEvent('precacheend');
                expect(animationControlsPanel._startPlaying).not.toHaveBeenCalled();
                expect(animationControlsPanel.pausedWhilePrecaching).toBeFalsy();
            });
        });
    });

    describe('getAnimationButton', function() {

        it('is not hidden', function() {
            expect(animationControlsPanel.getAnimationButton.hidden).toBeFalsy();
        });

        it('on click', function() {
            spyOn(ncWmsLayer, 'downloadAsGif');

            var theSpatialExent = {};
            var theMinTemporalExtent = moment('2000');
            var theMaxTemporalExtent = moment('2010');

            animationControlsPanel.map = {
                getExtent: function() {
                    return theSpatialExent;
                }
            };
            animationControlsPanel.timeControl.getExtentMin = function() {
                return theMinTemporalExtent;
            };
            animationControlsPanel.timeControl.getExtentMax = function() {
                return theMaxTemporalExtent;
            };
            animationControlsPanel.getAnimationButton.fireEvent('click');
            expect(ncWmsLayer.downloadAsGif).toHaveBeenCalled();
            expect(ncWmsLayer.downloadAsGif.calls[0].args[0].spatialExtent).toBe(theSpatialExent);
            expect(ncWmsLayer.downloadAsGif.calls[0].args[0].temporalExtent.min).toBe(theMinTemporalExtent);
            expect(ncWmsLayer.downloadAsGif.calls[0].args[0].temporalExtent.max).toBe(theMaxTemporalExtent);
        });
    });

    // TODO: load from saved map - shouldn't need any special handling?
});

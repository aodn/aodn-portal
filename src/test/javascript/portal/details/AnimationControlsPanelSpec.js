
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

        animationControlsPanel = new Portal.details.AnimationControlsPanel({
            timeControl: timeControl
        });

        openLayer = new OpenLayers.Layer.WMS(
            "the title",
            "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {},
            { isBaseLayer: false }
        );
        
        temporalExtent = '2012-04-01T12:00:00,2012-04-01T13:00:00,2012-04-01T14:00:00';
        ncWmsLayer = new OpenLayers.Layer.NcWMS(
            'some NcWMS layer',
            'http://some.url',
            {},
            {},
            temporalExtent
        );
        ncWmsLayer.dimensions = [{
            'name': 'time',
            'extent': temporalExtent
        }];
        ncWmsLayer.getDatesOnDay = function() { return []; }

        animationControlsPanel.selectedLayer = ncWmsLayer;
    });

    describe('initialisation', function() {
        it('dateTimeSelectorPanel', function() {
            expect(animationControlsPanel.dateTimeSelectorPanel).toBeInstanceOf(
                Portal.details.AnimationDateTimeSelectorPanel);
            expect(animationControlsPanel.dateTimeSelectorPanel.width).toBe(350);
            expect(animationControlsPanel.dateTimeSelectorPanel.parent).toBe(animationControlsPanel);
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
            
            it('configureForLayer is not called for WMS layer', function() {
                spyOn(timeControl, 'configureForLayer');
                Ext.MsgBus.publish('selectedLayerChanged', openLayer);
                expect(timeControl.configureForLayer).not.toHaveBeenCalled();
            });
            
            it('configureForLayer is called for NcWMS layer', function() {
                spyOn(timeControl, 'configureForLayer');
                Ext.MsgBus.publish('selectedLayerChanged', ncWmsLayer);
                expect(timeControl.configureForLayer).toHaveBeenCalledWith(ncWmsLayer, 10);
            });

            it('slider updated', function() {
                Ext.MsgBus.publish('selectedLayerChanged', ncWmsLayer);
                expect(animationControlsPanel.stepSlider.minValue).toBe(0);
                expect(animationControlsPanel.stepSlider.maxValue).toBe(2);
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
            }

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

            /**
             * We have to do some ugly stuff here, namely spying on the prototype function, since
             * spying on the instance function doesn't seem to work, for some reason.
             */
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
        });
    });
    
    // TODO: reimplement "loading..." in label?
    describe('calendar options', function() {
        // TODO
    });

    // TODO: reset/remove layer/add new layer

    // TODO: load from saved map - shouldn't need any special handling?
});

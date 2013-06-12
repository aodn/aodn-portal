
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

    describe("_getNewTimeValue", function() {
		it("select default if old time doesn't exist", function() {
			var oldTime = "13:25:00 (+10:00)";

			var newTimes = new Array();

			newTimes[0] = "10:18:00 (+10:00)";
			newTimes[1] = "11:18:00 (+10:00)";
			newTimes[3] = "12:18:00 (+10:00)";
			newTimes[4] = "13:18:00 (+10:00)";
			newTimes[5] = "14:18:00 (+10:00)";
			newTimes[6] = "15:18:00 (+10:00)";
			newTimes[7] = "16:18:00 (+10:00)";

			var newTime = animationControlsPanel._getNewTimeValue(oldTime,newTimes,5);

			expect(newTime).toBe("14:18:00 (+10:00)");

		});
	});
/*
	describe("_onDateSelected", function() {

		it("should, if there is only one time available, select it", function() {
			var startDatePicker = new Ext.form.DateField({
				format : 'd-m-Y',
				value : '06-06-2007'
			});
			animationControlsPanel.startDatePicker = startDatePicker;

			var allTimes = new Array();
			allTimes['2006-06-06'] = new Array();

			allTimes['2006-06-06'][0] = new Array();
			allTimes['2006-06-06'][0][0]="13:18:00 (+10:00)";
			allTimes['2006-06-06'][0][1]="13:20:00 (+10:00)";

			animationControlsPanel.allTimes =allTimes;

			animationControlsPanel._onDateSelected(startDatePicker, Date.parseDate("06-06-2006", 'd-m-Y'));
			expect(animationControlsPanel.startTimeCombo.value).toBe("13:18:00 (+10:00)");
		});

		it("selects earliest possible time if the previously selected time is not available", function() {
			var startDatePicker = new Ext.form.DateField({
				format : 'd-m-Y',
				value : '06-06-2007'
			});
			animationControlsPanel.startDatePicker = startDatePicker;

			var allTimes = new Array();
			allTimes['2006-06-06'] = new Array();

			allTimes['2006-06-06'][0] = new Array();
			allTimes['2006-06-06'][0][0]="13:18:00 (+10:00)";
			allTimes['2006-06-06'][0][1]="13:20:00 (+10:00)";

			allTimes['2006-06-06'][1]= new Array();
			allTimes['2006-06-06'][1][0]="14:18:00 (+10:00)";
			allTimes['2006-06-06'][1][1]="14:20:00 (+10:00)";

			allTimes['2006-06-06'][2]= new Array();
			allTimes['2006-06-06'][2][0]="15:18:00 (+10:00)";
			allTimes['2006-06-06'][2][1]="15:20:00 (+10:00)";

			animationControlsPanel.allTimes =allTimes;
			animationControlsPanel.startTimeCombo.setValue("19:19:00 (+10:00)")

			animationControlsPanel._onDateSelected(startDatePicker, Date.parseDate("06-06-2006", 'd-m-Y'));
			expect(animationControlsPanel.startTimeCombo.value).toBe("13:18:00 (+10:00)");
		});

		it("selects previously selected time if it is available", function() {
			var startDatePicker = new Ext.form.DateField({
				format : 'd-m-Y',
				value : '06-06-2007'
			});
			animationControlsPanel.startDatePicker = startDatePicker;

			var allTimes = new Array();

			allTimes['2007-06-06'] = new Array();

			allTimes['2007-06-06'][0] = new Array();
			allTimes['2007-06-06'][0][0]="14:18:00 (+10:00)";
			allTimes['2007-06-06'][0][1]="14:20:00 (+10:00)";

			allTimes['2006-06-06'] = new Array();

			allTimes['2006-06-06'][0] = new Array();
			allTimes['2006-06-06'][0][0]="13:18:00 (+10:00)";
			allTimes['2006-06-06'][0][1]="13:20:00 (+10:00)";

			allTimes['2006-06-06'][1]= new Array();
			allTimes['2006-06-06'][1][0]="14:18:00 (+10:00)";
			allTimes['2006-06-06'][1][1]="14:20:00 (+10:00)";

			allTimes['2006-06-06'][2]= new Array();
			allTimes['2006-06-06'][2][0]="15:18:00 (+10:00)";
			allTimes['2006-06-06'][2][1]="15:20:00 (+10:00)";

			animationControlsPanel.allTimes =allTimes;
			animationControlsPanel.startTimeCombo.setValue("14:18:00 (+10:00)");

			animationControlsPanel._onDateSelected(startDatePicker, Date.parseDate("06-06-2006", 'd-m-Y'));
			expect(animationControlsPanel.startTimeCombo.value).toBe("14:18:00 (+10:00)");
		});
	});
*/
    // Post refactor tests... ones above can probably be deleted when refactor is complete.
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
            
            it('on stop, time.stop is called', function() {
                animationControlsPanel.currentState = animationControlsPanel.state.PLAYING;
                animationControlsPanel.counter = 0;
                
                spyOn(timeControl, 'stop');

                animationControlsPanel.playButton.fireEvent('click');
                expect(timeControl.stop).toHaveBeenCalled();
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

            it('startTimeCombo initialisation', function() {
                expect(animationControlsPanel.startTimeCombo.store).toBeInstanceOf(Ext.data.ArrayStore);
                expect(animationControlsPanel.startTimeCombo.mode).toBe('local');
                expect(animationControlsPanel.startTimeCombo.editable).toBeFalsy();
                expect(animationControlsPanel.startTimeCombo.valueField).toBe('momentValue');
                expect(animationControlsPanel.startTimeCombo.displayField).toBe('displayTime');
            });

            it('endTimeCombo initialisation', function() {
                expect(animationControlsPanel.endTimeCombo.store).toBeInstanceOf(Ext.data.ArrayStore);
                expect(animationControlsPanel.endTimeCombo.mode).toBe('local');
                expect(animationControlsPanel.endTimeCombo.editable).toBeFalsy();
                expect(animationControlsPanel.endTimeCombo.valueField).toBe('momentValue');
                expect(animationControlsPanel.endTimeCombo.displayField).toBe('displayTime');
            });
        });

        describe('event listeners', function() {

            /**
             * We have to do some ugly stuff here, namely spying on the prototype function, since
             * spying on the instance function doesn't seem to work, for some reason.
             */
            var origOnSpeedChanged;
            var origOnTemporalExtentChanged;
            var localAnimationControlsPanel;

            beforeEach(function() {
                origOnSpeedChanged = Portal.details.AnimationControlsPanel._onSpeedChanged;
                origOnTemporalExtentChanged = Portal.details.AnimationControlsPanel._onTemporalExtentChanged;
                spyOn(Portal.details.AnimationControlsPanel.prototype, '_onSpeedChanged').andCallThrough();
                spyOn(Portal.details.AnimationControlsPanel.prototype, '_onTemporalExtentChanged');
                
                localAnimationControlsPanel = new Portal.details.AnimationControlsPanel({
                    timeControl: timeControl
                });
            });

            afterEach(function() {
                Portal.details.AnimationControlsPanel._onSpeedChanged = origOnSpeedChanged;
                Portal.details.AnimationControlsPanel._onTemporalExtentChanged = origOnTemporalExtentChanged;
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

            it('on temporal extent changed, _onTemporalExtentChanged called', function() {
                localAnimationControlsPanel.timeControl.configureForLayer(ncWmsLayer, 2);
                expect(localAnimationControlsPanel._onTemporalExtentChanged).toHaveBeenCalled();
                expect(localAnimationControlsPanel._onTemporalExtentChanged.calls[0].args[0].layer.min).toBeSame(
                    '2012-04-01T12:00:00');
                expect(localAnimationControlsPanel._onTemporalExtentChanged.calls[0].args[0].layer.max).toBeSame(
                    '2012-04-01T14:00:00');
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

            describe('picker values on temporal extent changed', function() {
                beforeEach(function() {
                    animationControlsPanel._onTemporalExtentChanged({
                        layer: {
                            min: moment('2008-01-01T12:34:56'),
                            max: moment('2010-01-01T12:34:56')
                        },
                        timer: {
                            min: moment('2009-01-01T12:34:56'),
                            max: moment('2010-01-01T12:34:56')
                        }
                    });
                });

                it('start date picker', function() {
                    expect(animationControlsPanel.startDatePicker.minValue).toBeSame('2008-01-01T12:34:56');
                    expect(animationControlsPanel.startDatePicker.maxValue).toBeSame('2010-01-01T12:34:56');
                    expect(animationControlsPanel.startDatePicker.getValue()).toBeSame('2009-01-01');
                });                
                
                it('end date picker', function() {
                    expect(animationControlsPanel.endDatePicker.minValue).toBeSame('2008-01-01T12:34:56');
                    expect(animationControlsPanel.endDatePicker.maxValue).toBeSame('2010-01-01T12:34:56');
                    expect(animationControlsPanel.endDatePicker.getValue()).toBeSame('2010-01-01');
                });
            });

            describe('time pickers updated on date picker change', function() {

                var extentEvent = {
                    layer: {
                        min: moment('2008-01-01T12:34:56'),
                        max: moment('2010-01-01T12:34:56')
                    },
                    timer: {
                        min: moment('2009-01-01T12:34:56'),
                        max: moment('2010-01-01T12:34:56')
                    }
                };
                
                it('start time picker updated on temporal extent change', function() {
                    spyOn(animationControlsPanel, '_updateStartTimeCombo');

                    animationControlsPanel._onTemporalExtentChanged(extentEvent);
                    expect(animationControlsPanel._updateStartTimeCombo.calls[0].args[0]).toBeSame('2009-01-01T12:34:56');
                });

                it('start time picker updated', function() {

                    spyOn(animationControlsPanel, '_updateStartTimeCombo');

                    animationControlsPanel.startDatePicker.fireEvent(
                        'select',
                        animationControlsPanel.startDatePicker,
                        moment('2001-01-01').toDate());
                    expect(animationControlsPanel._updateStartTimeCombo.calls[0].args[0]).toBeSame('2001-01-01');
                });

                it('updateStartTimeCombo', function() {
                    animationControlsPanel.selectedLayer = {
                        getDatesOnDay: function() {

                            return [
                                moment('2001-01-01T05:00'),
                                moment('2001-01-01T15:00')
                            ];
                        }
                    };

                    spyOn(animationControlsPanel.startTimeCombo.store, 'loadData').andCallThrough();
                    
                    animationControlsPanel._updateStartTimeCombo(moment('2001-01-01T05:00'));
                    
                    var addData = animationControlsPanel.startTimeCombo.store.loadData.calls[0].args[0];
                    expect(addData[0][0]).toBeSame('2001-01-01T05:00');
                    expect(addData[0][1]).toBe('05:00:00 (+11:00)');
                    expect(addData[1][0]).toBeSame('2001-01-01T15:00');
                    expect(animationControlsPanel.startTimeCombo.getValue()).toBe('05:00:00 (+11:00)');
                });

                it('end time picker updated on temporal extent change', function() {
                    spyOn(animationControlsPanel, '_updateEndTimeCombo');

                    animationControlsPanel._onTemporalExtentChanged(extentEvent);
                    expect(animationControlsPanel._updateEndTimeCombo.calls[0].args[0]).toBeSame('2010-01-01T12:34:56');
                });

                it('end time picker updated', function() {
                    spyOn(animationControlsPanel, '_updateEndTimeCombo');

                    animationControlsPanel.endDatePicker.fireEvent(
                        'select',
                        animationControlsPanel.endDatePicker,
                        moment('2001-01-07').toDate());
                    expect(animationControlsPanel._updateEndTimeCombo.calls[0].args[0]).toBeSame('2001-01-07');
                });

                it('updateEndTimeCombo', function() {
                    animationControlsPanel.selectedLayer = {
                        getDatesOnDay: function() {
                            return [
                                moment('2001-01-01T05:00'),
                                moment('2001-01-01T15:00')
                            ];
                        }
                    };

                    spyOn(animationControlsPanel.endTimeCombo.store, 'loadData');
                    
                    animationControlsPanel._updateEndTimeCombo(moment('2001-01-01T05:00'));
                    
                    var addData = animationControlsPanel.endTimeCombo.store.loadData.calls[0].args[0];
                    expect(addData[0][0]).toBeSame('2001-01-01T05:00');
                    expect(addData[0][1]).toBe('05:00:00 (+11:00)');
                    expect(addData[1][0]).toBeSame('2001-01-01T15:00');
                });
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

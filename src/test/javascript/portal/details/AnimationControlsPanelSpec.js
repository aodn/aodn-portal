
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.AnimationControlsPanel", function() {

    var animationControlsPanel;
    var openLayer;
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
    });

    describe("speedUp button", function() {
        it("halves 'speed' and starts animation", function() {

            animationControlsPanel.speed = 10;
            spyOn(animationControlsPanel, '_startPlaying');
            animationControlsPanel.speedUp.fireEvent("click");
            expect(animationControlsPanel._startPlaying).toHaveBeenCalled();
            expect(animationControlsPanel.speed).toBe(5);

        });
    });

    describe("slowDown button", function() {
        it("doubles 'speed' and starts animation", function() {

            animationControlsPanel.speed = 10;
            spyOn(animationControlsPanel, '_startPlaying');
            animationControlsPanel.slowDown.fireEvent("click");
            expect(animationControlsPanel._startPlaying).toHaveBeenCalled();
            expect(animationControlsPanel.speed).toBe(20);

        });
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

	describe('layer messages', function() {
	    it('on removeAll', function() {

	        spyOn(animationControlsPanel, 'removeAnimation');

	        Ext.MsgBus.publish('removeAllLayers');

	        expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
	    });

        it('on removeLayer', function() {
            spyOn(animationControlsPanel, 'removeAnimation');
            spyOn(Portal.ui.AnimationPanel.prototype, 'setVisible');

            openLayer.isAnimated = true;

            Ext.MsgBus.publish('removeLayer', openLayer);

            expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
        });

        describe('on selectedLayerChanged', function() {

            beforeEach(function() {
                spyOn(animationControlsPanel, 'setSelectedLayer');
                spyOn(animationControlsPanel, 'update');
                spyOn(animationControlsPanel, 'removeAnimation');
                animationControlsPanel.isAnimating = function() { return false };
            });

            it('on selectedLayerChanged with openlayer, animatable', function() {

                openLayer.isAnimatable = function() { return true };

                Ext.MsgBus.publish('selectedLayerChanged', openLayer);

                expect(animationControlsPanel.setSelectedLayer).toHaveBeenCalledWith(openLayer);
                expect(animationControlsPanel.update).toHaveBeenCalled();
                expect(animationControlsPanel.removeAnimation).not.toHaveBeenCalled();
            });

            it('on selectedLayerChanged with openlayer, non animatable', function() {

                openLayer.isAnimatable = function() { return false };

                Ext.MsgBus.publish('selectedLayerChanged', openLayer);

                expect(animationControlsPanel.setSelectedLayer).not.toHaveBeenCalledWith();
                expect(animationControlsPanel.update).not.toHaveBeenCalled();
                expect(animationControlsPanel.removeAnimation).not.toHaveBeenCalled();
            });

            it('on selectedLayerChanged with undefined', function() {

                Ext.MsgBus.publish('selectedLayerChanged');

                expect(animationControlsPanel.setSelectedLayer).not.toHaveBeenCalled();
                expect(animationControlsPanel.update).not.toHaveBeenCalled();
                expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
            });
        });

        it('on reset map', function() {

            spyOn(animationControlsPanel, 'removeAnimation');

            Ext.MsgBus.publish('reset');

            expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
        });
    });

    describe('animatedLayer', function() {
        it("removes slide after parent layer is removed", function() {
            var map = new OpenLayers.Map('map');
            var layerStore = new Portal.data.LayerStore();
            layerStore.bind(map);
            map.addLayer(openLayer);

            animationControlsPanel.setMap(map);
            animationControlsPanel.setSelectedLayer(openLayer);

            animationControlsPanel._convertSelectedLayerToAnimatedLayer();

            var slide = new OpenLayers.Layer.WMS(
                "the title2",
                "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
                {},
                { isBaseLayer: false }
            );
            animationControlsPanel.originalLayer.addSlide(slide);

            spyOn(Ext.MsgBus, 'publish');

            openLayer._onLayerRemoved({layer:openLayer});


            expect(Ext.MsgBus.publish).toHaveBeenCalledWith("removeLayer", slide);
        });
    });

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
        });

        describe('on selectedLayerChanged', function() {

            var temporalExtent;
            var ncWmsLayer;

            beforeEach(function() {
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
            });
            
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
        });
            
        it('on play, time.play is called', function() {
            spyOn(timeControl, 'play');
            animationControlsPanel.playButton.fireEvent('click');
            expect(timeControl.play).toHaveBeenCalled();
        });
        
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
        // labels updated.
    });
/**
    describe('slider', function() {
       // slider.minValue;
        //slider.maxValue;
        // TODO
    });

    describe('labels', function() {
        // TODO
    });
    
    describe('calendar options', function() {
        // TODO
    });
*/
});

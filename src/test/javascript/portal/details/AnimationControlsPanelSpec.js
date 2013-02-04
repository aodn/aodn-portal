
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.AnimationControlsPanel", function() {

    var animationControlsPanel;
    var openLayer;

    beforeEach(function() {
        animationControlsPanel = new Portal.details.AnimationControlsPanel();
        openLayer = new OpenLayers.Layer.WMS(
                "the title",
                "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
                {},
                { isBaseLayer: false }
            );
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

	        spyOn(animationControlsPanel, 'isAnimating').andReturn(true);
	        spyOn(animationControlsPanel, 'removeAnimation');

	        Ext.MsgBus.publish('removeAllLayers');

	        expect(animationControlsPanel.isAnimating).toHaveBeenCalled();
	        expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
	    });

        it('on removeLayer', function() {

            var animationPanel = new Portal.ui.AnimationPanel(new OpenLayers.Map());

            spyOn(animationControlsPanel, 'removeAnimation');
            spyOn(Portal.ui.AnimationPanel.prototype, 'setVisible');

            openLayer.isAnimated = true;

            Ext.MsgBus.publish('removeLayer', openLayer);

            expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
            expect(Portal.ui.AnimationPanel.prototype.setVisible).toHaveBeenCalledWith(false);
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

            spyOn(animationControlsPanel, 'isAnimating').andReturn(true);
            spyOn(animationControlsPanel, 'removeAnimation');

            Ext.MsgBus.publish('reset');

            expect(animationControlsPanel.isAnimating).toHaveBeenCalled();
            expect(animationControlsPanel.removeAnimation).toHaveBeenCalled();
        });
	});
});

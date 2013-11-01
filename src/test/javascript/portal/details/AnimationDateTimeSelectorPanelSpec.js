/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.AnimationDateTimeSelectorPanel", function() {
    var dateTimePanel;
    var extentEvent;
    var timeControl;
    var parentAnimationControl;
    var selectedLayer;
    
    beforeEach(function() {
        timeControl = new OpenLayers.Control.Time();
        selectedLayer = {
            _precache: function() {}
        };
        parentAnimationControl = {
            selectedLayer: selectedLayer
        };
        
        dateTimePanel = new Portal.details.AnimationDateTimeSelectorPanel({
            timeControl: timeControl,
            parentAnimationControl: parentAnimationControl
        });
        
        extentEvent = {
            layer: {
                min: moment.utc('2008-01-01T12:34:56'),
                max: moment.utc('2010-01-01T12:34:56')
            },
            timer: {
                min: moment.utc('2009-01-01T12:34:56'),
                max: moment.utc('2010-01-01T12:34:56')
            }
        };
    });

    describe('initialisation', function() {
        it('layout', function() {
            expect(dateTimePanel.layout).toBe('table');
            expect(dateTimePanel.layoutConfig.columns).toBe(3);
        });

        it('timeControl', function() {
            expect(dateTimePanel.timeControl).toBe(timeControl);
        });

        it('items', function() {
            expect(dateTimePanel.items.get(0)).toBe(dateTimePanel.startLabel);
            expect(dateTimePanel.items.get(1)).toBe(dateTimePanel.startDatePicker);
            expect(dateTimePanel.items.get(2)).toBe(dateTimePanel.startTimeCombo);
            expect(dateTimePanel.items.get(3)).toBe(dateTimePanel.endLabel);
            expect(dateTimePanel.items.get(4)).toBe(dateTimePanel.endDatePicker);
            expect(dateTimePanel.items.get(5)).toBe(dateTimePanel.endTimeCombo);
        });

        it('start date picker', function() {
            expect(dateTimePanel.getStartDatePicker()).toBeTruthy();
            expect(dateTimePanel.getStartDatePicker().format).toBe(dateTimePanel.DATE_FORMAT);
            expect(dateTimePanel.getStartDatePicker().editable).toBeFalsy();
            expect(dateTimePanel.getStartDatePicker().width).toBe(100);
        });

        it('end date picker', function() {
            expect(dateTimePanel.getEndDatePicker()).toBeTruthy();
            expect(dateTimePanel.getEndDatePicker().format).toBe(dateTimePanel.DATE_FORMAT);
            expect(dateTimePanel.getEndDatePicker().editable).toBeFalsy();
            expect(dateTimePanel.getEndDatePicker().width).toBe(100);
        });

        it('start time combo', function() {
            expect(dateTimePanel.getStartTimeCombo()).toBeTruthy();
            expect(dateTimePanel.getStartTimeCombo().mode).toBe('local');
            expect(dateTimePanel.getStartTimeCombo().triggerAction).toBe('all');
            expect(dateTimePanel.getStartTimeCombo().editable).toBeFalsy();
            expect(dateTimePanel.getStartTimeCombo().valueField).toBe('timeValue');
            expect(dateTimePanel.getStartTimeCombo().displayField).toBe('displayTime');
            expect(dateTimePanel.getStartTimeCombo().width).toBe(130);
        });
        
        it('end time combo', function() {
            expect(dateTimePanel.getEndTimeCombo()).toBeTruthy();
            expect(dateTimePanel.getEndTimeCombo().mode).toBe('local');
            expect(dateTimePanel.getEndTimeCombo().triggerAction).toBe('all');
            expect(dateTimePanel.getEndTimeCombo().editable).toBeFalsy();
            expect(dateTimePanel.getEndTimeCombo().valueField).toBe('timeValue');
            expect(dateTimePanel.getEndTimeCombo().displayField).toBe('displayTime');
            expect(dateTimePanel.getEndTimeCombo().width).toBe(130);
        });
    });

    describe('picker values on temporal extent changed', function() {
        var animationControlsPanel;
        
        beforeEach(function() {
        });

        it('start date picker', function() {
            spyOn(dateTimePanel, '_updateTimeCombo');
            dateTimePanel._onTemporalExtentChanged(extentEvent);
            expect(dateTimePanel.startDatePicker.minValue).toBeSameAsUtc('2008-01-01T12:34:56');
            expect(dateTimePanel.startDatePicker.maxValue).toBeSameAsUtc('2010-01-01T12:34:56');
            console.log(dateTimePanel.startDatePicker.getValue());
            expect(dateTimePanel.startDatePicker.getValue()).toBeSame('2009-01-01');
        });
        
        it('end date picker', function() {
            spyOn(dateTimePanel, '_updateTimeCombo');
            dateTimePanel._onTemporalExtentChanged(extentEvent);
            expect(dateTimePanel.endDatePicker.minValue).toBeSameAsUtc('2008-01-01T12:34:56');
            expect(dateTimePanel.endDatePicker.maxValue).toBeSameAsUtc('2010-01-01T12:34:56');
            expect(dateTimePanel.endDatePicker.getValue()).toBeSame('2010-01-01');
        });

        describe('time pickers updated on date picker change', function() {
            describe('start', function() {
                it('start time picker updated on temporal extent change', function() {
                    spyOn(dateTimePanel, '_updateStartTimeCombo');
                    spyOn(dateTimePanel, '_updateEndTimeCombo');

                    dateTimePanel._onTemporalExtentChanged(extentEvent);
                    expect(dateTimePanel._updateStartTimeCombo.calls[0].args[0]).toBeSameAsUtc('2009-01-01T12:34:56');
                });

                it('start time picker updated', function() {
                    spyOn(dateTimePanel, '_updateStartTimeCombo');

                    dateTimePanel.startDatePicker.fireEvent(
                        'select',
                        dateTimePanel.startDatePicker,
                        moment('2001-01-01').toDate());
                    expect(dateTimePanel._updateStartTimeCombo.calls[0].args[0]).toBeSame('2001-01-01');
                });

                it('updateStartTimeCombo', function() {
                    dateTimePanel.parentAnimationControl = {
                        selectedLayer:  {
                            getDatesOnDay: function() {

                                return [
                                    moment('2001-01-01T05:00'),
                                    moment('2001-01-01T15:00')
                                ];
                            }
                        }
                    };

                    spyOn(dateTimePanel.startTimeCombo.store, 'loadData').andCallThrough();
                    
                    dateTimePanel._updateStartTimeCombo(moment('2001-01-01T05:00'));
                    
                    var addData = dateTimePanel.startTimeCombo.store.loadData.calls[0].args[0];
                    expect(addData[0].timeValue).toBe(moment('2001-01-01T05:00').valueOf());
                    expect(addData[0].displayTime).toBe('18:00:00 (+00:00)');
                    expect(addData[1].timeValue).toBe(moment('2001-01-01T15:00').valueOf());
                    expect(dateTimePanel.startTimeCombo.getValue()).toBeSame('2001-01-01T05:00');
                });
            });
            
            describe('end', function() {
                it('end time picker updated on temporal extent change', function() {
                    spyOn(dateTimePanel, '_updateStartTimeCombo');
                    spyOn(dateTimePanel, '_updateEndTimeCombo');

                    dateTimePanel._onTemporalExtentChanged(extentEvent);
                    expect(dateTimePanel._updateEndTimeCombo.calls[0].args[0]).toBeSameAsUtc('2010-01-01T12:34:56');
                });

                it('end time picker updated', function() {
                    spyOn(dateTimePanel, '_updateEndTimeCombo');

                    dateTimePanel.endDatePicker.fireEvent(
                        'select',
                        dateTimePanel.endDatePicker,
                        moment('2001-01-01').toDate());
                    expect(dateTimePanel._updateEndTimeCombo.calls[0].args[0]).toBeSame('2001-01-01');
                });

                it('updateEndTimeCombo', function() {
                    dateTimePanel.parentAnimationControl = {
                        selectedLayer:  {
                            getDatesOnDay: function() {

                                return [
                                    moment('2001-01-01T05:00'),
                                    moment('2001-01-01T15:00')
                                ];
                            }
                        }
                    };

                    spyOn(dateTimePanel.endTimeCombo.store, 'loadData').andCallThrough();
                    
                    dateTimePanel._updateEndTimeCombo(moment('2001-01-01T05:00'));
                    
                    var addData = dateTimePanel.endTimeCombo.store.loadData.calls[0].args[0];
                    expect(addData[0].timeValue).toBe(moment('2001-01-01T05:00').valueOf());
                    expect(addData[0].displayTime).toBe('18:00:00 (+00:00)');
                    expect(addData[1].timeValue).toBe(moment('2001-01-01T15:00').valueOf());
                    expect(dateTimePanel.endTimeCombo.getValue()).toBeSame('2001-01-01T05:00');
                });
            });
        });
    });

    describe('enable/disable', function() {
        it('enable', function() {
		    dateTimePanel.startDatePicker.disable();
		    dateTimePanel.endDatePicker.disable();
		    dateTimePanel.startTimeCombo.disable();
		    dateTimePanel.endTimeCombo.disable();

            dateTimePanel.enable();
            
		    expect(dateTimePanel.startDatePicker.disabled).toBeFalsy();
		    expect(dateTimePanel.endDatePicker.disabled).toBeFalsy();
		    expect(dateTimePanel.startTimeCombo.disabled).toBeFalsy();
		    expect(dateTimePanel.endTimeCombo.disabled).toBeFalsy();
        });

        it('disable', function() {
		    dateTimePanel.startDatePicker.enable();
		    dateTimePanel.endDatePicker.enable();
		    dateTimePanel.startTimeCombo.enable();
		    dateTimePanel.endTimeCombo.enable();

            dateTimePanel.disable();
            
		    expect(dateTimePanel.startDatePicker.disabled).toBeTruthy();
		    expect(dateTimePanel.endDatePicker.disabled).toBeTruthy();
		    expect(dateTimePanel.startTimeCombo.disabled).toBeTruthy();
		    expect(dateTimePanel.endTimeCombo.disabled).toBeTruthy();
        });
    });

    describe('time control reconfigured on time/date select', function() {

        beforeEach(function() {
            dateTimePanel.startTimeCombo.setValue(moment('2000-01-01T22:22:22').valueOf());
            dateTimePanel.endTimeCombo.setValue(moment('2010-10-10T11:11:11').valueOf());
            
            spyOn(timeControl, 'configureForLayer');
            spyOn(dateTimePanel, '_updateTimeCombo');
        });
        
        it('start time combo select', function() {
            dateTimePanel.startTimeCombo.fireEvent('select');
            expect(timeControl.configureForLayer.calls[0].args[0]).toBe(selectedLayer);
            expect(timeControl.configureForLayer.calls[0].args[1]).toBeSame([
                '2000-01-01T22:22:22', '2010-10-10T11:11:11'
            ]);
        });

        it('end time combo select', function() {
            dateTimePanel.endTimeCombo.fireEvent('select');
            expect(timeControl.configureForLayer.calls[0].args[0]).toBe(selectedLayer);
            expect(timeControl.configureForLayer.calls[0].args[1]).toBeSame([
                '2000-01-01T22:22:22', '2010-10-10T11:11:11'
            ]);
        });
    });

    describe('layer precached on time select', function() {
        beforeEach(function() {
            spyOn(timeControl, 'configureForLayer');
            spyOn(dateTimePanel, '_updateTimeCombo');
            spyOn(dateTimePanel.parentAnimationControl.selectedLayer, '_precache');
            dateTimePanel.startTimeCombo.setValue(0);
            dateTimePanel.endTimeCombo.setValue(1);
        });
        
        it('start time combo select', function() {
            dateTimePanel.startTimeCombo.fireEvent('select');
            expect(dateTimePanel.parentAnimationControl.selectedLayer._precache).toHaveBeenCalled();
        });

        it('end time combo select', function() {
            dateTimePanel.endTimeCombo.fireEvent('select');
            expect(dateTimePanel.parentAnimationControl.selectedLayer._precache).toHaveBeenCalled();
        });
    });
});

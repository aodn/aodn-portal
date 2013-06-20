/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.AnimationDateTimeSelectorPanel = Ext.extend(Ext.Panel, {

    DATE_FORMAT: 'Y-m-d',
    TIME_FORMAT: 'HH:mm:ss (Z)',
    
    constructor: function(cfg) {
        var config = Ext.apply({
            layout: 'table',
            layoutConfig: {
                columns: 3,
				tableAttrs : {
					style : {
						width : '80%'
					}
				}
            },
            plain: true
        }, cfg);

        Portal.details.AnimationDateTimeSelectorPanel.superclass.constructor.call(this, config);

        if (this.timeControl) {
            this.timeControl.events.on({
                'temporalextentchanged': this._onTemporalExtentChanged,
                scope: this
            });
        }
    },

    initComponent: function() {
        
		this.startLabel = new Ext.form.Label({
			html : "Start:"
		});

		this.endLabel = new Ext.form.Label({
			html : "End:"
		});
        
		this.startDatePicker = new Ext.form.DateField({
            format : this.DATE_FORMAT,
            disabledDatesText: "unavailable",
            editable : false,
			width : 100,
			listeners : {
				scope : this,
                select: this._onStartDateSelected
			}
		});
        
		this.endDatePicker = new Ext.form.DateField({
            format : this.DATE_FORMAT,
            disabledDatesText: "unavailable",
            editable : false,
			width : 100,
			listeners : {
				scope : this,
                select: this._onEndDateSelected
			}
		});

        this.startTimeCombo = new Portal.details.TimeComboBox({
			width : 130,
            listeners: {
                scope: this,
                select: this._onTimeSelected
            }
        });
        
		this.endTimeCombo = new Portal.details.TimeComboBox({
			width : 130,
            listeners: {
                scope: this,
                select: this._onTimeSelected
            }
        });

        this.items = [
            this.startLabel, this.startDatePicker, this.startTimeCombo,
            this.endLabel, this.endDatePicker, this.endTimeCombo
        ];
        
		Portal.details.AnimationDateTimeSelectorPanel.superclass.initComponent.call(this);
    },

    disable: function() {

        this.startDatePicker.disable();
		this.endDatePicker.disable();
		this.startTimeCombo.disable();
		this.endTimeCombo.disable();
    },
    
    enable: function() {
        this.startDatePicker.enable();
		this.endDatePicker.enable();
		this.startTimeCombo.enable();
		this.endTimeCombo.enable();
    },
    
    _onStartDateSelected: function(startDatePicker, jsDate) {
        this._updateStartTimeCombo(moment(jsDate));
    },

    _onTimeSelected: function(combo, record, index) {
        this.timeControl.configureForLayer(
            this.parentAnimationControl.selectedLayer,
            [
                moment(this.startTimeCombo.getValue()),
                moment(this.endTimeCombo.getValue())
            ]
        );
        this.parentAnimationControl.selectedLayer._precache();
    },
    
    _onEndDateSelected: function(endDatePicker, jsDate) {
        this._updateEndTimeCombo(moment(jsDate));
    },
    
    _onTemporalExtentChanged: function(evt) {
        this.startDatePicker.setMinValue(evt.layer.min.local().toDate());
        this.startDatePicker.setMaxValue(evt.layer.max.local().toDate());
        this.startDatePicker.setValue(evt.timer.min.local().toDate());
        
        this.endDatePicker.setMinValue(evt.layer.min.local().toDate());
        this.endDatePicker.setMaxValue(evt.layer.max.local().toDate());
        this.endDatePicker.setValue(evt.timer.max.local().toDate());

        this._updateStartTimeCombo(evt.timer.min.local());
        this._updateEndTimeCombo(evt.timer.max.local());
    },    

    _updateStartTimeCombo: function(dateTime) {
        this._updateTimeCombo(this.startTimeCombo, dateTime, true);
    },

    _updateEndTimeCombo: function(dateTime) {
        this._updateTimeCombo(this.endTimeCombo, dateTime, false);
    },

    _updateTimeCombo: function(timeCombo, dateTime, useFirstOfDatesOnDay) {
        var datesOnDay = this.parentAnimationControl.selectedLayer.getDatesOnDay(dateTime);
    
        var data = [];
        for (var i = 0; i < datesOnDay.length; i++) {
            data.push({
                timeValue: datesOnDay[i].valueOf(),
                displayTime: datesOnDay[i].local().format(this.TIME_FORMAT)
            });
        }

        timeCombo.getStore().loadData(data);
        if (useFirstOfDatesOnDay) {
            timeCombo.setValue(datesOnDay[0].valueOf());
        }
        else {
            timeCombo.setValue(datesOnDay.last().valueOf());
        }
        timeCombo.setValue(dateTime.valueOf())
    },
    
    getStartDatePicker: function() {
        return this.startDatePicker;
    },

    getEndDatePicker: function() {
        return this.endDatePicker;
    },

    getStartTimeCombo: function() {
        return this.startTimeCombo;
    },

    getEndTimeCombo: function() {
        return this.endTimeCombo;
    },

    setMissingDays: function(missingDays) {
        var missingDateStrings = [];
        for (var i = 0; i < missingDays.length; i++) {
            var v = missingDays[i];
            if (typeof(v) == 'string') {
                missingDateStrings.push(missingDays[i]);
            }
            else if (missingDays[i].format) {
                missingDateStrings.push(missingDays[i].format('YYYY-MM-DD'));
            }
        }
        this.startDatePicker.setDisabledDates(missingDateStrings);
        this.endDatePicker.setDisabledDates(missingDateStrings);
    }
});

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

    ROW_HEIGHT: 30,

    constructor: function(cfg) {
        var config = Ext.apply({
            height: this.ROW_HEIGHT * 2,
            layout: 'vbox',
            align: 'stretch'
        }, cfg);

        Portal.details.AnimationDateTimeSelectorPanel.superclass.constructor.call(this, config);

        this.initialSetup = true;

        if (this.timeControl) {
            this.timeControl.events.on({
                'temporalextentchanged': this._onTemporalExtentChanged,
                scope: this
            });
        }
    },

    initComponent: function() {

        this.startLabel = new Ext.form.Label({
            html : "Start:",
            width: 50
        });

        this.endLabel = new Ext.form.Label({
            html : "End:",
            width: 50
        });

        this.startDatePicker = new Ext.form.DateField({
            format : this.DATE_FORMAT,
            disabledDatesText: "unavailable",
            editable : false,
            width : 120,
            listeners : {
                scope : this,
                select: this._onStartDateSelected
            }
        });

        this.endDatePicker = new Ext.form.DateField({
            format : this.DATE_FORMAT,
            disabledDatesText: "unavailable",
            editable : false,
            width : 120,
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
            {
                xtype: 'panel',
                layout: 'hbox',
                width: '100%',
                height: this.ROW_HEIGHT,
                items: [
                    this.startLabel, this.startDatePicker, this.startTimeCombo
                ]
            },
            {
                xtype: 'panel',
                layout: 'hbox',
                width: '100%',
                height: this.ROW_HEIGHT,
                items: [
                    this.endLabel, this.endDatePicker, this.endTimeCombo
                ]
            }
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

    updateForState: function(state) {
        if (state.isPlaying()) {
            this.disable();
        } else if (state.isPaused()) {
            this.enable();
        }
    },

    _onStartDateSelected: function(startDatePicker, jsDate) {
        this._updateStartTimeCombo(moment(jsDate));
    },

    _onTimeSelected: function(combo, record, index) {
        this._onDateTimeSelectionChange();
    },

    _onDateTimeSelectionChange: function() {
        var startTime = moment(this.startTimeCombo.getValue());
        var endTime   = moment(this.endTimeCombo.getValue());

        // Handle the case when endTime is not after startTime
        if (!endTime.isAfter(startTime)) {
            // TODO: pop up box for user?
            endTime = startTime.clone();
        }
        this.timeControl.configureForLayer(
            this.parentAnimationControl.selectedLayer,
                [ startTime, endTime ]);
        this.parentAnimationControl.selectedLayer._precache();
    },

    _onEndDateSelected: function(endDatePicker, jsDate) {
        this._updateEndTimeCombo(moment(jsDate));
    },

    _onTemporalExtentChanged: function(evt) {
        this.startDatePicker.setMinValue(evt.layer.min.toDate());
        this.startDatePicker.setMaxValue(evt.layer.max.toDate());
        this.startDatePicker.setValue(evt.timer.min.toDate());

        this.endDatePicker.setMinValue(evt.layer.min.toDate());
        this.endDatePicker.setMaxValue(evt.layer.max.toDate());
        this.endDatePicker.setValue(evt.timer.max.toDate());

        // On the first time we get temporalextentchanged, we'll have to
        // also select the right value in the time combos
        if (this.initialSetup) {
            this._updateStartTimeCombo(evt.timer.min);
            this._updateEndTimeCombo(evt.timer.max);
            this.initialSetup = false;
        }
    },

    _updateStartTimeCombo: function(dateTime) {
        this._updateTimeCombo(this.startTimeCombo, dateTime, true);
    },

    _updateEndTimeCombo: function(dateTime) {
        this._updateTimeCombo(this.endTimeCombo, dateTime, false);
    },

    _updateTimeCombo: function(timeCombo, dateTime, useFirstIfNotFound) {
        var datesOnDay = this.parentAnimationControl.selectedLayer.getDatesOnDay(dateTime);

        exactDateFoundInCombo = false;
        var data = [];
        for (var i = 0; i < datesOnDay.length; i++) {
            data.push({
                timeValue: datesOnDay[i].valueOf(),
                displayTime: datesOnDay[i].format(this.TIME_FORMAT)
            });
            if (datesOnDay[i].isSame(dateTime)) {
                exactDateFoundInCombo = true;
            }
        }

        timeCombo.getStore().loadData(data);
        if (exactDateFoundInCombo) {
            timeCombo.setValue(dateTime.valueOf());
        } else if (useFirstIfNotFound) {
            timeCombo.setValue(datesOnDay[0].valueOf());
        } else {
            timeCombo.setValue(datesOnDay.last().valueOf());
        }
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
            } else if (missingDays[i].format) {
                missingDateStrings.push(missingDays[i].format('YYYY-MM-DD'));
            }
        }
        this.startDatePicker.setDisabledDates(missingDateStrings);
        this.endDatePicker.setDisabledDates(missingDateStrings);
    }
});

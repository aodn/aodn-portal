/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.AnimationDateTimeSelectorPanel = Ext.extend(Ext.Panel, {
    
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
			html : "End: ",
			width : 70
		});
        
		this.startDatePicker = new Ext.form.DateField({
			format : 'd-m-Y',
			editable : false,
			width : 100,
			listeners : {
				scope : this,
                select: this._onStartDateSelected
			}
		});
        
		this.endDatePicker = new Ext.form.DateField({
			format : 'd-m-Y',
			editable : false,
			width : 100,
			listeners : {
				scope : this,
                select: this._onEndDateSelected
			}
		});
        
        // Have to use a generic combo, as Ext.form.TimeField blats the date part of values (leaving just the
        // time of day).
		this.startTimeCombo = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                autoLoad : false,
			    autoDestroy : true,
			    fields : ['momentValue', 'displayTime'],
			    data : []
            }),
            mode: 'local',
			triggerAction : "all",
			editable : false,
			valueField : 'momentValue',
			displayField : 'displayTime',
			width : 130
        });
        
		this.endTimeCombo = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                autoLoad : false,
			    autoDestroy : true,
			    fields : ['momentValue', 'displayTime'],
			    data : []
            }),
            mode: 'local',
			triggerAction : "all",
			editable : false,
			valueField : 'momentValue',
			displayField : 'displayTime',
			width : 130
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

        this._updateStartTimeCombo(evt.timer.min);
        this._updateEndTimeCombo(evt.timer.max);
    },    

    _updateStartTimeCombo: function(dateTime) {
        this._updateTimeCombo(this.startTimeCombo, dateTime);
    },

    _updateEndTimeCombo: function(dateTime) {
        this._updateTimeCombo(this.endTimeCombo, dateTime);
    },

    _updateTimeCombo: function(timeCombo, dateTime) {
        var datesOnDay = this.parent.selectedLayer.getDatesOnDay(dateTime);
    
        var data = [];
        for (var i = 0; i < datesOnDay.length; i++) {
            data.push([datesOnDay[i], datesOnDay[i].format('HH:mm:ss (Z)')]);
        }

        timeCombo.getStore().loadData(data);
        timeCombo.setValue(dateTime.format('HH:mm:ss (Z)'));
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
    }
});

/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.form');

Portal.form.UtcExtentDateTime = Ext.extend(Ext.ux.form.DateTime, {

    initComponent: function() {
        Portal.form.UtcExtentDateTime.superclass.initComponent.call(this);

        // least nasty hack to add altFormats
        this.df = this.df.cloneConfig({
            altFormats: OpenLayers.i18n('dateAltFormats'),
            emptyText: OpenLayers.i18n('loadingMessage'),
            minText: OpenLayers.i18n('dateNcWmsMinError'),
            maxText: OpenLayers.i18n('dateNcWmsMaxError')
        });

        this._preventStoreChangesBeingIgnored();

        this.tf.on('select', function(field, record, index) {
            this.onBlur(field);
        }, this);

        this.df.on('select', function(field, record, index) {
            this.onBlur(field);
        }, this);

        this.df.on('blur', function(field, e) {
            this.onBlur(field);
        }, this);
    },

    setExtent: function(extent) {
        this.extent = extent;
        this.df.setMinValue(this.getLocalDateFromUtcMoment(extent.min(), true));
        this.df.setMaxValue(this.getLocalDateFromUtcMoment(extent.max(), true));
        this.df.setDisabledDates(extent.getMissingDays());

        this._setTimeValues(extent.min(), this.extent);
    },

    setValue: function(momentDate, toMaxTime) {
        if (typeof momentDate == 'string') { // todo - Temporary fix for an ncWMS date problem
            momentDate = moment(momentDate);
        }

        this.df.setValue(this.getLocalDateFromUtcValues(momentDate.utc().toDate()));
        this._setTimeValues(momentDate.utc(), this.extent, toMaxTime);
    },

    getValue: function() {
        // create new instance of date using clone
        // new Date(this.dateValue) used by superclass doesn't preserve milliseconds
        // on firefox
        return this.dateValue ? this.dateValue.clone() : '';
    },

    reset: function() {
        this.df.reset();
        this.tf.reset();
    },

    _setTimeValues: function(date, extent, toMaxTime) {
        var dayExtent = extent.subExtentForDate(date);

        if (dayExtent && dayExtent.length() > 0) {
            this._extentToStore(dayExtent);
            this._setTimeMinValue(dayExtent);
            this._setTimeMaxValue(dayExtent);

            if (this.timeFieldChange) {
                this._setTimeValue(date);
            }
            else {
                if (toMaxTime) {
                    this._setTimeValue(dayExtent.max());
                }
                else {
                    this._setTimeValue(dayExtent.min());
                }
            }
            this.tf.setDisabled(false);
        }
        else {
            this._setTimeValue(date);
            this.tf.setDisabled(true);
        }
    },

    _setTimeMaxValue: function(extent) {
        this.tf.setMaxValue(this.getLocalDateFromUtcValues(extent.max().toDate()));
    },

    _setTimeMinValue: function(extent) {
        this.tf.setMinValue(this.getLocalDateFromUtcValues(extent.min().toDate()));
    },

    _setTimeValue: function(timeValue) {
        this.tf.setValue(this.getLocalDateFromUtcValues(timeValue.utc().toDate()));
        this.dateValue = timeValue.toDate();
    },

    getLocalDateFromUtcMoment: function(momentDate, toStartOfDay) {
        var clone = toStartOfDay ? momentDate.startOf('day').clone() : momentDate.clone();
        return this.getLocalDateFromUtcValues(clone.utc().toDate());
    },

    getLocalDateFromUtcValues: function(utcDate) {
        return new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes(),
            utcDate.getUTCSeconds(),
            utcDate.getUTCMilliseconds()
        );
    },

    getUtcDateFromLocalValues: function(localDate) {
        var utcDate = new Date(this.dateValue.getTime());

        if (localDate && "" != localDate) {
            utcDate.setUTCFullYear(localDate.getFullYear());
            utcDate.setUTCMonth(localDate.getMonth());
            utcDate.setUTCDate(localDate.getDate());
            utcDate.setUTCHours(localDate.getHours());
            utcDate.setUTCMinutes(localDate.getMinutes());
            utcDate.setUTCSeconds(localDate.getSeconds());
            utcDate.setUTCMilliseconds(localDate.getMilliseconds());
        }

        return utcDate;
    },

    onBlur: function(field) {
        this._setTimeFieldChangeFlag(field);

        if (this._isDirty()) {
            this._fireEventsForChange(this._matchTime());
        }
    },

    _isDirty: function() {
        return this.dateValue.getTime() != this._matchTime().getTime();
    },

    onFocus: function() {
        this.startValue = this.dateValue;
    },

    // Ripped straight from Saki's DateTime but added calls to local onBlur to ensure values are updated
    onSpecialKey: function(field, event) {
        var key = event.getKey();
        if (key === event.TAB) {
            if (field === this.df && !event.shiftKey) {
                event.stopEvent();
                this.tf.focus();
                this.onBlur(this.df);
            }
            if (field === this.tf && event.shiftKey) {
                event.stopEvent();
                this.df.focus();
                this.onBlur(this.tf);
            }
        }
        // otherwise it misbehaves in editor grid
        if (key === event.ENTER) {
            if (field === this.df) {
                this.onBlur(this.df);
            }
            if (field === this.tf) {
                this.onBlur(this.tf);
            }
        }
    },

    _fireEventsForChange: function(value) {
        this.fireEvent("change", this, value, this.startValue);
    },

    _setTimeFieldChangeFlag: function(field) {
        this.timeFieldChange = (field === this.tf);
    },

    _matchTime: function() {
        var extentArray = this._getExtentForSelectedDate().getExtentAsArray();
        var timeString = this.tf.getValue();

        if (extentArray && extentArray.length > 0) {
            for (var i = 0; i < extentArray.length; i++) {
                var momentDate = extentArray[i];
                if (momentDate.utc().format(OpenLayers.i18n('timeDisplayFormat')) == timeString) {
                    return momentDate.clone().toDate();
                }
            }
            return this._getDefaultTime(extentArray);
        }
        else {
            return this.getUtcDateFromLocalValues(this.df.getValue());
        }
    },

    _getExtentForSelectedDate: function() {
        return this.extent.subExtentForDate(this.getUtcDateFromLocalValues(this.df.getValue()));
    },

    _getDefaultTime: function(extentArray) {
        if (this.timeFieldChange && this.startValue) {
            return this.startValue;
        }
        return extentArray[0].toDate();
    },

    _extentToStore: function(extent) {
        var data = new Array();
        Ext.each(extent.getExtentAsArray(), function(momentDate, index, all) {
            data.push({
                timeValue: this.getLocalDateFromUtcValues(momentDate.toDate()),
                displayTime: momentDate.format(OpenLayers.i18n('timeDisplayFormat'))
            });
        }, this);
        this.tf.getStore().loadData(data);
    },

    _preventStoreChangesBeingIgnored: function() {
        this.tf.generateStore = function() {};
    }
});

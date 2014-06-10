/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.DateFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            layout: 'form',
            labelSeparator: '',
            labelWidth: 35,
            layoutConfig: {
                align: 'left'
            }
        }, cfg);

        this.TIME_UTIL = new Portal.utils.TimeUtil();
        // Divide time zone offset by 60 to get total hours
        this.timeZoneCorrect = (new Date().getTimezoneOffset()) / -60;

        Portal.filter.DateFilterPanel.superclass.constructor.call(this, config);
    },

    _createField: function() {
        this.fromDate = this._createResettableDate('from');
        this.toDate = this._createResettableDate('to');

        this.add(this.fromDate);

        this.add(new Ext.Spacer({
            height: 5
        }));

        this.add(this.toDate);

        if (this.filter.possibleValues != undefined) {
            this._setMinMax(this.fromDate, this.filter.possibleValues);
            this._setMinMax(this.toDate, this.filter.possibleValues);
        }
    },

    _createResettableDate: function(name) {
        return new Portal.filter.ResettableDate({
            name: name,
            fieldLabel: OpenLayers.i18n(name + 'DateLabel'),
            emptyText: OpenLayers.i18n(name + 'DateEmptyText'),
            listeners: {
                scope: this,
                change: this._applyDateFilterPanel
            }
        });
    },

    _setMinMax: function(resettableDate, vals) {
        resettableDate.setMinValue(this.TIME_UTIL._parseIso8601Date(vals[0]));

        if (vals.length == 2) {
            resettableDate.setMaxValue(this.TIME_UTIL._parseIso8601Date(vals[1]));
        }
    },

    _getDateString: function(combo) {

        var newDate = combo.getValue();
        if (newDate) {
            newDate.setHours(this.timeZoneCorrect);
            return this.TIME_UTIL._toUtcIso8601DateString(newDate);
        }

        return '';
    },
    _getDateHumanString: function(combo) {

        var newDate = combo.getValue();
        if (newDate) {
            newDate.setHours(this.timeZoneCorrect);
            return this._formatHumanDate(newDate);
        }

        return '';
    },

    _formatHumanDate: function(date) {
        return moment(date).format(OpenLayers.i18n('dateTimeDisplayFormat'));
    },

    _applyDateFilterPanel: function() {
        this._fireAddEvent();
    },

    _isFromFieldUsed: function() {
        return this.fromDate.getValue();
    },

    _isToFieldUsed: function() {
        return this.toDate.getValue();
    },

    getFilterData: function() {

        console.log("called");

        return {
            name: this.filter.name,
            downloadOnly: this.isDownloadOnly(),
            cql: this._getCQL(),
            humanValue: this._getCQLHumanValue()
        }
    },

    _getCQLHumanValue: function() {

        var cql = '';

        if (this._isFromFieldUsed()) {
            cql = String.format("{0} >= {1}", "Start Date", this._getDateHumanString(this.fromDate));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' and ';
        }

        if (this._isToFieldUsed()) {
            cql += String.format("{0} <= {1}", "End Date", this._getDateHumanString(this.toDate));
        }

        return cql;
    },

    _getCQL: function() {

        var cql = '';

        if (this._isFromFieldUsed()) {
            cql = String.format("{0} >= {1}", this.filter.name, this._getDateString(this.fromDate));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' AND ';
        }

        if (this._isToFieldUsed()) {
            cql += String.format("{0} <= {1}", this.filter.name, this._getDateString(this.toDate));
        }

        return cql;
    },

    handleRemoveFilter: function() {
        this.toDate.reset();
        this.fromDate.reset();

        this.toDate.setMinValue(new Date(0));
    },

    _setExistingFilters: function() {
        var beforePattern = this.filter.name + " <= (.*?)( |$)";
        var afterPattern = this.filter.name + " >= (.*?)( |$)";

        var betweenRe = new RegExp(afterPattern + "AND " + beforePattern);
        var beforeRe = new RegExp(beforePattern);
        var afterRe = new RegExp(afterPattern);

        var m = beforeRe.exec(this.layer.getDownloadFilter());
        var m2 = afterRe.exec(this.layer.getDownloadFilter());
        var between = betweenRe.exec(this.layer.getDownloadFilter());

        if (between != null && between.length == 5) {
            this.fromDate.setValue(this.TIME_UTIL._parseIso8601Date(between[1]));
            this.toDate.setValue(this.TIME_UTIL._parseIso8601Date(between[3]));
        }
        else {
            if (m != null && m.length == 3) {
                this.fromDate.setValue(this.TIME_UTIL._parseIso8601Date(m[1]));
            }
            else if (m2 != null && m2.length == 3) {
                this.fromDate.setValue(this.TIME_UTIL._parseIso8601Date(m2[1]));
            }
        }
    }
});

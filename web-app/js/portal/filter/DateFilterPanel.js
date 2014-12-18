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
            typeLabel: OpenLayers.i18n('temporalExtentHeading'),
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
        this.fromDate = this._createResettableDate('fromDate', OpenLayers.i18n('fromDateLabel'), OpenLayers.i18n('fromDateEmptyText'));
        this.toDate = this._createResettableDate('toDate', OpenLayers.i18n('toDateLabel'), OpenLayers.i18n('toDateEmptyText'));

        this.add(this.fromDate);
        this._addVerticalSpacer(5);
        this.add(this.toDate);
        this._addVerticalSpacer(15);

        if (this.filter.values != undefined) {
            this._setMinMax(this.fromDate, this.filter.values);
            this._setMinMax(this.toDate, this.filter.values);
        }
    },

    _addVerticalSpacer: function(sizeInPixels) {
        this.add(
            new Ext.Spacer({
                cls:'block',
                height: sizeInPixels
            })
        );
    },

    _createResettableDate: function(name, fieldLabel, emptyText) {
        return new Portal.filter.ResettableDate({
            name: name,
            fieldLabel: fieldLabel,
            emptyText: emptyText,
            listeners: {
                scope: this,
                change: this._applyDateFilterPanel
            }
        });
    },

    getFilterName: function() {
        // No titles for DateFilter
        return null;
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

    _applyDateFilterPanel: function(component) {

        var usageLabel = OpenLayers.i18n('trackingDefaultValueReset');
        if (this.fromDate.hasValue()) {
            this.toDate.setMinValue(this.fromDate.getValue());
            usageLabel = OpenLayers.i18n('trackingUserSet');
        }
        else {
            this.toDate.applyDefaultValueLimits();
        }

        if (this.toDate.hasValue()) {
            this.fromDate.setMaxValue(this.toDate.getValue());
            usageLabel = OpenLayers.i18n('trackingUserSet');
        }
        else {
            this.fromDate.applyDefaultValueLimits();
        }

        var val = component._dateField.name + " " + usageLabel + " " + component._dateField.getValue();
        trackFiltersUsage('filtersTrackingDateAction', val, this.layer.name);
        this._fireAddEvent();
    },

    _isFromFieldUsed: function() {
        return this.fromDate.getValue();
    },

    _isToFieldUsed: function() {
        return this.toDate.getValue();
    },

    getFilterData: function() {
        return {
            name: this.filter.name,
            visualised: true,
            visualisationCql: this._getCQL(),
            cql: this._getCQL(this.filter.name),
            humanValue: this._getCQLHumanValue()
        }
    },

    _getCQLHumanValue: function() {

        var cql = '';

        if (this._isFromFieldUsed()) {
            cql = String.format("{0} >= {1}", "End Date", this._getDateHumanString(this.fromDate));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' and ';
        }

        if (this._isToFieldUsed()) {
            cql += String.format("{0} <= {1}", "Start Date", this._getDateHumanString(this.toDate));
        }

        return cql;
    },

    _getValidName: function(filterName,wmsAttribName) {

        if (filterName) {
            return filterName;
        }
        else {
            return (wmsAttribName) ? wmsAttribName : this.filter.name
        }
    },

    _getCQL: function(filterName) {

        var cql = '';
        var name = "";

        if (this._isFromFieldUsed()) {
            name = this._getValidName(filterName,this.filter.wmsEndDateName);
            cql = String.format("{0} >= '{1}'", name , this._getDateString(this.fromDate));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' AND ';
        }

        if (this._isToFieldUsed()) {
            name = this._getValidName(filterName,this.filter.wmsStartDateName);
            cql += String.format("{0} <= '{1}'", name, this._getDateString(this.toDate));
        }

        return cql;
    },

    handleRemoveFilter: function() {
        this.toDate.reset();
        this.fromDate.reset();

        this.toDate.setMinValue(new Date(0));
    },

    _setExistingFilters: function() {
        var beforePattern = this.filter.name + " <= '(.*?)'( |$)";
        var afterPattern = this.filter.name + " >= '(.*?)'( |$)";

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

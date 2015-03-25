/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.DateFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

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

        Portal.filter.ui.DateFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {
        this.fromDate = this._createResettableDate('fromDate', OpenLayers.i18n('fromDateLabel'), OpenLayers.i18n('fromDateEmptyText'));
        this.toDate = this._createResettableDate('toDate', OpenLayers.i18n('toDateLabel'), OpenLayers.i18n('toDateEmptyText'));

        this.add(this.fromDate);
        this._addVerticalSpacer(5);
        this.add(this.toDate);

        if (this.filter.values != undefined) {
            this._setMinMax(this.fromDate, this.filter.values);
            this._setMinMax(this.toDate, this.filter.values);
        }
    },

    handleRemoveFilter: function() {
        this.toDate.reset();
        this.fromDate.reset();

        this.toDate.setMinValue(new Date(0));
    },

    needsFilterRange: function() {
        return false;
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
        return new Portal.filter.ui.ResettableDate({
            name: name,
            fieldLabel: fieldLabel,
            emptyText: emptyText,
            listeners: {
                scope: this,
                change: this._applyDateFilter
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

    _applyDateFilter: function(component) {

        var changedField = component._dateField;

        this.toDate.setMinValue(this.fromDate.getValue());
        this.fromDate.setMaxValue(this.toDate.getValue());

        this._fireAddEvent();

        var usageLabelKey = changedField.getValue() ? 'trackingUserSet' : 'trackingDefaultValueReset';
        var val = changedField.name + " " + OpenLayers.i18n(usageLabelKey) + " " + changedField.getValue();
        trackFiltersUsage('filtersTrackingDateAction', val, this.layer.name);
    },

    _isFromFieldUsed: function() {
        return this.fromDate.getValue();
    },

    _isToFieldUsed: function() {
        return this.toDate.getValue();
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

    _getValidName: function(filterName, wmsAttribName) {

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
            name = this._getValidName(filterName, this.filter.wmsEndDateName);
            cql = String.format("{0} >= '{1}'", name , this._getDateString(this.fromDate));
        }

        if (this._isFromFieldUsed() && this._isToFieldUsed()) {
            cql += ' AND ';
        }

        if (this._isToFieldUsed()) {
            name = this._getValidName(filterName, this.filter.wmsStartDateName);
            cql += String.format("{0} <= '{1}'", name, this._getDateString(this.toDate));
        }

        return cql;
    }
});

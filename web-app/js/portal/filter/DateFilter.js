/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.DateFilter = Ext.extend(Portal.filter.Filter, {

    constructor: function(cfg) {

        this.timezoneCorrection = (new Date().getTimezoneOffset()) / -60; // Divide time zone offset by 60 to get total hours
        this.timeUtil = new Portal.utils.TimeUtil();

        Portal.filter.DateFilter.superclass.constructor.call(this, cfg);
    },

    getSupportedGeoserverTypes: function() {

        return ['date', 'datetime'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.DateFilterPanel;
    },

    getCql: function() {

        return this._getCql(true);
    },

    getDateDataCql: function() {

        return this._getCql(false);
    },

    _getCql: function(useTimeRangeColumnNames) {

        var startColumnName;
        var endColumnName;
        var cql = '';

        if (useTimeRangeColumnNames) {
            startColumnName = this.getWmsStartDateName();
            endColumnName = this.getWmsEndDateName();
        }

        if (this._getFromDate()) {

            cql = String.format(
                "{0} >= '{1}'",
                endColumnName || this.getName(),
                this._getDateString(this._getFromDate())
            );
        }

        if (this._getFromDate() && this._getToDate()) {
            cql += ' AND ';
        }

        if (this._getToDate()) {

            cql += String.format(
                "{0} <= '{1}'",
                startColumnName || this.getName(),
                this._getDateString(this._getToDate())
            );
        }

        return cql;
    },

    getHumanReadableForm: function() {

        var description = OpenLayers.i18n('temporalExtentHeading') + ': ';

        if (this._getFromDate()) {
            description += String.format(">= {0}", this._getDateHumanString(this._getFromDate()));
        }

        if (this._getFromDate() && this._getToDate()) {
            description += ' and ';
        }

        if (this._getToDate()) {
            description += String.format("<= {0}", this._getDateHumanString(this._getToDate()));
        }

        return description;
    },

    _getFromDate: function() {

        return this.getValue().fromDate;
    },

    _getToDate: function() {

        return this.getValue().toDate;
    },

    _getDateString: function(newDate) {

        if (newDate) {
            newDate.setHours(this.timezoneCorrection);
            return this.timeUtil._toUtcIso8601DateString(newDate);
        }

        return '';
    },

    _getDateHumanString: function(newDate) {

        if (newDate) {
            newDate.setHours(this.timezoneCorrection);
            return this._formatHumanDate(newDate);
        }

        return '';
    },

    _formatHumanDate: function(date) {

        return moment(date).format(OpenLayers.i18n('dateTimeDisplayFormat'));
    }
});

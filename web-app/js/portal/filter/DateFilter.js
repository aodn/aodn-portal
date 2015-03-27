/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.DateFilter = Ext.extend(Portal.filter.Filter, {

    // Divide time zone offset by 60 to get total hours
    TIMEZONE_CORRECTION: (new Date().getTimezoneOffset()) / -60,
    TIME_UTIL: new Portal.utils.TimeUtil(),

    getSupportedGeoserverTypes: function() {

        return ['date', 'datetime'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.DateFilterPanel;
    },

    getHumanReadableForm: function() {

        var cql = '';

        if (this._getFromDate()) {
            cql = String.format("{0} >= {1}", "End Date", this._getDateHumanString(this._getFromDate()));
        }

        if (this._getFromDate() && this._getToDate()) {
            cql += ' and ';
        }

        if (this._getToDate()) {
            cql += String.format("{0} <= {1}", "Start Date", this._getDateHumanString(this._getToDate()));
        }

        return cql;
    },

    getDataLayerCql: function() {

        return this._getCql();
    },

    getMapLayerCql: function() {

        return this._getCql(this.getWmsStartDateName(), this.getWmsEndDateName());
    },

    _getCql: function(startColumnName, endColumnName) {

        var cql = '';

        if (this._getFromDate()) {

            cql = String.format(
                "{0} >= '{1}'",
                endColumnName ? endColumnName : this.getName(),
                this._getDateString(this._getFromDate())
            );
        }

        if (this._getFromDate() && this._getToDate()) {
            cql += ' AND ';
        }

        if (this._getToDate()) {

            cql += String.format(
                "{0} <= '{1}'",
                startColumnName ? startColumnName : this.getName(),
                this._getDateString(this._getToDate())
            );
        }

        return cql;
    },

    hasValue: function() {

        return this.getValue() && (this._getFromDate() || this._getToDate());
    },

    _getFromDate: function() {

        return this.getValue().fromDate;
    },

    _getToDate: function() {

        return this.getValue().toDate;
    },

    _getDateString: function(newDate) {

        if (newDate) {
            newDate.setHours(this.TIMEZONE_CORRECTION);
            return this.TIME_UTIL._toUtcIso8601DateString(newDate);
        }

        return '';
    },

    _getDateHumanString: function(newDate) {

        if (newDate) {
            newDate.setHours(this.TIMEZONE_CORRECTION);
            return this._formatHumanDate(newDate);
        }

        return '';
    },

    _formatHumanDate: function(date) {

        return moment(date).format(OpenLayers.i18n('dateTimeDisplayFormat'));
    }
});

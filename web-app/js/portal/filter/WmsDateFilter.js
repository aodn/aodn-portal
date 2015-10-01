/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.WmsDateFilter = Ext.extend(Portal.filter.DateFilter, {

    constructor: function(cfg) {
        Portal.filter.WmsDateFilter.superclass.constructor.call(this, cfg);
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

        if (this._getFromDate() && this._getEndOfToDate()) {
            cql += ' AND ';
        }

        if (this._getEndOfToDate()) {
            cql += String.format(
                "{0} <= '{1}'",
                startColumnName || this.getName(),
                this._getDateString(this._getEndOfToDate())
            );
        }

        return cql;
    },

    getHumanReadableForm: function() {
        var formatKey;

        if (this._getFromDate() && this._getEndOfToDate()) {
            formatKey = 'dateFilterBetweenFormat';
        }
        else if (this._getFromDate()) {

            formatKey = 'dateFilterAfterFormat';
        }
        else {

            formatKey = 'dateFilterBeforeFormat';
        }

        var label = OpenLayers.i18n('temporalExtentHeading');

        if (!this.isPrimary()) {

            label += ' (' + this.getLabel() + ')';
        }

        return String.format(
            OpenLayers.i18n(formatKey),
            label,
            this._getDateHumanString(this._getFromDate()),
            this._getDateHumanString(this._getEndOfToDate())
        );
    },

    _getEndOfToDate: function() {

        var momentDate = moment.utc(this._getToDate());
        if (this._getToDate() && momentDate.isValid()) {
            return momentDate.add(1, 'd').toDate();
        }
    }
});

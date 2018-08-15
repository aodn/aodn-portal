Ext.namespace('Portal.filter');

Portal.filter.DateFilter = Ext.extend(Portal.filter.Filter, {

    hasValue: function() {

        return this.getValue() && (this._getFromDate() || this._getToDate());
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

    getDateValues: function() {
        var vals = {};

        if (this._getFromDate()) {
            vals['fromDate'] = this._getDateString(this._getFromDate());
        }
        if (this._getToDate()) {
            vals['toDate'] = this._getDateString(this._getToDate());
        }
        return vals;
    },

    getHumanReadableForm: function() {
        var formatKey;

        if (this._getFromDate() && this._getToDate()) {

            formatKey = 'dateFilterBetweenFormat';
        }
        else if (this._getFromDate()) {

            formatKey = 'dateFilterAfterFormat';
        }
        else {

            formatKey = 'dateFilterBeforeFormat';
        }

        var label = OpenLayers.i18n('temporalExtentHeading');

        if (!this.isPrimary() && this.getLabel()) {
            label += ' (' + this.getLabel() + ')';
        }

        return String.format(
            OpenLayers.i18n(formatKey),
            label,
            this._getDateHumanString(this._getFromDate()),
            this._getDateHumanString(this._getToDate())
        );
    },

    _getFromDate: function() {

        return this.getValue().fromDate;
    },

    _getToDate: function() {

        return this.getValue().toDate;
    },

    _getDateString: function(newDate) {

        if (newDate) {
            return moment(newDate).toISOString();
        }
        return '';
    },

    _getDateHumanString: function(newDate) {

        if (newDate) {
            return this._formatHumanDate(newDate);
        }

        return '';
    },

    _formatHumanDate: function(date) {

        return moment(date).utc().format(OpenLayers.i18n('dateTimeDisplayFormat'));
    }
});

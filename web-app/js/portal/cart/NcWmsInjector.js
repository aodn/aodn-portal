
Ext.namespace('Portal.cart');

Portal.cart.NcWmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(collection) {
        var filters = collection.getFilters();
        var params = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];

        var areaString = "";
        var dateString = "";

        if (params && params.latitudeRangeStart != undefined) {

            var bboxString = String.format(
                '{0},{1},{2},{3}',
                params.longitudeRangeStart,
                params.latitudeRangeStart,
                params.longitudeRangeEnd,
                params.latitudeRangeEnd
            );
            var bbox = Portal.utils.geo.bboxAsStringToGeometry(bboxString).getPrettyBounds();
            // differs from WMS layers. It will always be a bbox even when a polygon was used by the user
            areaString = String.format('{0}:&nbsp;{1}<br>', OpenLayers.i18n("spatialExtentHeading"), bbox);
        }

        if (params && params.dateRangeStart) {
            var startDateString = this._formatDate(params.dateRangeStart);
            var endDateString = this._formatDate(params.dateRangeEnd);
            dateString = this._formatHumanDateInfo('temporalExtentHeading', startDateString, endDateString);
        }

        if (areaString == "" && dateString == "") {
            areaString = OpenLayers.i18n("emptyDownloadPlaceholder");
        }

        return areaString + dateString;
    },

    _formatHumanDateInfo: function(labelKey, value1, value2) {
        return String.format('{0}:&nbsp;{1} to {2}<br>', OpenLayers.i18n(labelKey), value1, value2);
    },

    _formatDate: function(date) {
        return date.format(OpenLayers.i18n('dateTimeDisplayFormat'));
    }
});

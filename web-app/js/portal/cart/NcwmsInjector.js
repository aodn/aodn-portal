/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NcwmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(collection) {

        var params = collection.ncwmsParams;
        var areaString = "";
        var dateString = "";

        if (params.latitudeRangeStart) {

            var bboxString = String.format(
                '{0},{1},{2},{3}',
                params.longitudeRangeStart,
                params.latitudeRangeStart,
                params.longitudeRangeEnd,
                params.latitudeRangeEnd
            );
            var bbox = Portal.utils.geo.bboxAsStringToBounds(bboxString);
            // differs from WMS layers. It will always be a bbox even when a polygon was used by the user
            areaString = String.format('{0}:&nbsp;{1}<br>', OpenLayers.i18n("spatialExtentHeading"), bbox.toString());
        }

        if (params.dateRangeStart != undefined) {
            var startDateString = this._formatDate(params.dateRangeStart);
            var endDateString = this._formatDate(params.dateRangeEnd);
            dateString = this._formatHumanDateInfo('parameterDateLabel', startDateString, endDateString);
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

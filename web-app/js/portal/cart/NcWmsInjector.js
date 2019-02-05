
Ext.namespace('Portal.cart');

Portal.cart.NcWmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(collection) {

        var filters = collection.getFilters();

        var timeFilter = Portal.filter.FilterUtils.getFilter(filters, 'time');
        var zAxisFilter = Portal.filter.FilterUtils.getFilter(filters, 'zaxis');

        var params = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];

        var timeSeriesAtString = "";
        var areaString = "";
        var dateString = "";
        var zAxisString = "";

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

        var pointFilter = Portal.filter.FilterUtils.getFilter(filters, 'timeSeriesAtPoint');

        if (pointFilter && pointFilter.hasValue()) {
            timeSeriesAtString = pointFilter.getHumanReadableForm();
        }

        if (params) {
            if (params.errorMessage && params.errorMessage.length > 0) {
                dateString = params.errorMessage;
            }
            else if (params.dateRangeStart) {
                var startDateString = this._formatDate(params.dateRangeStart);
                var endDateString = this._formatDate(params.dateRangeEnd);
                dateString = this._formatHumanDateInfo('temporalExtentHeading', startDateString, endDateString);
            }
            else if (!this.hasTemporalExtent(timeFilter, collection)) {
                dateString = OpenLayers.i18n('unavailableTemporalExtent');
            }
            else {
                dateString = OpenLayers.i18n('temporalExtentNotLoaded');
            }
        }

        if (zAxisFilter && zAxisFilter.hasValue()) {
            zAxisString =  zAxisFilter.getHumanReadableForm();
        }

        return areaString + timeSeriesAtString + dateString + zAxisString;
    },

    hasTemporalExtent: function(time, collection) {
        try {
            return (!time || Object.keys(collection.layerAdapter.layerSelectionModel.selectedLayer.temporalExtent.extent) == 0) ? false : true;
        } catch (ex) {
            return true;
        }
    },

    getInjectionJson: function(collection) {
        var injectionJson = Portal.cart.NcWmsInjector.superclass.getInjectionJson(collection);

        injectionJson.dataFilters = this._getDataFilterEntry(collection);

        if (injectionJson.dataFilters.contains(OpenLayers.i18n('temporalExtentNotLoaded'))) {
            injectionJson.errorMessage = OpenLayers.i18n('temporalExtentNotLoaded');
        }
        else if (injectionJson.dataFilters.contains(OpenLayers.i18n('invalidTemporalExtent'))) {
            injectionJson.errorMessage = OpenLayers.i18n('subsetRestrictiveFiltersText');
        }
        injectionJson.isTemporalExtentSubsetted = collection.isTemporalExtentSubsetted;

        return injectionJson;
    },

    _formatHumanDateInfo: function(labelKey, value1, value2) {
        return String.format('{0}:&nbsp;{1} to {2}<br>', OpenLayers.i18n(labelKey), value1, value2);
    },

    _formatDate: function(date) {
        return date.format(OpenLayers.i18n('dateTimeDisplayFormat'));
    }
});

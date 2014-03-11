/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.BodaacDataRowHtml = Ext.extend(Portal.cart.NoDataRowHtml, {

    getDataFilterEntry: function(values) {
        return String.format('<b>{0}</b> {1}', OpenLayers.i18n('filterLabel'), this.getBodaacDateInfo(values.wmsLayer.bodaacFilterParams));
    },

    getBodaacDateInfo: function(dates) {
        if (dates.dateRangeStart) {
            var startDate = moment.utc(dates.dateRangeStart).toUtcDisplayFormat();
            var endDate = moment.utc(dates.dateRangeEnd).toUtcDisplayFormat();
            return String.format('<code> {0} {1} and {2}</code>', OpenLayers.i18n('timeRangeLabel'), startDate, endDate);
        }
        else {
            return OpenLayers.i18n('timeRangeCalculating');
        }
    },

    createMenuItems: function(collection) {
        var menuItems = [];

        menuItems.push({
            text: OpenLayers.i18n('downloadAsUrlsLabel'),
            handler: this._urlListDownloadHandler(collection),
            scope: this
        });
        menuItems.push({
            text: OpenLayers.i18n('downloadAsNetCdfLabel'),
            handler: this._netCdfDownloadHandler(collection),
            scope: this
        });

        return menuItems;
    },

    getDataSpecificMarkup: function(values) {
        var estimator = new Portal.cart.DownloadEstimator();
        estimator._getDownloadEstimate(
            values,
            this._bodaacCsvDownloadUrl(values)
        );

        return String.format(
            "<div id=\"{0}\">{1}{2}</div>",
            estimator.getIdElementName(values.uuid),
            OpenLayers.i18n("estimatedDlLoadingMessage"),
            OpenLayers.i18n("estimatedDlLoadingSpinner")
        );
    },

    _cql: function(wmsLayer) {
        return wmsLayer.getWmsDownloadFilter();
    },

    _downloadWfsHandler: function(collection, format) {
        return this.downloadWithConfirmation(this._wfsDownloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    _urlListDownloadHandler: function(collection) {
        var additionalArgs = {
            action: 'urlListForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return this.downloadWithConfirmation(
            this._bodaacCsvDownloadUrl(collection),
            String.format("{0}_URLs.txt", collection.title),
            additionalArgs
        );
    },

    _netCdfDownloadHandler: function(collection) {
        var additionalArgs = {
            action: 'downloadNetCdfFilesForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return this.downloadWithConfirmation(
            this._bodaacCsvDownloadUrl(collection),
            String.format("{0}_source_files.zip", collection.title),
            additionalArgs
        );
    },

    _bodaacCsvDownloadUrl: function(collection) {
        return this._wfsDownloadUrl(collection.wmsLayer, 'csv');
    },

    _wfsDownloadUrl: function(layer, format) {
        return layer.getWfsLayerFeatureRequestUrl(format);
    }
});

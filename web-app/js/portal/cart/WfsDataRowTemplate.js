/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.WfsDataRowTemplate = Ext.extend(Portal.cart.NoDataRowTemplate, {

    getDataFilterEntry: function(values) {
        var html;
        var infoLabel;
        var layerValues;

        if (values.wmsLayer && values.wmsLayer.bodaacFilterParams) {

            html = '<b>{0}</b> {1}';
            infoLabel = OpenLayers.i18n('filterLabel');
            layerValues = this.getBodaacDateInfo(values.wmsLayer.bodaacFilterParams);
        }
        else {
            if (this._cql(values.wmsLayer)) {
                html = '<b>{0}</b> <code>{1}</code>';
                infoLabel = OpenLayers.i18n('filterLabel');
                layerValues = this._cql(values.wmsLayer);
            }
            else {
                html = '<i>{0}</i> <code>{1}</code>';
                infoLabel = OpenLayers.i18n('noFilterLabel');
                layerValues = '';
            }
        }
        return String.format(html, infoLabel, layerValues);
    },

    getBodaacDateInfo: function(dates) {
        if (dates.dateRangeStart) {
            var startDate = moment.utc(dates.dateRangeStart).format('YYYY-MM-DD HH:mm:ss:SSS UTC');
            var endDate = moment.utc(dates.dateRangeEnd).format('YYYY-MM-DD HH:mm:ss:SSS UTC');
            return String.format('<code> {0} {1}(UTC) and {2}(UTC)</code>', OpenLayers.i18n('timeRangeLabel'), startDate, endDate);
        }
        else {
            return OpenLayers.i18n('timeRangeCalculating');
        }
    },

    createMenuItems: function(collection) {
        var menuItems = [];

        // BODAAC hack.
        if (collection.wmsLayer && collection.wmsLayer.isNcwms()) {
            menuItems.push({
                text: OpenLayers.i18n('downloadAsUrlsLabel'),
                handler: this._urlListDownloadHandler(collection, true),
                scope: this
            });
            menuItems.push({
                text: OpenLayers.i18n('downloadAsNetCdfLabel'),
                handler: this._netCdfDownloadHandler(collection, true),
                scope: this
            });
        }
        else {
            if (collection.wmsLayer.wfsLayer) {
                menuItems.push({
                    text: OpenLayers.i18n('downloadAsCsvLabel'),
                    handler: this._downloadWfsHandler(collection, 'csv'),
                    scope: this
                });
            }

            if (collection.wmsLayer.urlDownloadFieldName) {
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
            }
        }

        return menuItems;
    },

    getDataSpecificMarkup: function(values) {
        this.estimator = new Portal.cart.DownloadEstimator();
        this.estimator._getDownloadEstimate(values);
        return '<div id="downloadEst' + values.uuid + '">' + OpenLayers.i18n("estimatedDlLoadingMessage") + OpenLayers.i18n("estimatedDlLoadingSpinner") + '</div>';
    },

    _cql: function(wmsLayer) {
        return wmsLayer.getWmsDownloadFilter();
    },

    _downloadWfsHandler: function(collection, format) {
        return this.downloadWithConfirmation(this._wfsDownloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    _urlListDownloadHandler: function(collection, downloadWfs) {
        var additionalArgs = {
            action: 'urlListForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        var downloadUrl = downloadWfs ? this._wfsDownloadUrl(collection.wmsLayer, 'csv') : this._wmsDownloadUrl(collection.wmsLayer, 'csv');

        return this.downloadWithConfirmation(downloadUrl, String.format("{0}_URLs.txt", collection.title), additionalArgs);
    },

    _netCdfDownloadHandler: function(collection, downloadWfs) {
        var additionalArgs = {
            action: 'downloadNetCdfFilesForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        var downloadUrl = downloadWfs ? this._wfsDownloadUrl(collection.wmsLayer, 'csv') : this._wmsDownloadUrl(collection.wmsLayer, 'csv');

        return this.downloadWithConfirmation(downloadUrl, String.format("{0}_source_files.zip", collection.title), additionalArgs);
    },

    _wfsDownloadUrl: function(layer, format) {
        return layer.getWfsLayerFeatureRequestUrl(format);
    },

    _wmsDownloadUrl: function(layer, format) {
        return layer.getWmsLayerFeatureRequestUrl(format);
    }
});

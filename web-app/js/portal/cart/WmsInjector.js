/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Object, {

    constructor: function(config) {
        Portal.cart.WmsInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    getInjectionJson: function(collection) {

        var injectionJson = {
            uuid: collection.uuid,
            title: collection.title,
            dataFilters: this._getDataFilterEntry(collection),
            dataMarkup: this._getDataMarkup(collection),
            downloadableLinks: this._getMetadataLinks(collection),
            pointOfTruthLink: this._getPointOfTruthLink(collection),
            menuItems: this._createMenuItems(collection)
        };

        return injectionJson;
    },

    _getDataFilterEntry: function(collection) {

        var html;
        var infoLabel;
        var layerValues;

        if (this._cql(collection.wmsLayer)) {
            html = '<b>{0}</b> <code>{1}</code>';
            infoLabel = OpenLayers.i18n('filterLabel');
            layerValues = this._cql(collection.wmsLayer);
        }
        else {
            html = '<i>{0}</i> <code>{1}</code>';
            infoLabel = OpenLayers.i18n('noFilterLabel');
            layerValues = '';
        }
        return String.format(html, infoLabel, layerValues);
    },

    _cql: function(wmsLayer) {

        return wmsLayer.getWmsDownloadFilter();
    },

    _getDataMarkup: function(collection) {

        var estimator = new Portal.cart.DownloadEstimator();
        estimator._getDownloadEstimate(
            collection,
            this._csvDownloadUrl(collection)
        );

        return String.format(
            "<div id=\"{0}\">{1}{2}</div>",
            estimator.getIdElementName(collection.uuid),
            OpenLayers.i18n("estimatedDlLoadingMessage"),
            OpenLayers.i18n("estimatedDlLoadingSpinner")
        );
    },

    _createMenuItems: function(collection) {

        var menuItems = [];

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
                text: OpenLayers.i18n('downloadAsAllSourceNetCdfLabel'),
                handler: this._netCdfDownloadHandler(collection),
                scope: this
            });
        }

        return menuItems;
    },

    _urlListDownloadHandler: function(collection) {

        var additionalArgs = {
            action: 'urlListForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return this.downloadWithConfirmation(
            this._csvDownloadUrl(collection),
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
            this._csvDownloadUrl(collection),
            String.format("{0}_source_files.zip", collection.title),
            additionalArgs
        );
    },

    _csvDownloadUrl: function(collection) {

        return this._wmsDownloadUrl(collection.wmsLayer, 'csv');
    },

    _wmsDownloadUrl: function(layer, format) {

        return layer.getWmsLayerFeatureRequestUrl(format);
    },

    _wfsDownloadUrl: function(layer, format) {

        return layer.getWfsLayerFeatureRequestUrl(format);
    },

    _getMetadataLinks: function(collection) {

        return collection.downloadableLinks;
    },

    _getPointOfTruthLink: function(collection) {

        return collection.pointOfTruthLink;
    },

    _downloadWfsHandler: function(collection, format) {

        return this.downloadWithConfirmation(this._wfsDownloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    downloadWithConfirmation: function(downloadUrl, downloadFilename, downloadControllerArgs) {

        return function () {
            this.downloadConfirmation.call(this.downloadConfirmationScope, downloadUrl, downloadFilename, downloadControllerArgs);
        };
    }
});

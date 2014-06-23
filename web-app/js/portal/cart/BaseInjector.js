/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.BaseInjector = Ext.extend(Object, {
    constructor: function(config) {
        Portal.cart.BaseInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    getInjectionJson: function(collection) {

        var injectionJson = {
            uuid: collection.uuid,
            title: collection.title,
            dataFilters: this._getDataFilterEntry(collection),
            dataMarkup: this._getDataMarkup(collection),
            linkedFiles: this._getMetadataLinks(collection),
            pointOfTruthLink: this._getPointOfTruthLink(collection),
            menuItems: this._createMenuItems(collection)
        };

        return injectionJson;
    },

    _urlListDownloadHandler: function(collection) {
        return this.downloadWithConfirmation(
            collection,
            this._downloadUrl,
            this._getUrlListDownloadParams(collection)
        );
    },

    _netCdfDownloadHandler: function(collection) {
        return this.downloadWithConfirmation(
            collection,
            this._downloadUrl,
            this._getNetCdfDownloadParams(collection)
        );
    },

    _downloadUrl: function() {
        throw {
            name: 'Not Implemented Exception',
            message: 'Subclasses must implement this function.'
        }
    },

    _addDownloadEstimate: function(collection) {

        var estimator = new Portal.cart.DownloadEstimator();

        estimator._getDownloadEstimate(
            collection,
            this._downloadUrl(collection)
        );

        return String.format(
            "<div id=\"{0}\">{1}{2}</div>",
            estimator.getIdElementName(collection.uuid),
            OpenLayers.i18n("estimatedDlLoadingMessage"),
            OpenLayers.i18n("estimatedDlLoadingSpinner")
        );
    },

    _getUrlListDownloadParams: function(collection) {
        return this._getDownloadParams(collection, 'urlListForLayer', "{0}_URLs.txt");
    },

    _getNetCdfDownloadParams: function(collection) {
        return this._getDownloadParams(collection, 'downloadNetCdfFilesForLayer', "{0}_source_files.zip");
    },

    _getDownloadParams: function(collection, action, filenameFormat, fileFormat) {
        var downloadControllerArgs = {
            action: action,
            layerId: collection.wmsLayer.grailsLayerId
        };

        return {
            format: fileFormat,
            filenameFormat: filenameFormat,
            downloadControllerArgs: downloadControllerArgs
        };
    },

    _wmsDownloadUrl: function(collection, params) {

        return collection.wmsLayer.getWmsLayerFeatureRequestUrl(params.format);
    },

    _wfsDownloadUrl: function(collection, params) {

        var wfsServerUrl = collection.wmsLayer.wfsLayer.server.uri.replace("/wms", "/wfs");

        return collection.wmsLayer.getWfsLayerFeatureRequestUrl(wfsServerUrl, collection.wmsLayer.wfsLayer.name, params.format);
    },

    _getMetadataLinks: function(collection) {
        return collection.linkedFiles;
    },

    _getPointOfTruthLink: function(collection) {
        return collection.pointOfTruthLink;
    },

    downloadWithConfirmation: function(collection, generateUrlCallback, params) {

        return function () {
            this.downloadConfirmation.call(
                this.downloadConfirmationScope,
                collection,
                this,
                generateUrlCallback,
                params
            );
        };
    }
});

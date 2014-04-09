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
            downloadableLinks: this._getMetadataLinks(collection),
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

    _getUrlListDownloadParams: function(collection) {
        return this._getDownloadParams(collection, 'urlListForLayer', "{0}_URLs.txt");
    },

    _getNetCdfDownloadParams: function(collection) {
        return this._getDownloadParams(collection, 'downloadNetCdfFilesForLayer', "{0}_source_files.zip");
    },

    _getDownloadParams: function(collection, action, fileNameFormat, fileFormat) {
        var downloadControllerArgs = {
            action: action,
            layerId: collection.wmsLayer.grailsLayerId
        };

        return {
            format: fileFormat,
            fileNameFormat: fileNameFormat,
            downloadControllerArgs: downloadControllerArgs
        };
    },

    _wmsDownloadUrl: function(collection, params) {

        return collection.wmsLayer.getWmsLayerFeatureRequestUrl(params.format);
    },

    _wfsDownloadUrl: function(collection, params) {

        return collection.wmsLayer.getWfsLayerFeatureRequestUrl(params.format);
    },

    _getMetadataLinks: function(collection) {
        return collection.downloadableLinks;
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

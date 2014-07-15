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
            pointOfTruthLink: this._getPointOfTruthLink(collection)
        };

        return injectionJson;
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

    _wmsDownloadUrl: function(collection, params) {

        var wmsLayer = collection.wmsLayer;

        return wmsLayer.getFeatureRequestUrl(
            wmsLayer.server.uri,
            wmsLayer.params.LAYERS,
            params.format
        );
    },

    _wfsDownloadUrl: function(collection, params) {

        var wfsServerUrl = collection.wmsLayer.wfsLayer.server.uri.replace("/wms", "/wfs");

        return collection.wmsLayer.getFeatureRequestUrl(wfsServerUrl, collection.wmsLayer.wfsLayer.name, params.format);
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

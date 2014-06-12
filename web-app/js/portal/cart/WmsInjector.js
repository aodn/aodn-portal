/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    constructor: function(config) {
        Portal.cart.WmsInjector.superclass.constructor.call(this, Ext.apply(this, config));
        this._downloadUrl = this._csvDownloadUrl;
    },

    _getDataFilterEntry: function(collection) {

        var layerValues = collection.wmsLayer.getWmsDownloadFilterDescriptions();

        return  (layerValues != "") ? layerValues : OpenLayers.i18n('emptyDownloadPlaceholder');

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
                handler: this._wfsDownloadHandler(collection),
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

    _csvDownloadUrl: function(collection) {

        return this._wmsDownloadUrl(collection, { format: 'csv' });
    },

    _wfsDownloadHandler: function(collection) {

        return this.downloadWithConfirmation(
            collection,
            this._wfsDownloadUrl,
            this._getDownloadParams(collection, '', "{0}.csv", 'csv')
        );
    }
});

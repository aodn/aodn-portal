/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.cart');

Portal.cart.InsertionService = Ext.extend(Object, {

    constructor: function(downloadPanel) {

        this.downloadPanel = downloadPanel;
    },

    insertionValues: function(collection) {

        var config = {
            downloadConfirmation: this.downloadWithConfirmation,
            downloadConfirmationScope: this
        };

        var wmsLayer = collection.wmsLayer;
        var htmlInjection;

        if (this._isCollectionDownloadable(collection)) {
            if (wmsLayer.isNcwms()) {
                htmlInjection = this._getNcwmsInjector(config);
            }
            else {
                htmlInjection = this._getWmsInjector(config);
            }
        }
        else {
            htmlInjection = this._getNoDataInjector(config);
        }

        return htmlInjection.getInjectionJson(collection);
    },

    _isCollectionDownloadable: function(collection) {
        return collection.dataDownloadHandlers && (collection.dataDownloadHandlers.length > 0);
    },

    _getNcwmsInjector: function(config) {

        if (!this.ncwmsInjector) {
            this.ncwmsInjector = new Portal.cart.NcwmsInjector(config);
        }

        return this.ncwmsInjector;
    },

    _getWmsInjector: function(config) {

        if (!this.wmsInjector) {
            this.wmsInjector = new Portal.cart.WmsInjector(config);
        }

        return this.wmsInjector;
    },

    _getNoDataInjector: function(config) {

        if (!this.noDataInjector) {
            this.noDataInjector = new Portal.cart.NoDataInjector(config);
        }

        return this.noDataInjector;
    },

    downloadWithConfirmation: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {
        this.downloadPanel.confirmDownload(collection, generateUrlCallbackScope, generateUrlCallback, params);
    }
});

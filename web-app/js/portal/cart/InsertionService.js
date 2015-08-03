/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.InsertionService = Ext.extend(Object, {

    constructor: function(downloadPanel) {

        this.downloadPanel = downloadPanel;
    },

    insertionValues: function(collection) {

        var config = {
            downloadConfirmation: this.downloadWithConfirmation,
            downloadConfirmationScope: this
        };

        var wmsLayer = collection.getSelectedLayer();
        var htmlInjection;

        // Todo - DN: Review this code. If we consolidate ncwms and wms filtering this should be the same
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
        return collection.getDataDownloadHandlers().length > 0;
    },

    _getNcwmsInjector: function(config) { // Todo - DN: I think this can go.

        if (!this.ncwmsInjector) {
            this.ncwmsInjector = new Portal.cart.NcwmsInjector(config);
        }

        return this.ncwmsInjector;
    },

    _getWmsInjector: function(config) { // Todo - DN: I think this can go.

        if (!this.wmsInjector) {
            this.wmsInjector = new Portal.cart.WmsInjector(config);
        }

        return this.wmsInjector;
    },

    _getNoDataInjector: function(config) { // Todo - DN: I think this can go.

        if (!this.noDataInjector) {
            this.noDataInjector = new Portal.cart.NoDataInjector(config);
        }

        return this.noDataInjector;
    },

    downloadWithConfirmation: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {
        this.downloadPanel.confirmDownload(collection, generateUrlCallbackScope, generateUrlCallback, params);
    }
});

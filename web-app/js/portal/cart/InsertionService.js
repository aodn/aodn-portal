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

        var injector;

        if (this._hasData(collection)) {
            if (this._isNcwms(collection)) {
                injector = this._getNcwmsInjector(config);
                injector.attachMenuEvents(collection);
            }
            else {
                injector = this._getWmsInjector(config);
            }
        }
        else {
            injector = this._getNoDataInjector(config);
        }

        return injector.getInjectionJson(collection);

    },

    _isNcwms: function(collection) {

        return collection.wmsLayer.isNcwms();
    },

    _hasData: function(collection) {

        return collection.wmsLayer.wfsLayer;
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

    downloadWithConfirmation: function (downloadUrl, downloadFilename, downloadControllerArgs) {

        this.downloadPanel.confirmDownload(downloadUrl, downloadFilename, downloadControllerArgs);
    }
});

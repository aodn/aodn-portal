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

        var htmlInjection;

        if (this._hasData(collection)) {
            if (this._isNcwms(collection)) {
                htmlInjection = this._getNcwmsInjector(config, collection);
            }
            else {
                htmlInjection = this._getWmsInjector(config, collection);
            }
        }
        else {
            htmlInjection = this._getNoDataInjector(config, collection);
        }

        return htmlInjection;

    },

    _isNcwms: function(collection) {

        return collection.wmsLayer.isNcwms();
    },

    _hasData: function(collection) {

        return collection.wmsLayer.wfsLayer;
    },

    _getNcwmsInjector: function(config, collection) {

        if (!this.ncwmsInjector) {
            this.ncwmsInjector = new Portal.cart.NcwmsInjector(config);
            this.ncwmsInjector.attachMenuEvents(collection);
        }

        return this.ncwmsInjector.getInjectionJson(collection);
    },

    _getWmsInjector: function(config, collection) {

        if (!this.wmsInjector) {
            this.wmsInjector = new Portal.cart.WmsInjector(config);
        }

        return this.wmsInjector.getInjectionJson(collection);
    },

    _getNoDataInjector: function(config, collection) {

        if (!this.noDataInjector) {
            this.noDataInjector = new Portal.cart.NoDataInjector(config);
        }

        return this.noDataInjector.getInjectionJson(collection);
    },

    downloadWithConfirmation: function (downloadUrl, downloadFilename, downloadControllerArgs) {

        this.downloadPanel.confirmDownload(downloadUrl, downloadFilename, downloadControllerArgs);
    }
});

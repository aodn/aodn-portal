/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.InsertionService = Ext.extend(Object, {

    returnStringInjectionForLayer: function(collection) {

        var injector;

        if (this._hasData(collection)) {
            if (this._isNcwms(collection)) {
                injector = this._getNcwmsInjector();
            }
            else {
                injector = this._getWmsInjector();
            }
        }
        else {
            injector = this._getNoDataInjector();
        }

        return injector.getInjectionJson(collection);

    },

    _isNcwms: function(collection) {

        return collection.wmsLayer.isNcwms();
    },

    _hasData: function(collection) {

        return collection.wmsLayer.wfsLayer;
    },

    _getNcwmsInjector: function(collection) {

        if (!this.ncwmsInjector) {
            this.ncwmsInjector = new Portal.cart.NcwmsInjector();
        }

        return this.ncwmsInjector;
    },

    _getWmsInjector: function(collection) {

        if (!this.wmsInjector) {
            this.wmsInjector = new Portal.cart.WmsInjector();
        }

        return this.wmsInjector;
    },

    _getNoDataInjector: function(collection) {

        if (!this.noDataInjector) {
            this.noDataInjector = new Portal.cart.NoDataInjector();
        }

        return this.noDataInjector;
    }
});

/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WfsDownloadHandler = Ext.extend(Object, {

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsCsvLabel',
                handler: this._getClickHandler(),
                handlerParams: {
                    filenameFormat: "{0}.csv"
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this.onlineResource.name && this.onlineResource.name != "";
    },

    _getClickHandler: function() {

        var layerName = this.onlineResource.name;

        return function(collection) {
            return collection.wmsLayer.getWfsLayerFeatureRequestUrl(layerName, 'csv');
        };
    }
});

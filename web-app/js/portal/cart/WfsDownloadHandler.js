/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.cart.WfsDownloadHandler = Ext.extend(Object, {

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        return [{
            textKey: 'downloadAsCsvLabel',
            handler: this._getClickHandler(),
            handlerParams: {
                filenameFormat: "{0}.csv"
            }
        }];
    },

    _getClickHandler: function() {

        var layerName = this.onlineResource.name;

        return function(collection) {
            return collection.wmsLayer.getWfsLayerFeatureRequestUrl(layerName, 'csv');
        };
    }
});

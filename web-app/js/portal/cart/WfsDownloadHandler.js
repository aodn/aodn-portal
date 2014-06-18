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

    getDownloadOptions: function(collection) { // TODO - DN: Can we know about the collection already?

        return [{
            textKey: 'downloadAsCsvLabel',
            handler: this._getClickHandler(collection),
            handlerParams: {
                filenameFormat: "{0}.csv",
                downloadControllerArgs: { // TODO - DN: Refactor this out into a separate params object?
                    action: ''
                }
            }
        }];
    },

    _getClickHandler: function(collection) {

        var layerName = this.onlineResource.name;
        var _collection = collection;

        return function() {
            return _collection.wmsLayer.getWfsLayerFeatureRequestUrl(layerName, 'csv');
        };
    }
});

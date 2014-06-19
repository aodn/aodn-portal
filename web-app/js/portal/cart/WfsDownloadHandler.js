/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.cart.WfsDownloadHandler = Ext.extend(Object, {

    constructor: function(onlineResource) {

        console.log('WfsDownloadHandler constructed');

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function(collection) { // TODO - DN: Can we know about the collection already?
        console.log('Getting download options');

        return [{
            textKey: 'downloadAsCsvLabel',
            handler: this._getClickHandler(collection),
            handlerParams: {
                filenameFormat: "{0}.csv",
                format: 'BET THIS IS NOT USED',
                downloadControllerArgs: { // TODO - DN: Refactor this out into a separate params object?
                    action: '',
                    layerId: '-1' // TODO - DN: What to do about this?
                }
            }
        }];
    },

    _getClickHandler: function(collection) {

        console.log('_getClickHandler()');

        var layerName = this.onlineResource.name;
        var _collection = collection;

        return function() {
            console.log('anon fn called');

            console.log(_collection.wmsLayer.getWfsLayerFeatureRequestUrl(layerName, 'csv'));
            return _collection.wmsLayer.getWfsLayerFeatureRequestUrl(layerName, 'csv');
        };
    }
});

/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WfsDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

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

        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty();
    },

    _getClickHandler: function() {

        var _this = this;

        return function(collection) {
            return collection.wmsLayer.getWfsLayerFeatureRequestUrl(
                _this._resourceHref(),
                _this._resourceName(),
                OpenLayers.Layer.DOWNLOAD_FORMAT_CSV_WITH_METADATA
            );
        };
    }
});

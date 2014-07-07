/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.BodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    NAME_FIELD_DELIMETER: "|",
    LAYER_NAME_INDEX: 0,
    FIELD_NAME_INDEX: 1,

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsAllSourceNetCdfLabel',
                handler: this._getClickHandler(),
                handlerParams: {
                    filenameFormat: '{0}_source_files.zip',
                    downloadControllerArgs: {
                        action: 'downloadNetCdfFilesForLayer'
                    }
                }
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getClickHandler(),
                handlerParams: {
                    filenameFormat: '{0}_URLs.txt',
                    downloadControllerArgs: {
                        action: 'urlListForLayer'
                    }
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return true; // Currently not using info from the metadata record
    },

    _getClickHandler: function() {

        return function(collection, params) {

            var wmsLayer = collection.wmsLayer;
            var wfsLayer = wmsLayer.wfsLayer;

            params.downloadControllerArgs.layerId = wmsLayer.grailsLayerId;

            return collection.wmsLayer._buildGetFeatureRequestUrl(
                wfsLayer.server.uri.replace("/wms", "/wfs"),
                wfsLayer.name,
                'csv',
                wmsLayer.getDownloadFilter()
            );
        };
    }
});

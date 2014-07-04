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
                textKey: 'downloadAllSourceFilesLabel',
                handler: this._getClickHandler(),
                handlerParams: {
                    filenameFormat: '{0}_source_files.zip',
                    downloadControllerArgs: {
                        action: 'downloadNetCdfFilesForLayer',
                        layerId: null
                        /*serverUrl: this._resourceHref(),
                        urlFieldName: this._urlFieldName()*/
                    }
                }
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getClickHandler(),
                handlerParams: {
                    filenameFormat: '{0}_URLs.txt',
                    downloadControllerArgs: {
                        action: 'urlListForLayer',
                        layerId: null
                        /*serverUrl: this._resourceHref(),
                        urlFieldName: this._urlFieldName()*/
                    }
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        /*return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty() && (this._resourceName().indexOf(this.NAME_FIELD_DELIMETER) > -1);*/

        return true; // Currently not using info from the metadata record
    },

    _getClickHandler: function() {

        /*var _this = this;*/

        return function(collection, params) {

            var wmsLayer = collection.wmsLayer;
            var wfsLayer = wmsLayer.wfsLayer;

            params.downloadControllerArgs.layerId = wmsLayer.grailsLayerId;

            return collection.wmsLayer._buildGetFeatureRequestUrl(
                /*_this._resourceHref(),
                _this._layerName(),*/
                wfsLayer.server.uri.replace("/wms", "/wfs"),
                wfsLayer.name,
                'csv',
                wmsLayer.getDownloadFilter()
            );
        };
    }/*,

    _layerName: function() {
        return this._valueFromNameField(this.LAYER_NAME_INDEX);
    },

    _urlFieldName: function() {
        return this._valueFromNameField(this.FIELD_NAME_INDEX);
    },

    _valueFromNameField: function(index) {

        return this.onlineResource.name.split("|")[index];
    }*/
});

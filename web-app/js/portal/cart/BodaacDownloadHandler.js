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
                        /*serverUrl: this._serverUrl(),
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
                        /*serverUrl: this._serverUrl(),
                        urlFieldName: this._urlFieldName()*/
                    }
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        /*var theName = this.onlineResource.name;

        return theName && (theName.indexOf(this.NAME_FIELD_DELIMETER) > -1);*/

        return true; // Currently not using info from the metadata record
    },

    _getClickHandler: function() {

        /*var _this = this;*/

        return function(collection, params) {

            console.log('_getUrlListClickHandler - params');
            console.log(params);

            collection.wmsLayer._buildGetFeatureRequestUrl(
                /*_this._serverUrl(),
                _this._layerName(),*/
                collection.wmsLayer.wfsLayer.server.uri.replace("/wms", "/wfs"),
                collection.wmsLayer.wfsLayer.name,
                'csv',
                collection.wmsLayer.getDownloadFilter()
            );
        };
    }/*,

    _layerName: function() {
        return this._valueFromNameField(this.LAYER_NAME_INDEX);
    },

    _urlFieldName: function() {
        return this._valueFromNameField(this.FIELD_NAME_INDEX);
    },

    _serverUrl: function() {
        return this.onlineResource.href;
    },

    _valueFromNameField: function(index) {

        return this.onlineResource.name.split("|")[index];
    }*/
});

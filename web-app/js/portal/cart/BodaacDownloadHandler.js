/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.BodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    LAYER_NAME_INDEX: 0,
    COLUMN_NAME_INDEX: 1,

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            //         var columnName = this._valueFromNameField(this.COLUMN_NAME_INDEX);

            downloadOptions.push({
                textKey: 'downloadAllSourceFilesLabel',
                handler: this._getFileDownloadClickHandler(),
                handlerParams: {
                    asdf: 'yerp'
                }              /*
                this._getDownloadParams(collection, 'downloadNetCdfFilesForLayer', "{0}_source_files.zip")
                */
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getUrlListClickHandler()            /*
                 this._getDownloadParams(collection, 'urlListForLayer', "{0}_URLs.txt")
                 */
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this.onlineResource.name && this.onlineResource.name != "";
    },

    _getUrlListClickHandler: function() {

        var layerName = this._valueFromNameField(this.LAYER_NAME_INDEX);
        var serverUrl = this.onlineResource.href;

        return function(collection, params) {

            alert('BODAAC, yo!');

            console.log('_getUrlListClickHandler - params');
            console.log(params);

            collection.wmsLayer._buildGetFeatureRequestUrl(
                serverUrl,
                layerName,
                'csv',
                collection.wmsLayer.getDownloadFilter()
            );
        };
    },

    _getFileDownloadClickHandler: function() {

        var layerName = this._valueFromNameField(this.LAYER_NAME_INDEX);

        var serverUrl = this.onlineResource.href;

        return function(collection, params) {

            alert('BODAAC, yo!');

            console.log('_getFileDownloadClickHandler - params');
            console.log(params);

            return collection.wmsLayer._buildGetFeatureRequestUrl(
                serverUrl,
                layerName,
                'csv',
                collection.wmsLayer.getDownloadFilter()
            );
        };
    },

    _valueFromNameField: function(index) {

        return this.onlineResource.name.split("|")[index];
    },

    _getDownloadParams: function(collection, action, filenameFormat, fileFormat) {

        var downloadControllerArgs = {
            action: action,
            layerId: collection.wmsLayer.grailsLayerId
        };

        return {
            format: fileFormat,
            filenameFormat: filenameFormat,
            downloadControllerArgs: downloadControllerArgs
        };
    }
});

/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.BodaacDownloadHandler = Ext.extend(Object, {

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAllSourceFilesLabel',
                handler: this._getFileDownloadClickHandler()
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getUrlListClickHandler()
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this.onlineResource.name && this.onlineResource.name != "";
    },

    _getUrlListClickHandler: function() {

        var productId = this.onlineResource.name;
        var serverUrl = this.onlineResource.href;

        var _this = this;

        return function(collection, params) {

            alert('BODAAC, yo!');

            /*
             this._getDownloadParams(collection, 'urlListForLayer', "{0}_URLs.txt")
             */

            collection.wmsLayer._buildGetFeatureRequestUrl(
                serverUrl,
                collection.wmsLayer.wfsLayer.name, // TODO - DN: Oh noes!
                'csv',
                collection.wmsLayer.getDownloadFilter()
            );
        };
    },

    _getFileDownloadClickHandler: function() {

        var productId = this.onlineResource.name;
        var serverUrl = this.onlineResource.href;

        var _this = this;

        return function(collection, params) {

            alert('BODAAC, yo!');

            /*
             this._getDownloadParams(collection, 'downloadNetCdfFilesForLayer', "{0}_source_files.zip")
             */

            collection.wmsLayer._buildGetFeatureRequestUrl(
                serverUrl,
                collection.wmsLayer.wfsLayer.name, // TODO - DN: Oh noes!
                'csv',
                collection.wmsLayer.getDownloadFilter()
            );
        };
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

Ext.namespace('Portal.cart');

Portal.cart.ALADownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'CSV',
                handler: this._getUrlGeneratorFunction('csv'),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadAlaAction'),
                    filenameFormat: '{0}.csv.zip',
                    downloadControllerArgs: {
                        action: 'passThrough'
                    }
                }
            });

            downloadOptions.push({
                textKey: 'CSV+SHP',
                handler: this._getUrlGeneratorFunction('shp'),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadAlaAction'),
                    filenameFormat: '{0}.shp.zip',
                    downloadControllerArgs: {
                        action: 'passThrough'
                    }
                }
            });
        }
        return downloadOptions;
    },

    _showDownloadOptions: function(filters) {

        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty()
            && !Portal.filter.FilterUtils.hasFilter(filters, 'timeSeriesAtPoint');
    },

    _getUrlGeneratorFunction: function(format) {

        var _this = this;

        return function(collection) {

            var builder = new Portal.filter.combiner.ALAParametersBuilder({
                filters: collection.getFilters()
            });

            return _this.buildRequestUrl(
                _this.onlineResource.href,
                format,
                builder.buildParameterString()
            );
        };
    },

    buildRequestUrl: function(baseUrl, outputFormat, downloadParameterString) {

        var downloadUrl = baseUrl;
        downloadUrl += (downloadUrl.indexOf('?') !== -1) ? "&" : "?";
        downloadUrl += '&fileType=' + outputFormat;
        downloadUrl += '&reasonTypeId=' + 4;
        //downloadUrl += '&sourceTypeId=' + 8; // AODN will need to be assigned a number by ALA

        downloadUrl += downloadParameterString;

        return downloadUrl;
    }
});

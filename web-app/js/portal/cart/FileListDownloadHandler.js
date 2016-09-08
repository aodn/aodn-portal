Ext.namespace('Portal.cart');

Portal.cart.FileListDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: this.onlineResource.name,
                type: 'WFS',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    filenameFormat: '{0}_source_files.zip',
                    downloadControllerArgs: {
                        action: 'downloadFilesForLayer',
                        urlFieldName: this._urlFieldName()
                    }
                }
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    filenameFormat: '{0}_URLs.txt',
                    downloadControllerArgs: {
                        action: 'urlListForLayer',
                        urlFieldName: this._urlFieldName()
                    }
                }
            });
        }

        return downloadOptions;
    },

    canEstimateDownloadSize: function() {
        return true;
    },

    getDownloadEstimateParams: function(collection) {

        var urlFn = this._getUrlGeneratorFunction();

        return {
            url: urlFn(collection),
            urlFieldName: this._urlFieldName()
        };
    },

    _showDownloadOptions: function(filters) {

        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty()
            && !Portal.filter.FilterUtils.hasFilter(filters, 'timeSeriesAtPoint');
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection) {

            var builder = new Portal.filter.combiner.FileListCqlBuilder({
                filters: collection.getFilters()
            });

            return OpenLayers.Layer.WMS.buildGetFeatureRequestUrl(
                _this._baseUrl(),
                _this._layerName(),
                _this.onlineResource.name,
                builder.buildCql()
            );
        };
    },

    _layerName: function() {
        return Ext.urlDecode(this.onlineResource.href.split("?")[1]).typeName;
    },

    _urlFieldName: function() {
        return Ext.urlDecode(this.onlineResource.href.split("?")[1]).propertyName;
    },

    _baseUrl: function() {
        return this.onlineResource.href.split("?")[0];
    }

});

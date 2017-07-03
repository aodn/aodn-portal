Ext.namespace('Portal.cart');

Portal.cart.PythonDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function() {
        var downloadOptions = [];

        if (this._showDownloadOptions()) {

            downloadOptions.push({
                textKey: 'downloadAsPythonSnippetLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadPythonAction'),
                    filenameFormat: "{0}.py",
                    downloadControllerArgs: {
                        action: 'downloadPythonSnippet'
                    }
                }
            });
        }

        return downloadOptions;
    },

    _showDownloadOptions: function() {
        return this._resourceHrefNotEmpty();
    },

    _getUrlGeneratorFunction: function() {
        var _this = this;

        return function(collection) {
            return OpenLayers.Layer.WMS.getFeatureRequestUrl(
                collection.getFilters(),
                _this._resourceHref(),
                _this._resourceName(),
                OpenLayers.Layer.DOWNLOAD_FORMAT_CSV
            );
        };
    }
});

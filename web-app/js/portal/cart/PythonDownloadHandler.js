''

Ext.namespace('Portal.cart');

Portal.cart.PythonDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function() {
        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsPythonSnippetLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    filenameFormat: "{0}.py",
                    downloadControllerArgs: {
                        action: 'downloadPythonSnippet'
                    }
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {
        return this._resourceHrefNotEmpty();
    },

    _getUrlGeneratorFunction: function() {
        var _this = this;

        return function(collection) {

            trackDownloadUsage(
                OpenLayers.i18n('downloadAsPythonSnippetLabel'),
                collection.getTitle(),
                _this.getCollectionFiltersAsText(collection)
            );

            return OpenLayers.Layer.WMS.getFeatureRequestUrl(
                collection.getFilters(),
                _this._resourceHref(),
                _this._resourceName(),
                OpenLayers.Layer.DOWNLOAD_FORMAT_CSV
            );
        };
    }
});

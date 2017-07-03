Ext.namespace('Portal.cart');

Portal.cart.WfsDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._showDownloadOptions()) {

            downloadOptions.push({
                textKey: OpenLayers.i18n('downloadCsvAction'),
                type: 'WFS',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadCsvNonGriddedAction'),
                    filenameFormat: "{0}.csv"
                }
            });
        }

        return downloadOptions;
    },

    _showDownloadOptions: function() {

        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty();
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection) {
            return OpenLayers.Layer.WMS.getFeatureRequestUrl(
                collection.getFilters(),
                _this._resourceHref(),
                _this._resourceName(),
                collection.getLayerSelectionModel().getSelectedLayer().getCsvDownloadFormat()
            );
        };
    }
});

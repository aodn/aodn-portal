Ext.namespace('Portal.cart');

Portal.cart.WfsDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._showDownloadOptions()) {

            var miniTitle = this._getResourceSubTitle();
            downloadOptions.push({
                textKey: OpenLayers.i18n('downloadCsvAction'),
                type: 'WFS',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadCsvNonGriddedAction'),
                    filenameFormat: "{0}" + miniTitle + ".csv"
                }
            });
        }

        return downloadOptions;
    },

    _getResourceSubTitle: function() {
        // https://github.com/aodn/backlog/issues/225
        var match = this._resourceTitle().match(/\((.*?)\)/);
        if (match) {
            return String.format("-{0}", match[1])
        }
        return "";
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

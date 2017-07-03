Ext.namespace('Portal.cart');

Portal.cart.BodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    NAME_FIELD_DELIMETER: "#",
    LAYER_NAME_INDEX: 0,
    FIELD_NAME_INDEX: 1,

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'downloadAsAllSourceNetCdfLabel',
                type: 'WFS',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadUnsubsettedNetCdfAction'),
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
                    downloadLabel: OpenLayers.i18n('downloadUrlListAction'),
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

    _showDownloadOptions: function(filters) {

        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty()
            && (this._resourceName().indexOf(this.NAME_FIELD_DELIMETER) > -1)
            && !Portal.filter.FilterUtils.hasFilter(filters, 'timeSeriesAtPoint');
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection) {

            var builder = new Portal.filter.combiner.BodaacCqlBuilder({
                filters: collection.getFilters()
            });

            return OpenLayers.Layer.WMS.buildGetFeatureRequestUrl(
                _this._resourceHref(),
                _this._layerName(),
                OpenLayers.Layer.DOWNLOAD_FORMAT_CSV,
                builder.buildCql()
            );
        };
    },

    _layerName: function() {
        return this._valueFromNameField(this.LAYER_NAME_INDEX);
    },

    _urlFieldName: function() {
        return this._valueFromNameField(this.FIELD_NAME_INDEX);
    },

    _valueFromNameField: function(index) {
        return this.onlineResource.name.split(this.NAME_FIELD_DELIMETER)[index];
    }
});

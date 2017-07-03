Ext.namespace('Portal.cart');

Portal.cart.ShapeFileDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'downloadAsShapeFileLabel',
                type: 'WFS',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    downloadLabel: OpenLayers.i18n('downloadShapefileAction'),
                    filenameFormat: '{0}_'+this.onlineResource.name+'.zip',
                    downloadControllerArgs: {
                        action: 'downloadShapeFilesForLayer'
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

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection) {

            var builder = new Portal.filter.combiner.ShapeFileCqlBuilder({
                filters: collection.getFilters()
            });

            return OpenLayers.Layer.WMS.buildGetFeatureRequestUrl(
                _this._baseUrl(),
                _this._layerName(),
                _this._outputFormat(),
                builder.buildCql()
            );
        };
    },

    _layerName: function() {
        return Ext.urlDecode(this.onlineResource.href.split("?")[1]).typeName;
    },

    _outputFormat: function() {
        return Ext.urlDecode(this.onlineResource.href.split("?")[1]).outputFormat;
    },

    _baseUrl: function() {
        return this.onlineResource.href.split("?")[0];
    }

});

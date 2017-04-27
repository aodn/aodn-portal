Ext.namespace('Portal.cart');

Portal.cart.NetcdfSubsetServiceDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    _getDownloadOptionTextKey: function() {
        return 'downloadAsSubsettedNetCdfLabel';
    },

    _getDownloadOptionTitle: function() {
        return OpenLayers.i18n('downloadNetcdfSubsetServiceAction');
    },

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var cqlFilter = this._getSubset(filters);

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('wps'),
            Ext.urlEncode({
                server: serverUrl,
                jobType: 'NetcdfOutput',
                mimeType: 'application/zip',
                'email.to': notificationEmailAddress,
                'jobParameters.typeName': layerName,
                'jobParameters.cqlFilter': cqlFilter
            })
        );
    },

    _buildCalculatorUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var cqlFilter = this._getSubset(filters);

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('calculator'),
            Ext.urlEncode({
                server: serverUrl,
                jobType: 'NetcdfOutput',
                mimeType: 'application/zip',
                'jobParameters.typeName': layerName,
                'jobParameters.cqlFilter': cqlFilter
            })
        );
    },

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: this._getDownloadOptionTextKey(),
                handler: this._getUrlGeneratorFunction(),
                downloadSizeHandler: this._getEstimatorUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    serviceResponseHandler: this.serviceResponseHandler
                }
            });
        }
        return downloadOptions;
    },

    _getEstimatorUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {
            var url = _this._buildCalculatorUrl(
                collection.getFilters(),
                _this._resourceName(),
                _this._resourceHref()
            );
            return url;
        };
    },


    _getSubset: function(filters) {
        var builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
            filters: filters
        });

        return builder.buildCql();
    }
});

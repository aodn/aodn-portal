Ext.namespace('Portal.cart');

Portal.cart.WpsDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    getDownloadOptions: function() {
        return Portal.cart.WpsDownloadHandler.superclass.getDownloadOptions.call(this, 'downloadAsWpsLabel');
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {
            var wpsUrl = _this._buildWpsUrl(
                collection.getFilters(),
                _this._resourceName(),
                _this._resourceHref(),
                handlerParams.emailAddress
            );

            if (handlerParams.challengeResponse) {
                wpsUrl += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }

            return wpsUrl;
        };
    },

    _buildWpsUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var builder = new Portal.filter.combiner.BodaacCqlBuilder({
            filters: filters
        });

        var cqlFilter = builder.buildCql();

        this._trackUsage(layerName, cqlFilter);

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('wps'),
            Ext.urlEncode({
                server: serverUrl,
                'email.to': notificationEmailAddress,
                'jobParameters.typeName': layerName,
                'jobParameters.cqlFilter': cqlFilter
            })
        );
    },

    _trackUsage: function(layerName, cqlFilter) {
        trackDownloadUsage(
            OpenLayers.i18n('wpsTrackingLabel'),
            layerName,
            cqlFilter
        );
    }
});

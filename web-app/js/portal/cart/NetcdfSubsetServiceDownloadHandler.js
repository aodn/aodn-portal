Ext.namespace('Portal.cart');

Portal.cart.NetcdfSubsetServiceDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    _getDownloadOptionTextKey: function() {
        return 'downloadAsSubsettedNetCdfLabel';
    },

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var cqlFilter = this._getSubset(filters);

        this._trackUsage(layerName, cqlFilter);

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('wps'),
            Ext.urlEncode({
                server: serverUrl,
                jobType: 'NetcdfOutput',
                'email.to': notificationEmailAddress,
                'jobParameters.typeName': layerName,
                'jobParameters.cqlFilter': cqlFilter
            })
        );
    },

    _getSubset: function(filters) {
        var builder = new Portal.filter.combiner.BodaacCqlBuilder({
            filters: filters
        });

        return builder.buildCql();
    },

    _trackUsage: function(layerName, cqlFilter) {
        trackDownloadUsage(
            OpenLayers.i18n('wpsTrackingLabel'),
            layerName,
            cqlFilter
        );
    }
});

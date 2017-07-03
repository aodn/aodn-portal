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

    _getSubset: function(filters) {
        var builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
            filters: filters
        });

        return builder.buildCql();
    }
});

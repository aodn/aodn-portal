Ext.namespace('Portal.cart');

Portal.cart.DataTrawlerDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {


    _getDownloadOptionTextKey: function() {
        return 'downloadAsDataTrawlerCsvLabel';
    },

    _getDownloadOptionTitle: function() {
        return OpenLayers.i18n('downloadDataTrawlerServiceAction');
    },

    _buildServiceUrl: function(filters, dataType, serverUrl, notificationEmailAddress) {

        var request = this._getParamsUrl(filters, dataType, notificationEmailAddress);

        var jobParameters = {
            server: serverUrl,
            jobType: 'DataTrawler',
            mimeType: "text/csv",
            request: request
        };

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('datatrawler'),
            Ext.urlEncode(jobParameters)
        );
    },

    _getParamsUrl: function(filters, dataType, email) {
        var dataTypeParam = String.format("data_type={0}&", dataType);
        var emailParam = String.format("email_address={0}&", email);

        return dataTypeParam +
            emailParam +
            'output_filename=data_trawler_output&' +
            'position_format=d.ddd&' +
            'date_format=dd-mmm-yyyy HH24:mm:ss&' +
            'file_format=csv&'+
            'purpose_of_data=&'+
            'sort_order=';
    }
});

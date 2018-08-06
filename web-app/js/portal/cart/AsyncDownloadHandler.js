Ext.namespace('Portal.cart');

Portal.cart.AsyncDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    hasTemporalExtent: function(collection) {
        try {
            return (Object.keys(collection.layerAdapter.layerSelectionModel.selectedLayer.temporalExtent.extent) == 0) ? false : true;
        } catch (ex) {
            return true;
        }
    },

    getAsyncDownloadUrl: function(aggregatorServiceName) {
        return String.format('asyncDownload?aggregatorService={0}&', aggregatorServiceName);
    },

    serviceResponseHandler: function(response) {
        var msg = "";

        if (response) {
            try {
                var responseJson = JSON.parse(response);
                if (responseJson['url']) {
                    msg = OpenLayers.i18n('asyncServiceMsg', {
                        url: responseJson['url']
                    });
                }
            }
            catch (e) {
                log.error(String.format("Could not parse asynchronous response: '{0}'", response));
            }
        }
        return msg;
    }
});

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

        var responseJson;
        if (response) {
            try {
                responseJson = JSON.parse(response.responseText);
                if (responseJson['url']) {
                    response.userMsg = OpenLayers.i18n('asyncServiceMsg', {
                        url: responseJson['url']
                    });
                }
            }
            catch (e) {
                log.error(String.format("Could not parse asynchronous response: '{0}'", response.responseText));
                response = {
                    userMsg: (response.responseText) ? response.responseText : OpenLayers.i18n("unexpectedDownloadResponse"),
                    status: 404
                }
            }
        }
        return response;
    }
});

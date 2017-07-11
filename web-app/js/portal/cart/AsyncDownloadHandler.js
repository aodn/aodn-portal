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

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: this._getDownloadOptionTextKey(),
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    downloadLabel: this._getDownloadOptionTitle(),
                    serviceResponseHandler: this.serviceResponseHandler
                }
            });
        }

        return downloadOptions;
    },

    _getDownloadOptionTextKey: function() {
        throw 'Should be implemented by subclasses';
    },

    _getDownloadOptionTitle: function() {
        throw 'Should be implemented by subclasses';
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {
            var url = _this._buildServiceUrl(
                collection.getFilters(),
                _this._resourceName(),
                _this._resourceHref(),
                handlerParams.emailAddress,
                _this.hasTemporalExtent(collection)
            );

            if (handlerParams.challengeResponse) {
                url += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }

            return url;
        };
    },

    _buildServiceUrl: function() {
        throw 'Should be implemented by subclasses';
    },

    _showDownloadOptions: function() {
        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty();
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

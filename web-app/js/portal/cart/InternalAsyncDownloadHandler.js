Ext.namespace('Portal.cart');

Portal.cart.InternalAsyncDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

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
        throw 'Should be implemented by subclasses';
    }
});

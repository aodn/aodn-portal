Ext.namespace('Portal.cart');

Portal.cart.GaDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'GeoTIFF',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: this._buildHandlerParams()
            });
        }
        return downloadOptions;
    },

    _buildHandlerParams: function(fileFormat, downloadLabel) {
        return {
            asyncDownload: true,
            collectEmailAddress: true,
            downloadControllerArgs: {
                action: 'passThrough'
            }
        }
    },

    _showDownloadOptions: function() {

        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty();
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {

            var builder = new Portal.filter.combiner.WcsParametersBuilder({
                filters: collection.getFilters()
            });

            handlerParams.layerName = collection.getLayerSelectionModel().getSelectedLayer().wmsName;
            handlerParams.downloadFilename = collection.getTitle();

            var jsonPost = _this.buildRequestUrl(
                _this.onlineResource.href,
                builder.buildWCSParameters(handlerParams.layerName),
                handlerParams
            );

            return jsonPost;
        };
    },

    buildRequestUrl: function(baseUrl, selectedBBOX, handlerParams) {

        var jsonData = {};

        jsonData['bboxInOutputCRS'] = selectedBBOX;
        jsonData['emailAddress'] = handlerParams.emailAddress;
        jsonData['outputCRS'] = "EPSG:4326";
        jsonData['format'] = "GeoTIFF";
        jsonData['coverages'] = handlerParams.layerName;

        if (handlerParams.challengeResponse) {
            jsonData['challengeResponse'] = encodeURIComponent(handlerParams.challengeResponse);
        }

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('json'),
            Ext.urlEncode({
                server: baseUrl,
                body: JSON.stringify(jsonData)
            })
        );
    }
});




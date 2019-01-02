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

    _buildHandlerParams: function() {
        return {
            asyncDownload: true,
            collectEmailAddress: true,
            downloadControllerArgs: {
                action: 'passThrough'
            },
            serviceResponseHandler: this.parseResponse
        }
    },

    // should be JSON
    parseResponse: function(response) {
        var responseJson;
        if (response) {

            // GA response.status currently is always 200
            if (response.responseText != "OK") {
                try {
                    responseJson = JSON.parse(response.responseText);
                    if (responseJson['status'] == "error" || response.status != 200) {
                        response.status = (response.status != 200) ? response.status : 404;
                        response.userMsg = String.format("<p>{0}</p> <p><b>Download Server Message:</b>  &#39;<i>{1}</i>&#39;</p>", OpenLayers.i18n('asyncDownloadErrorMsg'), responseJson['reason'] );
                        log.error(String.format("Download error. User was shown: '{0}'", response.userMsg));
                    }
                }
                catch (e) {
                    response.status = (response.status != 200) ? response.status : 404;
                    log.error(String.format("Unexpected response from GA download service: '{0}'", response));
                }
            }
        }
        return response;
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




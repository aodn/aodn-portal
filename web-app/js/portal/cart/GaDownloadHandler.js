Ext.namespace('Portal.cart');

Portal.cart.GaDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'GeoTIFF',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: this._buildHandlerParams() //'{0}.tiff.zip', "Download Tiff"
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

            var builder = new Portal.filter.combiner.GaParametersBuilder({
                filters: collection.getFilters()
            });

            handlerParams.layerName = collection.getLayerSelectionModel().getSelectedLayer().wmsName;
            handlerParams.downloadFilename = collection.getTitle();

            var jsonPost = _this.buildRequestUrl(
                _this.onlineResource.href,
                builder.buildParameters(),
                handlerParams
            );

            return jsonPost;
        };
    },

    buildRequestUrl: function(baseUrl, spatial, handlerParams) {

        var datasets = [{
            coverageUrl: String.format("http://localhost:8080/geoserver/marine/wcs?SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&COVERAGE={0}&CRS=EPSG:4326&BBOX={1}&FORMAT=GeoTIFF&WIDTH={2}&HEIGHT={3}&RESX={2}&RESY={3}",
                handlerParams.layerName, spatial.bbox, spatial.width, spatial.height, baseUrl),
            title: handlerParams.downloadFilename
        }];

        var jsonData = {};

        jsonData['bbox'] = spatial.bbox;
        jsonData['bboxInSelectedProjection'] = spatial.bbox;
        jsonData['emailAddress'] = handlerParams.emailAddress;
        jsonData['crs'] = "EPSG:4326";
        jsonData['format'] = "GeoTIFF";
        jsonData['datasets'] = datasets;

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




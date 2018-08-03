Ext.namespace('Portal.cart');

Portal.cart.AlaDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: 'CSV',
                handler: this._getUrlGeneratorFunction('csv'),
                handlerParams: this._buildHandlerParams('{0}.csv.zip', OpenLayers.i18n('downloadCsvAlaAction'))
            });

            downloadOptions.push({
                textKey: 'TSV',
                handler: this._getUrlGeneratorFunction('tsv'),
                handlerParams: this._buildHandlerParams('{0}.tsv.zip', OpenLayers.i18n('downloadTsvAlaAction'))
            });

            downloadOptions.push({
                textKey: 'CSV+SHP',
                handler: this._getUrlGeneratorFunction('shp'),
                handlerParams: this._buildHandlerParams('{0}.shp.zip', OpenLayers.i18n('downloadShpAlaAction'))
            });

        }
        return downloadOptions;
    },

    _buildHandlerParams: function(fileFormat, downloadLabel) {
        return {
            asyncDownload: true,
            collectEmailAddress: true,
            downloadLabel: downloadLabel,
            filenameFormat: fileFormat,
            downloadControllerArgs: {
                action: 'passThrough'
            },
            serviceResponseHandler: this.serviceResponseHandler // adds the status url to popup.
        }
    },

    _showDownloadOptions: function() {

        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty();
    },

    _getUrlGeneratorFunction: function(format) {

        var _this = this;

        return function(collection, handlerParams) {

            var builder = new Portal.filter.combiner.AlaParametersBuilder({
                filters: collection.getFilters()
            });

            handlerParams.alaDownloadFilename = collection.getTitle();

            var url = _this.buildRequestUrl(
                _this.onlineResource.href,
                format,
                builder.buildParameterString(),
                handlerParams
            );

            if (handlerParams.challengeResponse) {
                url += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }
            return url;
        };
    },

    buildRequestUrl: function(baseUrl, outputFormat, downloadParameterString, handlerParams) {

        var downloadUrl = baseUrl;
        downloadUrl += (downloadUrl.indexOf('?') !== -1) ? "&" : "?";
        downloadUrl += '&fileType=' + outputFormat;
        downloadUrl += '&file=' + handlerParams.alaDownloadFilename.replace(/ /g, '_').replace(/\W/g, '');
        if (Portal.app.appConfig.ala.downloadFields != undefined) {
                downloadUrl += '&fields=' + Portal.app.appConfig.ala.downloadFields;
        }
        downloadUrl += "&dwcHeaders=true";
        downloadUrl += "&email=" + handlerParams.emailAddress;
        downloadUrl += '&reasonTypeId=' + 4;
        downloadUrl += '&qa=none';
        downloadUrl += '&sourceTypeId=' + Portal.app.appConfig.ala.aodnAlaId; // ALA assigned number for AODN
        downloadUrl += downloadParameterString;

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('ala'),
            Ext.urlEncode({
                server: downloadUrl
            })
        );
    }
});

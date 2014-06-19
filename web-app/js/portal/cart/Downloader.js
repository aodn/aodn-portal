/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.Downloader = Ext.extend(Object, {
    download: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {

        var downloadUrl = generateUrlCallback.call(generateUrlCallbackScope, collection, params);

        log.info(
            "Downloading collection: " + JSON.stringify({
                'title': collection.title,
                'download URL': downloadUrl
            })
        );

        if (params.asyncDownload) {
            this._downloadAsynchronously(collection, downloadUrl, params);
        }
        else {
            this._downloadSynchronously(collection, downloadUrl, params);
        }
    },

    _downloadSynchronously: function(collection, downloadUrl, params) {
        log.debug('downloading synchronously', downloadUrl);

        var proxyUrl = this._constructProxyUrl(collection, downloadUrl, params);
        this._openDownload(proxyUrl);
    },

    _constructProxyUrl: function(collection, downloadUrl, params) {

        var filename = this._constructFileName(collection, params);
        var encodedFilename = encodeURIComponent(this._sanitiseFileName(filename));
        var url = encodeURIComponent(downloadUrl);
        var additionalQueryString = this._additionalQueryStringFrom(params.downloadControllerArgs);

        return String.format('download?url={0}&downloadFilename={1}{2}', url, encodedFilename, additionalQueryString);
    },

    _constructFileName: function(collection, params) {
        return String.format(params.fileNameFormat, collection.title);
    },

    _additionalQueryStringFrom: function(args) {

        var queryString = '';

        if (args) {
            Ext.each(Object.keys(args), function(key) {

                var value = encodeURIComponent(args[key]);

                queryString += String.format('&{0}={1}', key, value);
            });
        }

        return queryString;
    },

    _openDownload: function(downloadUrl) {
        log.debug('Downloading from URL: ' + downloadUrl);
        window.location = downloadUrl;
    },

    _downloadAsynchronously: function(collection, downloadUrl, params) {
        log.debug('downloading asynchronously', downloadUrl);

        Ext.Ajax.request({
            url: downloadUrl,
            scope: {
                params: params
            },
            success: this._onAsyncDownloadRequestSuccess,
            failure: this._onAsyncDownloadRequestFailure
        });
    },

    _onAsyncDownloadRequestSuccess: function() {
        Ext.Msg.alert(
            OpenLayers.i18n('asyncDownloadPanelTitle'),
            OpenLayers.i18n('asyncDownloadSuccessMsg', { email: this.params.emailAddress })
        );
    },

    _onAsyncDownloadRequestFailure: function() {
        Ext.Msg.alert(
            OpenLayers.i18n('asyncDownloadPanelTitle'),
            OpenLayers.i18n('asyncDownloadErrorMsg')
        );
    },

    _sanitiseFileName: function(str) {
        return str.replace(/:/g, "#").replace(/[/\\ ]/g, "_");
    }
});

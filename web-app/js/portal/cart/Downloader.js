/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.Downloader = Ext.extend(Object, {
    download: function(collection, generateWfsUrlCallbackScope, generateWfsUrlCallback, params) {

        var wfsDownloadUrl = generateWfsUrlCallback.call(generateWfsUrlCallbackScope, collection, params);

        log.info(
            "Downloading collection: " + JSON.stringify({
                'title': collection.title,
                'download URL': wfsDownloadUrl
            })
        );

        if (params.asyncDownload) {
            this._downloadAsynchronously(collection, wfsDownloadUrl, params);
        }
        else {
            this._downloadSynchronously(collection, wfsDownloadUrl, params);
        }
    },

    _downloadSynchronously: function(collection, wfsDownloadUrl, params) {
        log.debug('downloading synchronously', wfsDownloadUrl);

        var proxyUrl = this._constructProxyUrl(collection, wfsDownloadUrl, params);
        this._openDownload(proxyUrl);
    },

    _constructProxyUrl: function(collection, wfsDownloadUrl, params) {

        var filename = this._constructFileName(collection, params);
        var encodedFilename = encodeURIComponent(this._sanitiseFileName(filename));
        var url = encodeURIComponent(wfsDownloadUrl);
        var additionalQueryString = this._additionalQueryStringFrom(params.downloadControllerArgs);

        return String.format('download?url={0}&downloadFilename={1}{2}', url, encodedFilename, additionalQueryString);
    },

    _constructFileName: function(collection, params) {
        return String.format(params.fileNameFormat, collection.title);
    },

    _additionalQueryStringFrom: function(args) {

        var queryString = '';

        if (args) {

            Ext.each(
                Object.keys(args),
                function(key) {
                    var value = encodeURIComponent(args[key]);

                    queryString += String.format('&{0}={1}', key, value);
                }
            );
        }

        return queryString;
    },

    _openDownload: function(downloadUrl) {
        log.debug('Downloading from URL: ' + downloadUrl);
        window.location = downloadUrl;
    },

    _downloadAsynchronously: function(collection, wfsDownloadUrl, params) {
        log.debug('downloading asynchronously', wfsDownloadUrl);

        Ext.Ajax.request({
            url: wfsDownloadUrl,
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

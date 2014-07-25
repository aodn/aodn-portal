/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

var $downloaderLink;

Portal.cart.Downloader = Ext.extend(Object, {
    download: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {

        var downloadUrl = generateUrlCallback.call(generateUrlCallbackScope, collection, params);

        log.info(
            "Downloading collection: " + JSON.stringify({
                'title': collection.title,
                'download URL': downloadUrl,
                'params': params
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

        var filename = this._constructFilename(collection, params);
        var encodedFilename = encodeURIComponent(this._sanitiseFilename(filename));
        var encodedDownloadUrl = encodeURIComponent(downloadUrl);
        var additionalQueryString = this._additionalQueryStringFrom(params.downloadControllerArgs);

        return String.format('download?url={0}&downloadFilename={1}{2}', encodedDownloadUrl, encodedFilename, additionalQueryString);
    },

    _constructFilename: function(collection, params) {
        return String.format(params.filenameFormat, collection.title);
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

    _openDownload: function(proxyUrl) {
        log.debug('Downloading using URL: ' + proxyUrl);

        // Download function shamelessly stolen from:
        // http://stackoverflow.com/a/12671023/1920729
        if ($downloaderLink && $downloaderLink.length > 0) {
            $downloaderLink.attr('src', proxyUrl);
        } else {
            $downloaderLink = $('<iframe>', { id:'downloaderLink', src:proxyUrl }).hide().appendTo('body');
        }
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

    _sanitiseFilename: function(str) {
        return str.replace(/:/g, "#").replace(/[/\\ ]/g, "_");
    }
});

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

        if (params.asyncDownload) {
            this._downloadAsynchronously(collection, downloadUrl, params);
        }
        else {
            this._downloadSynchronously(collection, downloadUrl, params);
        }
    },

    _downloadSynchronously: function(collection, url, params) {
        log.debug('downloading synchronously ' + url);

        var proxyUrl = this._constructProxyUrl(collection, url, params);
        this._requestDownload(url, proxyUrl);
    },

    _constructProxyUrl: function(collection, url, params) {

        var filename = this._constructFilename(collection, params);
        var encodedFilename = encodeURIComponent(this._sanitiseFilename(filename));
        var encodedDownloadUrl = encodeURIComponent(url);
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

    _requestDownload: function(url, proxyUrl) {
        log.debug('Downloading synchronously using request: ' + url);

        this.proxyUrl = proxyUrl;

        Ext.Ajax.request({
            url: 'download/validateRequest',
            params: {
                url: url
            },
            scope: this,
            success: this._onDownloadRequestSuccess,
            failure: this._onDownloadRequestFailure
        });
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

    _onDownloadRequestSuccess: function(response, request) {

        var url = request.scope.proxyUrl;

        if ($downloaderLink && $downloaderLink.length > 0) {
            $downloaderLink.attr('src', url);
        } else {
            $downloaderLink = $('<iframe>', { id:'downloaderLink', src: url }).hide().appendTo('body');
        }
    },

    _onDownloadRequestFailure: function(resp) {
        log.error("Synchronous download request has failed with the following error " + resp.responseText);
        Ext.Msg.alert(
            OpenLayers.i18n('errorDialogTitle'),
            OpenLayers.i18n('downloadErrorText')
        )
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

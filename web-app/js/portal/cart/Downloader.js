Ext.namespace('Portal.cart');

Portal.cart.Downloader = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {

        this.ALERTWIDTH =  500;

        this.addEvents('downloadrequested', 'downloadstarted', 'downloadfailed');

        Ext.apply(this, config);

        Portal.cart.Downloader.superclass.constructor.call(this, config);
    },

    download: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {

        var downloadUrl = generateUrlCallback.call(generateUrlCallbackScope, collection, params);

        if (params.asyncDownload) {
            this._downloadAsynchronously(collection, downloadUrl, params);
        }
        else {
            this._downloadSynchronously(collection, downloadUrl, params);
        }
    },

    _downloadSynchronously: function(collection, downloadUrl, params) {
        log.debug('downloading synchronously', downloadUrl);

        var downloadToken = this._newDownloadToken();
        var proxyUrl = this._constructProxyUrl(collection, downloadUrl, downloadToken, params);
        var self = this;

        $.fileDownload(proxyUrl, {
            prepareCallback: function(downloadUrl) { self._onPrepare(downloadUrl, collection); },
            successCallback: function(downloadUrl) { self._onSuccess(downloadUrl, collection); },
            failCallback: function(msg, downloadUrl) { self._onFailure(downloadUrl, collection, msg); },
            cookieName: String.format("downloadToken{0}", downloadToken),
            cookieValue: downloadToken
        });
    },

    _onPrepare: function(downloadUrl, collection) {
        collection.downloadStatus = 'requested';
        this.fireEvent('downloadrequested', downloadUrl, collection);
    },

    _onSuccess: function(downloadUrl, collection) {
        collection.downloadStatus = 'started';
        this.fireEvent('downloadstarted', downloadUrl, collection);
    },

    _onFailure: function(downloadUrl, collection, msg) {
        collection.downloadStatus = 'failed';
        this.fireEvent('downloadfailed', downloadUrl, collection, msg);
    },

    _newDownloadToken: function() {
        return new Date().getTime();
    },

    _constructProxyUrl: function(collection, downloadUrl, downloadToken, params) {

        var filename = this._constructFilename(collection, params);
        var encodedFilename = encodeURIComponent(this._sanitiseFilename(filename));
        var encodedDownloadUrl = encodeURIComponent(downloadUrl);
        var additionalQueryString = this._additionalQueryStringFrom(params.downloadControllerArgs);

        return String.format(
            'download?url={0}&downloadFilename={1}&downloadToken={2}{3}',
            encodedDownloadUrl,
            encodedFilename,
            downloadToken,
            additionalQueryString
        );
    },

    _constructFilename: function(collection, params) {
        return String.format(params.filenameFormat, collection.getTitle());
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

    _downloadAsynchronously: function(collection, downloadUrl, params) {
        log.debug('downloading asynchronously', downloadUrl);

        this.messageBox = Ext.Msg.show({
            title: OpenLayers.i18n('asyncDownloadPanelTitleLoading'),
            msg: OpenLayers.i18n('asyncDownloadSuccessPendingMsg'),
            width: this.ALERTWIDTH
        });

        Ext.Ajax.request({
            url: downloadUrl,
            scope: this,
            success: function(response) {
                this._onAsyncDownloadRequestSuccess(response, params);
            },
            failure: function(response) {
                this._onAsyncDownloadRequestFailure(response);
            }
        });
    },

    _onAsyncDownloadRequestSuccess: function(response, params) {
        this.messageBox.show({
            title: OpenLayers.i18n('asyncDownloadPanelTitle'),
            msg: OpenLayers.i18n('asyncDownloadSuccessMsg', {
                email: params.emailAddress,
                serviceMessage: this._getServiceMessage(params.serviceResponseHandler, response.responseText)
            }),
            width: this.ALERTWIDTH
        });
    },

    _getServiceMessage: function(serviceResponseHandler, response) {
        return serviceResponseHandler ? serviceResponseHandler(response) : "";
    },

    _onAsyncDownloadRequestFailure: function(response) {

        var msg = String.format("<h2 class='alert alert-danger'>Error! {0}</h2>{1}", response.responseText, OpenLayers.i18n('asyncDownloadErrorMsg'));

        this.messageBox.show({
            title: OpenLayers.i18n('asyncDownloadPanelTitle'),
            msg: msg,
            width: this.ALERTWIDTH
        });
    },


    _sanitiseFilename: function(str) {
        return str.replace(/:/g, "#").replace(/[/\\ ]/g, "_");
    }
});

/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WpsDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    ASYNC_DOWNLOAD_URL: 'asyncDownload?aggregatorService=wps&',

    getDownloadOptions: function() {

        var downloadOptions = [];
        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsWpsLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    serviceResponseHandler: this.serviceResponseHandler
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {
        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty();
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {

            var wpsUrl = _this._buildWpsUrl(
                collection.getFilters(),
                _this._resourceName(),
                _this._resourceHref(),
                handlerParams.emailAddress
            );

            if (handlerParams.challengeResponse) {
                wpsUrl += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }

            return wpsUrl;
        };
    },

    _buildWpsUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var builder = new Portal.filter.combiner.BodaacCqlBuilder({
            filters: filters
        });

        var args = {
            typeName: layerName,
            emailAddress: notificationEmailAddress,
            url: serverUrl,
            cqlFilter: builder.buildCql()
        };

        this._trackUsage(layerName, args.cqlFilter);

        var paramsAsJson = Ext.util.JSON.encode(args);
        return String.format(this.ASYNC_DOWNLOAD_URL + 'jobParameters={0}', encodeURIComponent(paramsAsJson));
    },

    _trackUsage: function(layerName, cql) {
        trackDownloadUsage(
            OpenLayers.i18n('wpsTrackingLabel'),
            layerName,
            cql
        );
    },

    serviceResponseHandler: function(response) {
        var msg = "";

        if (response) {
            try {
                var responseJson = JSON.parse(response);
                if (responseJson['url']) {
                    msg = OpenLayers.i18n('asyncServiceMsg', {
                        url: responseJson['url']
                    });
                }
            }
            catch (e) {
                log.error(String.format("Could not parse WPS response: '{0}'", response));
            }
        }

        return msg;
    }
});

Ext.namespace('Portal.cart');

Portal.cart.DataTrawlerDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    DEFAULT_BOUNDS: {
        bottom: this.DEFAULT_LAT_START,
        top: this.DEFAULT_LAT_END,
        left: this.DEFAULT_LON_START,
        right: this.DEFAULT_LON_END
    },

    getDownloadOptions: function(filters) {

        var downloadOptions = [];

        if (this._showDownloadOptions(filters)) {

            downloadOptions.push({
                textKey: OpenLayers.i18n('downloadAsDataTrawlerCsvLabel'),
                handler: this._getUrlGeneratorFunction('csv'),
                handlerParams: this._buildHandlerParams('{0}.csv.zip', OpenLayers.i18n('downloadDataTrawlerServiceAction'))
            });
        }
        return downloadOptions;
    },

    _buildHandlerParams: function(fileFormat, downloadAction) {
        return {
            asyncDownload: true,
            collectEmailAddress: true,
            downloadLabel: downloadAction,
            filenameFormat: fileFormat,
            downloadControllerArgs: {
                action: 'passThrough'
            }
        }
    },

    _showDownloadOptions: function() {
        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty();
    },

    _getUrlGeneratorFunction: function(format) {

        var _this = this;

        return function(collection, handlerParams) {

            handlerParams.downloadFilename = collection.getTitle();

            var url = _this.buildRequestUrl(
                _this._resourceHref(),
                collection.getFilters(),
                format,
                handlerParams
            );

            if (handlerParams.challengeResponse) {
                url += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }
            return url;
        };
    },

    buildRequestUrl: function(serverUrl, filters, downloadFormat, params) {
        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('datatrawler'),
            Ext.urlEncode({
                server: this.buildDataTrawlerRequestString(serverUrl, filters, downloadFormat, params)
            })
        );
    },

    buildDataTrawlerRequestString: function(baseUrl, filters, downloadFormat, params) {
        if (params) {
            var downloadUrl = baseUrl;
            downloadUrl += (downloadUrl.indexOf('?') !== -1) ? "&" : "?";
            downloadUrl += this._formatFilterRequest(filters);
            downloadUrl += String.format("email_address={0}&", params.emailAddress);
            downloadUrl += String.format("output_filename={0}&", params.downloadFilename.replace(/ |&/g, '_'));
            downloadUrl += 'position_format=d.ddd&';
            downloadUrl += 'date_format=dd-mmm-yyyy%20HH24:mm:ss&';
            downloadUrl += String.format("file_format={0}&", downloadFormat);
            downloadUrl += 'purpose_of_data=&';
            downloadUrl += 'sort_order=';

            return downloadUrl;
        }
    },

    _formatFilterRequest: function(filters) {
        var formattedFilters = '';
        Ext.each(filters, function(filter) {
            if (filter.type == 'datetime' && filter.name == 'TIME') {
                var fromDate = filter.hasValue() ? moment.utc(filter._getFromDate()) : this.DEFAULT_DATE_START;
                var toDate = filter.hasValue() ? moment.utc(filter._getToDate()) : this.DEFAULT_DATE_END;
                formattedFilters += String.format('TIME={0},{1}&', this._formatDate(fromDate), this._formatDate(toDate));
            } else if (filter.type == 'pointpropertytype' || filter.type == 'geometrypropertytype') {
                var bounds = filter.hasValue() ? filter.value.bounds : this.DEFAULT_BOUNDS;
                formattedFilters += String.format('LATITUDE={0},{1}&LONGITUDE={2},{3}&',
                    bounds.bottom, bounds.top, bounds.left, bounds.right);
            } else if (filter.hasValue()) {
                formattedFilters += String.format("{0}={1}&", filter.name, encodeURIComponent(filter.value));
            }
        }, this);

        return formattedFilters;
    }
});

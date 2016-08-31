Ext.namespace('Portal.cart');

Portal.cart.DownloadEstimator = Ext.extend(Object, {

    HALF_GB_IN_BYTES: 536870912,
    EST_FAIL_CODE: -1,

    constructor: function(cfg) {
        Ext.apply(
            this,
            cfg,
            { initTimestampString: new Date().getTime().toString() }
        );

        Portal.cart.DownloadEstimator.superclass.constructor.call(this);
    },

    getIdElementName: function(uuid) {
        return String.format("downloadEst-{0}-{1}", uuid, this.initTimestampString);
    },

    _getDownloadEstimate: function(collection, callback) {

        if (this._spatialSubsetIntersect(collection)) {
            Ext.Ajax.request({
                url: 'download/estimateSizeForLayer',
                timeout: 30000,
                scope: this,
                params: this.estimateRequestParams,
                success: function(result, values) {
                    this._createDownloadEstimate(result, collection.getUuid(), callback);
                },
                failure: function(result, values) {
                    this._createFailMessage(result, collection.getUuid(), callback);
                }
            });
        }
        else {
            this._addNoDataErrorMessage(collection.getUuid(), callback);
        }
    },

    _createFailMessage: function(result, uuid, callback) {

        log.error(
            "Size estimation failed. Server response detailed below.\n" +
            "Status: " + result.status + " - " + result.statusText + "\n" +
            "Response text: '" + result.responseText + "'"
        );

        this._createDownloadEstimate(result, uuid, callback);
    },

    _createDownloadEstimate: function(result, uuid, callback) {
        this._addDownloadEstimate.defer(1, this, [parseInt(result.responseText), uuid, callback]);
    },

    _addNoDataErrorMessage: function(uuid, callback) {
        this._addDownloadEstimate.defer(1000, this, [0, uuid, callback]);
    },

    _addDownloadEstimate: function(sizeEstimate, uuid, callback) {

        var htmlAddition = this._generateEstHtmlString(sizeEstimate);
        var sizeDiv = Ext.get(this.getIdElementName(uuid));

        if (sizeDiv) {
            if (sizeEstimate == 0) {
                callback(uuid);
            }
            else if (sizeEstimate == OpenLayers.i18n('transAbortMsg')) {
                htmlAddition = this._generateTimeoutHtmlString();
            }
            else if (sizeEstimate == this.EST_FAIL_CODE || isNaN(sizeEstimate)) {
                htmlAddition = this._generateFailHtmlString();
            }

            sizeDiv.update(htmlAddition);
        }
    },

    _generateEstHtmlString: function(estimateInBytes) {
        var html = '<div>{0} {1} {2}</div><div class="clear"></div>';
        var downloadMessage = "";
        var fileSizeEstimate = "";

        if (estimateInBytes == 0) {
            downloadMessage = OpenLayers.i18n("estimatedNoDataMsg");
        }
        else {
            downloadMessage = OpenLayers.i18n("estimatedDlMessage");
            fileSizeEstimate = this._humanReadableFileSize(estimateInBytes);
        }
        var fileSizeImage = (estimateInBytes >= this.HALF_GB_IN_BYTES) ? OpenLayers.i18n("faError") : "";

        return String.format(html, downloadMessage, fileSizeEstimate, fileSizeImage);
    },

    // Credit: http://stackoverflow.com/a/14919494/627806
    _humanReadableFileSize: function(bytes) {
        var thresh = 1024;

        if (bytes < thresh) {
            return bytes + 'B';
        }

        var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;

        do {
            bytes /= thresh;
            ++u;
        } while (bytes >= thresh);

        return bytes.toFixed(1) + units[u];
    },

    _generateFailHtmlString: function() {
        var html = '<div>{0}</div>' + '<div class="clear"></div>';
        var downloadFailMessage = OpenLayers.i18n("estimatedDlFailedMsg");

        return String.format(html, downloadFailMessage);
    },

    _generateTimeoutHtmlString: function() {
        var html = '<div>{0} {1}</div>' + '<div class="clear"></div>';
        var downloadTimeoutMessage = OpenLayers.i18n("estimatedDlTimeoutMsg");
        var fileSizeImage = OpenLayers.i18n("faError");

        return String.format(html, downloadTimeoutMessage, fileSizeImage);
    },

    _spatialSubsetIntersect: function(collection) {

        var intersect = true;
        var filters = collection.getFilters();
        var params = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];
        var bounds = collection.getBounds();

        if (params && params.latitudeRangeStart != undefined) {
            intersect = this._rectanglesIntersect(bounds.left, bounds.bottom, bounds.right, bounds.top, params.longitudeRangeStart, params.latitudeRangeStart, params.longitudeRangeEnd, params.latitudeRangeEnd);
        }

        return intersect;
    },

    _rectanglesIntersect: function(minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy) {
        var aLeftOfB = maxAx < minBx;
        var aRightOfB = minAx > maxBx;
        var aAboveB = minAy > maxBy;
        var aBelowB = maxAy < minBy;
        return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
    }
});

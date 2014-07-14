/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
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

    _getDownloadEstimate: function(collection, downloadUrl, callback) {

        Ext.Ajax.request({
            url: 'download/estimateSizeForLayer',
            timeout: 30000,
            scope: this,
            params: {
                layerId: collection.wmsLayer.grailsLayerId,
                url: downloadUrl
            },
            success: function(result, values) {
                this._createDownloadEstimate(result, collection.uuid, callback);
            },
            failure: function(result, values) {
                this._createFailMessage(result, collection.uuid);
            }
        });
    },

    _createFailMessage: function(result, uuid) {

        log.error(
            "Size estimation failed. Server response detailed below.\n" +
            "Status: " + result.status + " - " + result.statusText + "\n" +
            "Response text: '" + result.responseText + "'"
        );

        this._addDownloadEstimate.defer(1, this, [this._generateFailureResponse(result), this.getIdElementName(uuid)]);
    },

    _generateFailureResponse: function(result) {
        var estResponse;

        if (result.isTimeout) {
            estResponse = result.statusText;
        }
        else {
            estResponse = parseInt(result.status);
        }

        return estResponse;
    },

    _createDownloadEstimate: function(result, uuid, callback) {
        this._addDownloadEstimate.defer(1, this, [parseInt(result.responseText), uuid, callback]);
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
        var fileSizeImage = (estimateInBytes >= this.HALF_GB_IN_BYTES) ? OpenLayers.i18n("fileSizeIconMarkup") : "";

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
        var fileSizeImage = OpenLayers.i18n("fileSizeIconMarkup");

        return String.format(html, downloadTimeoutMessage, fileSizeImage);
    },

    _wmsDownloadUrl: function(layer, format) {

        return layer.getFeatureRequestUrl(
            layer.server.uri,
            layer.params.LAYERS,
            format
        );
    }
});

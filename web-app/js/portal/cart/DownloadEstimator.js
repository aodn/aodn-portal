/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadEstimator = Ext.extend(Object, {

    ONE_GB_IN_BYTES: 1073741824,
    ONE_MB_IN_BYTES: 1048576,
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

    _getDownloadEstimate: function(collection, downloadUrl) {
        Ext.Ajax.request({
            url: 'download/estimateSizeForLayer',
            timeout: 30000,
            scope: this,
            params: {
                layerId: collection.wmsLayer.grailsLayerId,
                url: downloadUrl
            },
            success: function(result, values) {
                this._createDownloadEstimate(result, collection.uuid);
            },
            failure: function(result, values) {
                this._createFailMessage(result, collection.uuid);
            }
        });
    },

    _createFailMessage: function(result, uuid) {
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

    _createDownloadEstimate: function(result, uuid) {
        this._addDownloadEstimate.defer(1, this, [parseInt(result.responseText), this.getIdElementName(uuid)]);
    },

    _addDownloadEstimate: function(sizeEstimate, elementId) {
        var sizeDiv = Ext.get(elementId);
        var htmlAddition;

        if (sizeEstimate == OpenLayers.i18n('transAbortMsg')) {
            htmlAddition = this._generateTimeoutHtmlString();
        }
        else {
            if (sizeEstimate == this.EST_FAIL_CODE || isNaN(sizeEstimate)) {
                htmlAddition = this._generateFailHtmlString();
            }
            else {
                htmlAddition = this._generateEstHtmlString(sizeEstimate);
            }
        }

        if (sizeDiv) {
            sizeDiv.update(htmlAddition);
        }
    },

    _generateEstHtmlString: function(estimateInBytes) {
        var html = '<div>{0} {1}{2} {3}</div><div class="clear"></div>';
        var downloadMessage;
        var fileSizeEstimate;
        var fileMagnitude;
        var fileSizeImage;

        downloadMessage = OpenLayers.i18n("estimatedDlMessage");

        if (estimateInBytes >= this.ONE_GB_IN_BYTES) {
            downloadMessage = OpenLayers.i18n("estimatedDlMessage");
            fileSizeEstimate = (estimateInBytes / this.ONE_GB_IN_BYTES).toFixed(1);
            fileMagnitude = OpenLayers.i18n("fileSizeGb");
            fileSizeImage = OpenLayers.i18n("fileSizeIconMarkup");
        }
        else {
            fileSizeEstimate = (estimateInBytes / this.ONE_MB_IN_BYTES).toFixed(1);

            if (estimateInBytes >= this.HALF_GB_IN_BYTES) {
                fileMagnitude = OpenLayers.i18n("fileSizeMb");
                fileSizeImage = OpenLayers.i18n("fileSizeIconMarkup");
            }
            else {
                fileMagnitude = OpenLayers.i18n("fileSizeMb");
                fileSizeImage = "";
            }
        }

        return String.format(html, downloadMessage, fileSizeEstimate, fileMagnitude, fileSizeImage);
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
        return layer.getWmsLayerFeatureRequestUrl(format);
    }
});

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

    constructor: function() {
        Portal.cart.DownloadEstimator.superclass.constructor.call(this);
    },

    _getDownloadEstimate: function(collection) {
        Ext.Ajax.request({
            url: 'download/estimateSizeForLayer',
            timeout: 30000,
            scope: this,
            params: {
                layerId: collection.wmsLayer.grailsLayerId,
                url: this._wmsDownloadUrl(collection.wmsLayer, 'csv')
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
        var sizeEstimate = parseInt(result.status);
        var elementId = 'downloadEst' + uuid;

        this._addDownloadEstimate.defer(1, this, [sizeEstimate, elementId]);
    },

    _createDownloadEstimate: function(result, uuid) {
        var sizeEstimate = parseInt(result.responseText);
        var elementId = 'downloadEst' + uuid;

        this._addDownloadEstimate.defer(1, this, [sizeEstimate, elementId]);
    },

    _addDownloadEstimate: function(sizeEstimate, elementId) {
        var sizeDiv = Ext.get(elementId);
        var htmlAddition;

        if (sizeEstimate == this.EST_FAIL_CODE || isNaN(sizeEstimate)) {
            htmlAddition = this._generateFailHtmlString();
        }
        else {
            htmlAddition = this._generateEstHtmlString(sizeEstimate);
        }

        sizeDiv.update(htmlAddition);
    },

    _generateEstHtmlString: function(estimateInBytes) {
        var html = '<div>{0} {1}{2} {3}</div>' + '<div class="clear"></div>';
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

    _wmsDownloadUrl: function(layer, format) {
        return layer.getWmsLayerFeatureRequestUrl(format);
    }
});

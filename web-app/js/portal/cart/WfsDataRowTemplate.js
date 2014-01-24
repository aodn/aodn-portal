/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.WfsDataRowTemplate = Ext.extend(Portal.cart.NoDataRowTemplate, {

    getDataFilterEntry: function(values) {
        var html;
        var infoLabel;
        var layerValues;

        if (this._cql(values.wmsLayer)) {
            html = '<b>{0}</b> <code>{1}</code>';
            infoLabel = OpenLayers.i18n('filterLabel');
            layerValues = this._cql(values.wmsLayer);
        }
        else {
            html = '<i>{0}</i> <code>{1}</code>';
            infoLabel = OpenLayers.i18n('noFilterLabel');
            layerValues = '';
        }
        return String.format(html, infoLabel, layerValues);
    },

    createMenuItems: function(collection) {
        var menuItems = [];

        // BODAAC hack.
        if (collection.wmsLayer && collection.wmsLayer.isNcwms()) {
            menuItems.push({
                text: OpenLayers.i18n('downloadAsUrlsLabel'),
                handler: this._urlListDownloadHandler(collection, true),
                scope: this
            });
        }
        else {
            if (collection.wmsLayer.wfsLayer) {
                menuItems.push({
                    text: OpenLayers.i18n('downloadAsCsvLabel'),
                    handler: this._downloadWfsHandler(collection, 'csv'),
                    scope: this
                });
            }

            if (collection.wmsLayer.urlDownloadFieldName) {
                menuItems.push({
                    text: OpenLayers.i18n('downloadAsUrlsLabel'),
                    handler: this._urlListDownloadHandler(collection),
                    scope: this
                });
                menuItems.push({
                    text: OpenLayers.i18n('downloadAsNetCdfLabel'),
                    handler: this._netCdfDownloadHandler(collection),
                    scope: this
                });
            }
        }

        return menuItems;
    },

    getDataSpecificMarkup: function(values) {
        this._getDownloadEstimate(values);
        return '<div id="downloadEst' + values.uuid + '"></div>';
    },

    _getDownloadEstimate: function(collection) {
        Ext.Ajax.request({
            url: 'download/estimateSizeForLayer',
            scope: this,
            params: {
                layerId: collection.wmsLayer.grailsLayerId,
                url: this._wmsDownloadUrl(collection.wmsLayer, 'csv')
            },
            success: function(result, values) {
                this._createDownloadEstimate(result, collection.uuid);
            }
        });
    },

    _createDownloadEstimate: function(result, uuid) {
        var sizeEstimate = parseInt(result.responseText);
        var elementId = 'downloadEst' + uuid;

        this._addDownloadEstimate.defer(1, this, [sizeEstimate, elementId]);
    },

    _addDownloadEstimate: function(sizeEstimate, elementId) {
        var sizeDiv = Ext.get(elementId);
        var htmlAddition = this._generateEstHtmlString(sizeEstimate);
        sizeDiv.insertHtml("afterBegin", htmlAddition);
    },

    _generateEstHtmlString: function(estimate) {
        var html = '<div>{0} {1}{2} {3}</div>' + '<div class="clear"></div>';
        var downloadMessage;
        var fileSizeEstimate;
        var fileMagnitude;
        var fileSizeImage;

        // Error code received from the server-side
        if (estimate == -1 || isNaN(estimate)) {
            downloadMessage = OpenLayers.i18n("estimatedDlFailedMsg");
            fileSizeEstimate = "";
            fileMagnitude = "";
            fileSizeImage = "";
        }
        else {
            downloadMessage = OpenLayers.i18n("estimatedDlMessage");

            if (estimate >= 1024) {
                downloadMessage = OpenLayers.i18n("estimatedDlMessage");
                fileSizeEstimate = (estimate / 1024).toFixed(1);
                fileMagnitude = OpenLayers.i18n("fileSizeGb");
                fileSizeImage = OpenLayers.i18n("fileSizeIconMarkup");
            }
            else {
                fileSizeEstimate = estimate;

                if (estimate >= 512) {
                    fileMagnitude = OpenLayers.i18n("fileSizeMb");
                    fileSizeImage = OpenLayers.i18n("fileSizeIconMarkup");
                }
                else {
                    fileMagnitude = OpenLayers.i18n("fileSizeMb");
                    fileSizeImage = "";
                }
            }
        }

        return String.format(html, downloadMessage, fileSizeEstimate, fileMagnitude, fileSizeImage);
    },

    _cql: function(wmsLayer) {
        return wmsLayer.getDownloadFilter();
    },

    _downloadWfsHandler: function(collection, format) {
        return this.downloadWithConfirmation(this._wfsDownloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    _urlListDownloadHandler: function(collection, downloadWfs) {
        var additionalArgs = {
            action: 'urlListForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        if (downloadWfs) {
            return this.downloadWithConfirmation(this._wfsDownloadUrl(collection.wmsLayer, 'csv'), String.format("{0}_URLs.txt", collection.title), additionalArgs);
        }
        else {
            return this.downloadWithConfirmation(this._wmsDownloadUrl(collection.wmsLayer, 'csv'), String.format("{0}_URLs.txt", collection.title), additionalArgs);
        }
    },

    _netCdfDownloadHandler: function(collection) {
        var additionalArgs = {
            action: 'downloadNetCdfFilesForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return this.downloadWithConfirmation(this._wmsDownloadUrl(collection.wmsLayer, 'csv'), String.format("{0}_source_files.zip", collection.title), additionalArgs);
    },

    _wfsDownloadUrl: function(layer, format) {
        return layer.getWfsLayerFeatureRequestUrl(format);
    },

    _wmsDownloadUrl: function(layer, format) {
        return layer.getWmsLayerFeatureRequestUrl(format);
    }
});

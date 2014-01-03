/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.WfsDataRowTemplate = Ext.extend(Portal.cart.NoDataRowTemplate, {

    getDataFilterEntry: function(values) {
        if (this._cql(values.wmsLayer)) {
            return String.format('<b>{0}</b> <code>{1}</code>', OpenLayers.i18n('filterLabel'), this._cql(values.wmsLayer));
        }
        return '';
    },

    createMenuItems: function (collection) {
        var menuItems = [
            this._createMenuItem('downloadAsCsvLabel', collection, 'csv'),
            this._createMenuItem('downloadAsGml3Label', collection, 'gml3'),
            this._createMenuItem('downloadAsShapefileLabel', collection, 'shape-zip', 'zip')
        ];

        if (collection.wmsLayer.urlDownloadFieldName) {
            menuItems.push({text: OpenLayers.i18n('downloadAsUrlsLabel'), handler: this._urlListDownloadHandler(collection), scope: this});
            menuItems.push({text: OpenLayers.i18n('downloadAsNetCdfLabel'), handler: this._netCdfDownloadHandler(collection), scope: this});
        }

        return menuItems;
    },

    getDataSpecificMarkup: function(values) {
        this._getDownloadEstimate(values.uuid);
        return '<div id="downloadEst' + values.uuid + '"></div>';
    },

    _createMenuItem: function(translationKey, collection, format, extension) {
        return {
            text: OpenLayers.i18n(translationKey),
            handler: this._downloadWfsHandler(collection, (extension || format)),
            scope: this
        }
    },

    _getDownloadEstimate: function(uuid) {
        Ext.Ajax.request({
            url: 'download/estimateSize',
            scope: this,
            params: uuid,
            success: this._createDownloadEstimate
        });
    },

    _createDownloadEstimate: function(result, uuid) {
        var sizeEstimate = parseInt(result.responseText);
        var elementId = 'downloadEst' + uuid.params;

        this._addDownloadEstimate.defer(1, this, [sizeEstimate, elementId]);
    },

    _addDownloadEstimate: function(sizeEstimate, elementId) {
        var sizeDiv = Ext.get(elementId);
        var htmlAddition = this._generateEstHtmlString(sizeEstimate);
        sizeDiv.insertHtml("afterBegin", htmlAddition);
    },

    _generateEstHtmlString: function(estimate) {
        var html = '<div>{0} {1}{2} {3}</div>' + '<div class="clear"></div>';
        var fileSizeEstimate;
        var fileMagnitude;
        var fileSizeImage;

        if (estimate >= 1024) {
            fileSizeEstimate = (estimate/1024).toFixed(1);
            fileMagnitude = OpenLayers.i18n("fileSizeGb");
            fileSizeImage = OpenLayers.i18n("fileSizeIconPath");
        }
        else {
            fileSizeEstimate = estimate;

            if (estimate >= 512) {
                fileMagnitude = OpenLayers.i18n("fileSizeMb");
                fileSizeImage = OpenLayers.i18n("fileSizeIconPath");
            }
            else {
                fileMagnitude = OpenLayers.i18n("fileSizeMb");
                fileSizeImage="";
            }
        }
        return String.format(html, OpenLayers.i18n("estimatedDlMessage"), fileSizeEstimate, fileMagnitude, fileSizeImage);
    },

    _cql: function(wmsLayer) {
        return wmsLayer.getDownloadFilter();
    },

    _downloadWfsHandler: function (collection, format) {
        return this.downloadWithConfirmation(this._downloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    _urlListDownloadHandler: function (collection) {
        var additionalArgs = {
            action: 'urlListForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };
        return this.downloadWithConfirmation(this._downloadUrl(collection.wmsLayer, 'csv'), String.format("{0}_URLs.txt", collection.title), additionalArgs);
    },

    _netCdfDownloadHandler: function (collection) {
        return this.downloadWithConfirmation(this._downloadUrl(collection.wmsLayer, 'zip'), String.format("{0}.zip", collection.title));
    },

    _downloadUrl: function(layer, format) {
        return layer.getWfsLayerFeatureRequestUrl(format);
    }
});

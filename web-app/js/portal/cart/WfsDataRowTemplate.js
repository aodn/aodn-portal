/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.WfsDataRowTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanelTemplate) {
        this.downloadPanelTemplate = downloadPanelTemplate;

        var templateLines = [
            '<div class="x-panel-body x-box-layout-ct">',
            '  {[this._getDataDownloadEntry(values)]}',
            '</div>'
        ];

        Portal.cart.WfsDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataDownloadEntry: function(values) {
        return String.format('<div id="wfs-download-button-{0}"></div>', values.uuid); // Download button placeholder
    },

    _createMenuItems: function(collection) {

        var menuItems = [];

        menuItems.push({text: OpenLayers.i18n('downloadAsCsvLabel'), handler: this._downloadHandlerFor(collection, 'csv'), scope: this});
        menuItems.push({text: OpenLayers.i18n('downloadAsGml3Label'), handler: this._downloadHandlerFor(collection, 'gml3'), scope: this});
        menuItems.push({text: OpenLayers.i18n('downloadAsShapefileLabel'), handler: this._downloadHandlerFor(collection, 'shape-zip', 'zip'), scope: this});

        if (collection.wmsLayer && collection.wmsLayer.urlDownloadFieldName) {
            menuItems.push({text: OpenLayers.i18n('downloadAsUrlsLabel'), handler: this._urlListDownloadHandler(collection), scope: this});
        }

        return menuItems;
    },

    _urlListDownloadHandler: function(collection) {

        var downloadUrl = this._wfsUrlForGeoNetworkRecordWmsLayer(collection, 'csv');
        var downloadFilename = collection.title + "_URLs.txt";
        var additionalArgs = {
            action: 'urlList',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return function() {
            this.downloadPanelTemplate.downloadWithConfirmation(downloadUrl, downloadFilename, additionalArgs);
        };
    },

    _wfsUrlForGeoNetworkRecordWmsLayer: function(record, format) {
        return record.wmsLayer.getWmsLayerFeatureRequestUrl(format);
    },

    _wfsUrlForGeoNetworkRecordWfsLayer: function(record, format) {
        return record.wmsLayer.getWfsLayerFeatureRequestUrl(format);
    }
});

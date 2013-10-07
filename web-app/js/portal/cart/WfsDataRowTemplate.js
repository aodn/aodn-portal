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
            '<div class="row data">',
            '  <div class="subheading">' + OpenLayers.i18n('dataSubheading') + '</div>',
            '  {[this._getDataFilterEntry(values)]}',
            '  {[this._getDataDownloadEntry(values)]}',
            '</div>'
        ];

        Portal.cart.WfsDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    applyWithControls: function(values) {
        return this._replacePlaceholdersWithControls(this.apply(values), values);
    },

    _getDataFilterEntry: function(values) {
        var wmsLayer = values.wmsLayer;

        if (wmsLayer) {

            var cqlText = wmsLayer.getDownloadFilter();
            var html;

            if (cqlText) {
                html = String.format('<b>{0}</b> <code>{1}</code>', OpenLayers.i18n('filterLabel'), cqlText);
            } else {
                html = OpenLayers.i18n('noFilterMessage');
            }

            return this.downloadPanelTemplate._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {
        var wmsLayer = values.wmsLayer;
        var html;

        if (wmsLayer) {

            html = String.format('<div id="wfs-download-button-{0}"></div>', values.uuid); // Download button placeholder
        }
        else {

            html = this.downloadPanelTemplate._makeSecondaryTextMarkup(OpenLayers.i18n('noDataMessage'));
        }

        return this.downloadPanelTemplate._makeEntryMarkup(html);
    },

    _replacePlaceholdersWithControls: function(html, collection) {
        var elementId = 'wfs-download-button-' + collection.uuid;

        // Don't create button if no placeholder exists
        if (html.indexOf(elementId) >= 0) {

            this._createDownloadButton.defer(1, this, [html, elementId, collection]);
        }

        return html;
    },

    _createDownloadButton: function(html, id, collection) {
        var downloadMenu = new Ext.menu.Menu({
            items: this._createMenuItems(collection)
        });

        new Ext.Button({
            text: OpenLayers.i18n('downloadButtonLabel'),
            icon: 'images/down.png',
            scope: this,
            menu: downloadMenu
        }).render(html, id);
    },

    _createMenuItems: function(collection) {
        return [
            {text: OpenLayers.i18n('downloadAsCsvLabel'), handler: this._downloadHandlerFor(collection, 'csv'), scope: this},
            {text: OpenLayers.i18n('downloadAsGml3Label'), handler: this._downloadHandlerFor(collection, 'gml3'), scope: this},
            {text: OpenLayers.i18n('downloadAsShapefileLabel'), handler: this._downloadHandlerFor(collection, 'shape-zip'), scope: this}
        ];
    },

    _downloadHandlerFor: function(collection, format) {
        var downloadUrl = this._wfsUrlForGeoNetworkRecord(collection, format);

        return function() {

            this.downloadPanelTemplate.downloadWithConfirmation(downloadUrl);
        };
    },

    _wfsUrlForGeoNetworkRecord: function(record, format) {
        return record.wmsLayer.getFeatureRequestUrl(format);
    }
});

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
            '  <div class="subheading">' + OpenLayers.i18n('subheadingData') + '</div>',
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

            var cqlText = wmsLayer.getCqlFilter();

            var html = cqlText ? "<b>" + OpenLayers.i18n('filterLabel') + "</b> <code>" + cqlText + "</code>" : OpenLayers.i18n('noFilterApplied');

            return this.downloadPanelTemplate._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {

        var wmsLayer = values.wmsLayer;
        var html;

        if (wmsLayer) {

            html = '<div id="wfs-download-button-' + values.uuid + '"></div>'; // Download button placeholder
        }
        else {

            html = this.downloadPanelTemplate._makeSecondaryTextMarkup(OpenLayers.i18n('noData'));
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
            text: OpenLayers.i18n('downloadAs'),
            icon: 'images/down.png',
            scope: this,
            menu: downloadMenu
        }).render(html, id);
    },

    _createMenuItems: function(collection) {

        return [
            {text: OpenLayers.i18n('downloadAsCsv'), handler: this._downloadHandlerFor(collection, 'csv'), scope: this},
            {text: OpenLayers.i18n('downloadAsGml3'), handler: this._downloadHandlerFor(collection, 'gml3'), scope: this},
            {text: OpenLayers.i18n('downloadAsShapefile'), handler: this._downloadHandlerFor(collection, 'shape-zip'), scope: this}
        ];
    },

    _downloadHandlerFor: function(collection, format) {

        var downloadUrl = this._wfsUrlForGeoNetworkRecord(collection, format);

        return function() {

            this.downloadPanelTemplate.downloadPanel.confirmationWindow.showIfNeeded(downloadUrl); // Todo - DN: Tidy this up
        };
    },

    _wfsUrlForGeoNetworkRecord: function(record, format) {

        return record.wmsLayer.getFeatureRequestUrl(format);
    }
});

/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelItemTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function() {

        var templateLines = this._getHtmlContent();

        Portal.cart.DownloadPanelItemTemplate.superclass.constructor.call(this, templateLines);
    },

    _getHtmlContent: function() {

        return [
            '<div class="downloadPanelResultsWrapper">',
            '  <div class="x-panel-header resultsHeaderBackground">',
            '    <h3 class="resultsRowHeader">{[this._getRecordTitle(values)]}</h3>',
            '    <div class="floatRight downloadButtonWrapper" id="download-button-{uuid}">{[this._downloadButton(values)]}</div>',
            '  </div>',
            '  <div style="overflow:hidden;">',
            '    <div class="floatLeft dataFilterEntry" style="width:650px">',
            '      <div class="resultsTextBody">',
            '        {[this._getDataFilterEntry(values)]}',
            '      </div>',
            '      <div class="floatLeft resultsTextBody">',
            '        <div>',
            '          {[this._getPointOfTruthLinkEntry(values)]}',
            '        </div>',
            '        <div>',
            '          {[this._getFileListEntries(values)]}',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <div class="floatRight" id="resultsTextMsgs-{uuid}" style="padding-top:4px">',
            '      {[this._dataSpecificMarkup(values)]}',
            '    </div>',
            '  </div>',
            '</div>'
        ];
    },

    _getRecordTitle: function(values) {
        return values.title;
    },

    _getDataFilterEntry: function(values) {
        return String.format('<i>{0}</i>', values.dataFilters);
    },

    _getPointOfTruthLinkEntry: function(record) {
        var markup = "";

        if (record.pointOfTruthLink) {
            markup = this._makeExternalLinkMarkup(record.pointOfTruthLink.href, OpenLayers.i18n('metadataLinkText'));
        }

        return markup;
    },

    _dataSpecificMarkup: function(values) {
        return values.dataMarkup;
    },

    _downloadButton: function(collection) {
        this._createDownloadButton.defer(1, this, [collection]);
        return '';
    },

    _createDownloadButton: function(collection) {

        var elementId = OpenLayers.i18n('downloadButtonId', {id: collection.uuid});
        if (collection.menuItems.length > 0 && Ext.get(elementId)) {

            // clear old button
            Ext.fly(elementId).update("");

            new Ext.Button({
                text: OpenLayers.i18n('downloadButtonLabel'),
                icon: 'images/down.png',
                cls: 'navigationButton',
                scope: this,
                renderTo: elementId,
                menu: new Ext.menu.Menu({
                    items: collection.menuItems
                })
            });
        }
    },

    _getFileListEntries: function(values) {
        var links = values.linkedFiles;
        var html = "";
        var htmlBreak = '<br>';

        Ext.each(
            links,
            function(link) {
                html += this._getSingleFileEntry(link);
                html += htmlBreak;
            },
            this
        );

        return html;
    },

    _getSingleFileEntry: function(link) {
        return this._makeExternalLinkMarkup(link.href, link.title);
    },

    _makeExternalLinkMarkup: function(href, text) {
        return String.format('<a href="{0}" target="_blank" class="external">{1}</a>', href, (text || href));
    }
});

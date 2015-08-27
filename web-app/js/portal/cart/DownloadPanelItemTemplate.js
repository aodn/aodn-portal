/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelItemTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(cfg) {

        var templateLines = this._getHtmlContent();

        Ext.apply(this, cfg);

        Portal.cart.DownloadPanelItemTemplate.superclass.constructor.call(this, templateLines);
    },

    _getHtmlContent: function() {
        return [
            '<div class="downloadPanelResultsWrapper">',
            '  <div class="x-panel-header downloadPanelResultsTitle">',
            '    <div class="downloads resultsRowHeaderTitle"><h3>{[this._getRecordTitle(values)]}</h3></div>',
            '    <div class="floatRight listButtonWrapper" id="{[this._getButtonId(values,\'downloadButtonId\')]}">{[this._downloadButton(values)]}</div>',
            '    <div class="floatRight listButtonWrapper removeButton" id="{[this._getButtonId(values,\'removeButtonId\')]}">{[this._createRemoveButtonAfterPageLoad(values)]}</div>',
            '  </div>',
            '  <div style="overflow:hidden;">',
            '    <div class="floatLeft dataFilterEntry">',
            '      <div>',
            '        {[this._getDataFilterEntry(values)]}',
            '      </div>',
            '      <div>',
            '        <div>',
            '          {[this._getPointOfTruthLinkEntry(values)]}',
            '        </div>',
            '        <div>',
            '          {[this._getFileListEntries(values)]}',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <div class="floatRight">',
            '      {[this._dataSpecificMarkup(values)]}<br>',
            '      {[this._shareButtonMarkup(values)]}',
            '    </div>',
            '  </div>',
            '</div>'
        ];
    },

    _getRecordTitle: function(values) {
        return values.title;
    },

    _shareButtonMarkup: function(values) {
        return String.format(
            '      <span class="fa fa-fw fa-share-alt fa-lg"></span>' +
            '      <input readonly onclick="this.focus(); this.select();" title="{0}" value="{1}/home?uuid={2}" />',
            OpenLayers.i18n('shareButton'),
            Portal.app.appConfig.grails.serverURL,
            values.uuid
        );
    },

    _getDataFilterEntry: function(values) {
        return String.format('<i>{0}</i>', values.dataFilters);
    },

    _getPointOfTruthLinkEntry: function(record) {
        var markup = "";

        if (record.pointOfTruthLink) {

            var trackUsageText = String.format(OpenLayers.i18n('onClickTrackUsageFunction'),
                OpenLayers.i18n('metadataTrackingCategory'),
                OpenLayers.i18n('metadataTrackingStep3Action'),
                cleanStringForFunctionParameter(record.title)
            );

            markup = this._makeExternalLinkMarkup(record.pointOfTruthLink.href, OpenLayers.i18n('metadataLinkText'), trackUsageText);
        }

        return markup;
    },

    _dataSpecificMarkup: function(values) {
        return values.dataMarkup;
    },

    _downloadButton: function(collection) {

        if (collection.downloadStatus == 'requested') {
            this._createDownloadingLabel.defer(1, this, [collection]);
        }
        else {
            this._createDownloadButton.defer(1, this, [collection]);
        }

        return '';
    },

    // It's *actually* a button, but we're using it as a label here...
    _createDownloadingLabel: function(collection) {
        var elementId = this._getButtonId(collection, 'downloadButtonId');

        Ext.fly(elementId).update("");

        new Ext.Button({
            text: "<span class=\"fa fa-spin fa-spinner \"></span> " + OpenLayers.i18n('downloadStatusRequested'),
            cls: 'navigationButton navigationButtonActive',
            scope: this,
            disabled: true,
            disabledClass: '',
            renderTo: elementId
        });
    },

    _createDownloadButton: function(collection) {

        var elementId = this._getButtonId(collection, 'downloadButtonId');

        if (collection.menuItems.length > 0 && Ext.get(elementId)) {

            // clear old button
            Ext.fly(elementId).update("");

            new Ext.Button({
                text: OpenLayers.i18n('downloadButtonLabel'),
                cls: 'navigationButton',
                scope: this,
                renderTo: elementId,
                menu: new Ext.menu.Menu({
                    items: collection.menuItems
                })
            });
        }
    },

    _createRemoveButtonAfterPageLoad: function(collection) {
        this._createRemoveButton.defer(1, this, [collection]);
        return '';
    },

    _createRemoveButton: function(collection) {
        var elementId = this._getButtonId(collection, 'removeButtonId');
        if (collection.menuItems.length > 0 && Ext.get(elementId)) {

            // remove old button
            Ext.fly(elementId).update("");

            new Ext.Button({
                text: OpenLayers.i18n("removeButton"),
                tooltip: OpenLayers.i18n("removeButtonTooltip"),
                width: 65,
                scope: this,
                renderTo: elementId,
                listeners: {
                    click: {
                        fn: this._removeButtonOnClick,
                        scope: this
                    }
                }
            });
        }
    },

    getIdFromButtonContainerId: function(button, i18Name) {
        var collectionId = button.container.id;
        var prefix = OpenLayers.i18n(i18Name, {id: ""});
        return collectionId.replace(prefix, '');
    },

    _getButtonId: function(collection, i18Name) {
        return OpenLayers.i18n(i18Name, {id: collection.uuid});
    },

    _removeButtonOnClick: function(button) {
        var collectionId = this.getIdFromButtonContainerId(button, "removeButtonId");
        var record = this.dataCollectionStore.getByUuid(collectionId);
        this.dataCollectionStore.remove(record);

        trackDataCollectionSelectionUsage('dataCollectionRemovalTrackingAction', record.getTitle());
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
        return this._makeExternalLinkMarkup(link.url, link.title);
    },

    _makeExternalLinkMarkup: function(href, text, extras) {
        return String.format('<a href="{0}" target="_blank" class="external" {1} >{2}</a>', href, extras, (text || href));
    }
});

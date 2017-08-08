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
            '    <div class="downloads resultsRowHeaderTitle">',
            '      <div class="x-tool-awesome" title="{[this.getTooltip(\'removeDataCollectionTooltip\')]}" class="removeButton" id="{[this._getLinkId(values,\'removeButtonId\')]}">{[this._createRemoveButtonAfterPageLoad(values)]}</div>',
            '      <div class="x-tool-awesome" title="{[this.getTooltip(\'shareButtonTooltip\')]}" id="{[this._getLinkId(values,\'shareButtonId\')]}">{[this._createShareButtonAfterPageLoad(values)]}</div>',
            '    <span class="x-panel-header-text">{[this._getHtmlTitle(values)]}</span>',
            '    </div>',
            '    <div class="floatRight listButtonWrapper" id="{[this._getLinkId(values,\'downloadButtonId\')]}">{[this._createDownloadButtonAfterPageLoad(values)]}</div>',
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
            '    <div class="floatRight">{[this._getUserMsg(values)]}</div>',
            '  </div>',
            '</div>'
        ];
    },

    getTooltip: function(i18nId) {
        return OpenLayers.i18n(i18nId);
    },

    _getHtmlTitle: function(values) {
        var title = values.title;
        return String.format("<h3 title=\"{0}\">{1}</h3>", title, Ext.util.Format.ellipsis(title, 180, true));
    },

    _getUserMsg: function(values) {
        var msg = "";

        if (values.intersect === false) {
            msg = OpenLayers.i18n('spatialSubsetOutOfBoundsMsg');
        }
        else {
            if (values.errorMessage && values.errorMessage != "") {
                msg = values.errorMessage;
            }
            else {
                if (values.dataFilters == "") {
                    msg = OpenLayers.i18n('emptyDownloadFilter');
                }
                if (msg == "" && values.isTemporalExtentSubsetted == false) {
                    msg = OpenLayers.i18n('temporalSubsetHelperMsg');
                }
            }
        }

        if (msg != "") {
            return String.format("<div class=\"alert alert-warning\">{0}</div>", msg);
        }
        else {
            return msg;
        }
    },

    _createShareButtonAfterPageLoad: function(values) {
        this._createShareButton.defer(1, this, [values]);
        return '';
    },

    _createShareButton: function(values) {
        var url = String.format(
            '{0}/search?uuid={1}',
            Portal.app.appConfig.grails.serverURL.replace(/\/+$/, ""),
            values.uuid
        );
        var elementId = this._getLinkId(values, 'shareButtonId');

        if (Ext.get(elementId)) {

            Ext.fly(elementId).update("");

            var shareLink = new Ext.ux.Hyperlink({
                cls: 'fa fa-fw fa-share-alt',
                renderTo: elementId
            });
            shareLink.on('click', function() {
                this._shareButtonOnClick(url);
            }, this);
        }
    },

    _shareButtonOnClick: function(url) {
        var charLength = url.length;
        var urlMarkup = String.format('<input readonly onclick="this.select();this.focus;" value="{0}" type="text" size="{1}" ></input>', url, charLength);
        Ext.MessageBox.alert('Share Link', urlMarkup);
    },

    _getDataFilterEntry: function(values) {

        return String.format('<p><i>{0}</i></p>', values.dataFilters);
    },

    _getPointOfTruthLinkEntry: function(record) {
        var markup = "";

        if (record.pointOfTruthLink) {

            var trackUsageText = String.format(OpenLayers.i18n('onClickTrackUsageFunction'),
                OpenLayers.i18n('metadataTrackingCategory'),
                OpenLayers.i18n('metadataTrackingStep3Action'),
                cleanStringForFunctionParameter(record.title)
            );

            markup = this._makeExternalLinkMarkup(record.pointOfTruthLink[0].href, OpenLayers.i18n('metadataLinkText'), trackUsageText);
        }

        return markup;
    },

    _createDownloadButtonAfterPageLoad: function(values) {

        if (values.downloadStatus == 'requested') {
            this._createDownloadingLabel.defer(1, this, [values]);
        }
        else {
            this._createDownloadButton.defer(1, this, [values]);
        }

        return '';
    },

    // It's *actually* a button, but we're using it as a label here...
    _createDownloadingLabel: function(values) {
        var elementId = this._getLinkId(values, 'downloadButtonId');

        Ext.fly(elementId).update("");

        new Ext.Button({
            text: "<span class=\"fa fa-fw fa-spin fa-spinner \"></span> " + OpenLayers.i18n('downloadStatusRequested'),
            cls: 'navigationButton navigationButtonActive',
            scope: this,
            disabled: true,
            disabledClass: '',
            renderTo: elementId
        });
    },

    _createDownloadButton: function(values) {

        var elementId = this._getLinkId(values, 'downloadButtonId');

        if (Object.size(values.menuItems) > 0 && Ext.get(elementId)) {

            // clear old button
            Ext.fly(elementId).update("");

            new Ext.Button({
                text: OpenLayers.i18n('downloadButtonLabel'),
                cls: 'navigationButton',
                disabled: this.downloadButtonDisabled(values),
                scope: this,
                renderTo: elementId,
                menu: new Ext.menu.Menu({
                    showSeparator: false,
                    items: values.menuItems
                })
            });
        }
    },

    downloadButtonDisabled: function(values) {
        return values.intersect == false || (values.errorMessage && values.errorMessage != "");
    },

    _createRemoveButtonAfterPageLoad: function(values) {
        this._createRemoveLink.defer(1, this, [values]);
        return '';
    },

    _createRemoveLink: function(values) {
        var elementId = this._getLinkId(values, 'removeButtonId');

        if (Ext.get(elementId)) {
            // remove old button
            Ext.fly(elementId).update("");

            var removeLink = new Ext.ux.Hyperlink({
                text: OpenLayers.i18n("removeButton"),
                title: OpenLayers.i18n("removeButtonTooltip"),
                cls: 'fa fa-fw fa-close',
                renderTo: elementId
            });

            removeLink.on('click', function() {
                this._removeLinkOnClick(elementId);
            }, this);
        }
    },

    getIdFromButtonContainerId: function(containerId, i18Name) {
        var prefix = OpenLayers.i18n(i18Name, {id: ""});
        return containerId.replace(prefix, '');
    },

    _getLinkId: function(values, i18Name) {
        return OpenLayers.i18n(i18Name, {id: values.uuid});
    },

    _removeLinkOnClick: function(containerId) {
        var collectionId = this.getIdFromButtonContainerId(containerId, "removeButtonId");
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
        return this._makeExternalLinkMarkup(link.href, link.title);
    },

    _makeExternalLinkMarkup: function(href, text, extras) {
        return String.format('<a href="{0}" target="_blank" class="external" {1} >{2}</a>', href, extras, (text || href));
    }
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        var config = Ext.apply({
            title: OpenLayers.i18n('infoTabTitle'),
            html: this._constructInfoTabHtml(),
            autoHeight: true,
            style: {padding: '10px 25px 10px 10px'}
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    _constructInfoTabHtml: function() {

        var rawAbstract = this.dataCollection.getMetadataRecord().get('abstract');
        var abstract = Ext.util.Format.htmlEncode(rawAbstract);
        var linkRecords = this.dataCollection.getWebPageLinks();

        return String.format(
            '<h4>{0}</h4>\n{1}' +
            '<h4>{2}</h4>\n<ul>\n{3}</ul>',
            OpenLayers.i18n('abstractTitle'),
            abstract,
            OpenLayers.i18n('webpageLinksTitle'),
            this._getHtmlForLinks(linkRecords)
        );
    },

    _getHtmlForLinks: function(linkRecords) {

        var linkHtml = "";

        Ext.each(linkRecords, function(linkRecord) {

            var link = linkRecord.data;
            var linkText;

            if (link.title == "") {
                linkText = String.format('<i>{0}</i>', OpenLayers.i18n('unnamedResourceName'));
            }
            else {
                linkText = link.title;
            }

            linkHtml += String.format('<li><a class="external" href="{0}" target="_blank">{1}</a></li>\n', link.url, linkText);
        });

        return linkHtml;
    }
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        this.dataCollection = cfg.dataCollection;

        var config = Ext.apply({
            title: OpenLayers.i18n('infoTabTitle'),
            html: this._constructInfoTabHtml(),
            autoHeight: true,
            style: {padding: '10px 25px 10px 10px'}
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    _constructInfoTabHtml: function() {

        var rawAbstract = this.dataCollection.get('metadataRecord').get('abstract');
        var abstract = Ext.util.Format.htmlEncode(rawAbstract);
        var linkRecords = this.dataCollection.getWebPageLinks();

        return String.format(
            '<h4>Abstract</h4>\n' + // Todo - DN: i18n
            '{0}' +
            '<h4>Online Resources</h4>\n' + // Todo - DN: i18n
            '<ul>\n{1}</ul>',
            abstract,
            this._getHtmlForLinks(linkRecords)
        );
    },

    _getHtmlForLinks: function(linkRecords) {

        var linkHtml = "";

        Ext.each(linkRecords, function(linkRecord) {

            var link = linkRecord.data;
            var linkText;

            if (link.title == "") {
                linkText = '<i>Unnamed Resource</i>'; // Todo - DN: i18n
            }
            else {
                linkText = link.title;
            }

            linkHtml += String.format('<li><a class="external" href="{0}" target="_blank">{1}</a></li>\n', link.url, linkText);
        });

        return linkHtml;
    }
});

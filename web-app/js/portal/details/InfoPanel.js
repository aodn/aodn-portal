/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        this.layer = cfg.layer;

        var config = Ext.apply({
            title: OpenLayers.i18n('infoTabTitle'),
            html: this._constructInfoTabHtml(),
            autoHeight: true,
            style: {padding: '10px 25px 10px 10px'}
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    _constructInfoTabHtml: function() {

        var rawAbstract = this.layer.dataCollection.get('metadataRecord').get('abstract');
        var abstract = Ext.util.Format.htmlEncode(rawAbstract);
        var linkObjects = [{
            href: 'http://www.google.com/'
        }]; // Todo - DN: this.layer.dataCollection.getLinkedPages();

        return String.format(
            '<!DOCTYPE html>\n' +
            '<h4>Abstract</h4>\n' + // Todo - DN: i18n
            '{0}' +
            '<h4>Online Resources</h4>\n' + // Todo - DN: i18n
            '<ul>\n{1}</ul>',
            abstract,
            this._getHtmlForLinks(linkObjects)
        );
    },

    _getHtmlForLinks: function(linkObjects) {

        var linkHtml = "";

        Ext.each(linkObjects, function(linkObject) {
            var linkText;

            if (linkObject.title == "") {
                linkText = '<i>Unnamed Resource</i>'; // Todo - DN: i18n
            }
            else {
                linkText = linkObject.title;
            }

            linkHtml += String.format('<li><a class="external" href="{0}" target="_blank">{2}</a></li>\n', linkObject.href, linkText);
        });

        return linkHtml;
    }
});

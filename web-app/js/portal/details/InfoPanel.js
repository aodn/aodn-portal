Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        var config = Ext.apply({
            title: OpenLayers.i18n('infoTabTitle'),
            cls: "infoPanel",
            html: this._constructInfoTabHtml(),
            autoHeight: true,
            style: {padding: '10px 25px 10px 10px'}
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    _constructInfoTabHtml: function() {

        var rawAbstract = this.dataCollection.getMetadataRecord().get('abstract');
        var abstract = Ext.util.Format.htmlEncode(rawAbstract);
        return String.format(
            '<h3>{0}</h3>\n{1}' +
            '<hr>\n{2}<h3>{3}</h3>\n<ul>\n{4}</ul>',
            OpenLayers.i18n('abstractTitle'),
            abstract,
            this._getMetadataLinkAsHtml(),
            OpenLayers.i18n('supplementaryLinksTitle'),
            this.getSupplementaryLinkAsHtml()
            );
    },

    getSupplementaryLinkAsHtml: function() {

        var links = this._getSupplementaryLinks();
        var linkHtml = "";

        Ext.each(links, function(link) {
            var linkText;

            if (link.title == "") {
                linkText = String.format('<i>({0})</i>', OpenLayers.i18n('unnamedResourceName'));
            }
            else {
                linkText = link.title;
            }

            linkHtml += String.format('<li><a class="external" href="{0}" target="_blank">{1}</a></li>\n', link.href, linkText);
        });

        return linkHtml;
    },

    _getSupplementaryLinks: function() {
        return this.dataCollection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.supplementary);
    },

    _getMetadataLinkAsHtml: function() {
        var metadata = this.dataCollection.getMetadataRecord().data.pointOfTruthLink;
        return String.format('<a class="external" href="{0}" target="_blank" title="{1}" >{1}</a>\n', metadata.href,metadata.title);
    }
});

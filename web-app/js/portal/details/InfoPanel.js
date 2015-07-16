/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.define('Portal.details.InfoPanel', {
    extend: 'Ext4.Component',

    constructor: function(cfg) {
        this.layer = cfg.layer;

        var config = Ext4.apply({
            title: OpenLayers.i18n('infoTabTitle'),
            html: OpenLayers.i18n('loadingMessage', {resource: " collection information"}),
            autoHeight: true,
            style: {padding: '10px 25px 10px 10px'},
            listeners: {
                scope: this,
                afterrender: this._initWithLayer
            }
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    _initWithLayer: function() {

        var metadataUrl = 'layer/getMetadataAbstract?uuid=' +
            encodeURIComponent(this.layer.metadataUuid);

        var self = this;

        Ext4.Ajax.request({
            url: metadataUrl,
            success: function(resp, options) {
                self._constructInfoTabHtml(resp.responseText, self.layer.parentGeoNetworkRecord.data.onlineResources);
            },
            failure: function(resp) {
                log.error("Error receiving metadata abstract for record with uuid " + self.layer.metadataUuid);
                self._constructInfoTabHtml(null, self.layer.parentGeoNetworkRecord.data.onlineResources);
            }
        });
    },

    _constructInfoTabHtml: function(responseText, linkObjects) {

        var html;

        if (responseText) {
            html = this._getHtmlHeader(responseText);
        }
        else {
            html = this._getHtmlHeader("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>");
        }

        Ext4.each(linkObjects, function(linkObject) {
            var onlineResource;
            var linkExternal = "";
            var linkText = "";

            if (linkObject.href != "/") {
                linkExternal = 'class=\"external\"';
            }

            if (linkObject.title == "") {
                linkText = '<i>Unnamed Resource</i>';
            }
            else {
                linkText = linkObject.title;
            }

            onlineResource = String.format('<li><a {0} href={1} target="_blank">{2}</a></li>\n', linkExternal, linkObject.href, linkText);

            html += onlineResource;
        });

        html += '</ul>';

        this.update(html);
    },

    _getHtmlHeader: function(responseText) {
        return String.format('<!DOCTYPE html>\n<h4>Abstract</h4>{0}<BR><h4>Online Resources</h4>\n<ul>\n', responseText);
    }
});

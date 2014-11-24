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
            html: OpenLayers.i18n('loadingSpinner', {resource: " collection information"}),
            listeners: {
                scope: this,
                render: this._initWithLayer
            }
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    _initWithLayer: function() {
        var metadataUrl = 'layer/getFormattedMetadata?uuid=' +
            encodeURIComponent(this.layer.metadataUuid);

        Ext.Ajax.request({
            url: metadataUrl,
            scope: this,
            success: function(resp, options) {
                this.update(resp.responseText, false);
            },
            failure: function(resp) {
                this.update("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>", false);
            }
        });
    }


});

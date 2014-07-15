/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.layer = cfg.layer;

        var config = Ext.apply({
            id: 'infoPanel',
            title: 'Info',
            layout: 'fit',
            autoScroll: true,
            html: OpenLayers.i18n('loadingMessage')
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    initComponent: function(cfg) {
        Portal.details.InfoPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    _initWithLayer: function() {
        if (this.layer.getMetadataUrl()) {
            Ext.Ajax.request({
                url: 'layer/getFormattedMetadata?metaURL=' + encodeURIComponent(this.layer.getMetadataUrl()),
                scope: this,
                success: function(resp, options) {
                    this.body.update(resp.responseText);
                },
                failure: function(resp) {
                    this.body.update("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>");
                }
            });
        }
        else {
            this.body.update("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>");
        }
    }
});

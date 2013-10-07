
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            id: 'infoPanel',
            title: 'Info',
            layout: 'fit',
            autoScroll: true,
            html: OpenLayers.i18n('loadingMessage')
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

    initComponent: function(cfg){
        Portal.details.InfoPanel.superclass.initComponent.call(this);
    },

    update: function(layer, show, hide, target) {

        if (this._showBody(layer)) {
            this._updateBody(layer);
            show.call(target, this);
        } else {
            hide.call(target, this);
        }
    },

    _showBody: function(layer) {
        return layer.getMetadataUrl();
    },

    _updateBody: function(layer) {
        this.body.update(OpenLayers.i18n('loadingMessage'));
        if (layer.getMetadataUrl()) {
            Ext.Ajax.request({
                url: 'layer/getFormattedMetadata?metaURL=' + encodeURIComponent(layer.getMetadataUrl()),
                scope: this,
                success: function(resp, options) {
                    this.body.update(resp.responseText);
                },
                failure: function(resp) {
                    this.body.update(OpenLayers.i18n('noMetadataMessage'));
                }
            });
        }
    }
});

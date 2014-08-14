/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.form.Label, {

    constructor: function(cfg) {

        this.layer = cfg.layer;

        var config = Ext.apply({
            title: 'Info',
            autoScroll: true,
            style: { display: "block", padding:'0 15px 10px 10px'},
            html: OpenLayers.i18n('loadingSpinner', {resource: " collection information"})
        }, cfg);

        Portal.details.InfoPanel.superclass.constructor.call(this, config);

        this._initWithLayer();
    },

    _initWithLayer: function() {
        if (this.layer.getMetadataUrl()) {
            Ext.Ajax.request({
                url: 'layer/getFormattedMetadata?metaURL=' + encodeURIComponent(this.layer.getMetadataUrl()),
                scope: this,
                success: function(resp, options) {
                    this.setText(resp.responseText, false);
                },
                failure: function(resp) {
                    this.setText("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>", false);
                }
            });
        }
        else {
            this.setText("<i>" + OpenLayers.i18n('noMetadataMessage') + "</i>", false);
        }
    }
});

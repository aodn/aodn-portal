/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    initComponent: function(cfg) {

        this.downloadPanelBody = new Portal.cart.DownloadPanelBody({
            navigationText: OpenLayers.i18n('navigationButtonDownload')
        });

        var config = Ext.apply({
            title: OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
            headerCfg: {
                cls: 'steps'
            },
            items: this.downloadPanelBody
        }, cfg);


        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);
        this.on('beforeshow', function() { this.onBeforeShow(); }, this);
    },

    onBeforeShow: function() {
        this.downloadPanelBody.generateContent();
    }
});

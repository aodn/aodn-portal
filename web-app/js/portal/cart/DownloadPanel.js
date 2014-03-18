/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.downloadPanelBody = new Portal.cart.DownloadPanelBody({
            navigationText: OpenLayers.i18n('navigationButtonDownload')
        });

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
            headerCfg: {
                cls: 'steps'
            },
            items: this.downloadPanelBody
        }, cfg);


        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.constructor.call(this, arguments);

        this.mainPanel = config.mainPanel;

        this.on('beforeshow', function() { this.onBeforeShow(); }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.FILTER_LOADED, function(subject, openLayer) {
            this.checkRedraw(openLayer);
        }, this);
    },

    checkRedraw: function(layer) {
        // only bother if download is visible
        if (this.mainPanel.isDownloadTabActive()) {
            if (layer.options && !layer.options.isBaseLayer && !(layer instanceof OpenLayers.Layer.Vector)) {
                this.downloadPanelBody.generateContent();
            }
        }
    },

    onBeforeShow: function() {
        this.downloadPanelBody.generateContent();
    }
});

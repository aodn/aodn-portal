/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);
        Portal.cart.DownloadPanel.superclass.constructor.call(this, arguments);
    },

    initComponent: function(cfg) {

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
            headerCfg: {
                cls: 'steps'
            },
            items: this.downloadPanelBody
        }, cfg);

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);
        this._registerEvents();
    },

    _registerEvents: function() {
        this.on('beforeshow', function() { this.generateContent() }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, this.generateContent, this);
    },

    generateContent: function() {
        this.downloadPanelBody.generateContent();
    }
});

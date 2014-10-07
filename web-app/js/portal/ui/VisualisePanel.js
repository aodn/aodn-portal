/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.VisualisePanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.mapPanel = cfg.mapPanel;
        this.mapPanel.region = 'center';

        this.detailsPanel = new Portal.details.DetailsPanel({
            region: 'west',
            collapsible: true,
            collapsed: false,
            collapseMode: 'mini',
            margins: {top:0, right:10, bottom:0, left:0},
            width: 355,
            map: this.mapPanel.map,
            mapPanel: this.mapPanel
        });

        var config = Ext.apply({
            layout: 'border',
            id: 'visualisePanel',
            stateful: false,
            items: [
                this.mapPanel,
                this.detailsPanel
            ]
        }, cfg);

        Portal.ui.VisualisePanel.superclass.constructor.call(this, config);

        this.on('beforehide', function() { this.onBeforeHide() }, this);
        this.on('show', function() { this.onVisualizeShow() }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, function() {
            this.detailsPanel.expand();
        }, this);
    },

    onBeforeHide: function() {
        this.mapPanel.beforeParentHide();
    },

    onVisualizeShow: function() {
        this.detailsPanel.layoutCard();
    }
});

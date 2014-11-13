/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapActionsPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {


        this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(cfg);
        this.activeLayersPanel = new Portal.ui.ActiveLayersPanel(cfg);

        var config = Ext.apply({
            autoHeight: true,
            title: 'Map',
            autoScroll: true,
            items: [
                this.mapOptionsPanel,
                this.activeLayersPanel
            ]
        }, cfg);
        Portal.ui.MapActionsPanel.superclass.constructor.call(this, config);

        this._attachEvents();
    },

    _attachEvents: function() {

        this.activeLayersPanel.on('selectedactivelayerchanged', function() {
            if (this.autoZoomEnabled())  {
                this.activeLayersPanel.zoomToLayer();
            }
            this.mapOptionsPanel.setAutoZoomCheckbox();
        }, this);

        this.mapOptionsPanel.on('autozoomchecked', function() {
            this.activeLayersPanel.zoomToLayer();
        }, this);

        this.relayEvents(this.mapOptionsPanel, ['autozoomchecked', 'autozoomunchecked']);
        this.relayEvents(this.activeLayersPanel, ['zoomtolayer']);

        this.activeLayersPanel.on('zoomtolayer', this.mapPanel.zoomToLayer, this.mapPanel);
        this.activeLayersPanel.on('autozoomchecked', this.mapPanel.autoZoomCheckboxHandler, this.mapPanel);
        this.activeLayersPanel.on('autozoomunchecked', this.mapPanel.autoZoomCheckboxHandler, this.mapPanel);

    },

    getActiveLayerNodes: function() {
        return this.activeLayersPanel.getActiveLayerNodes();
    },

    autoZoomEnabled: function() {
        return this.mapOptionsPanel.autoZoomEnabled();
    }
});

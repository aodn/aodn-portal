/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls: 'steps'
            },
            layout: 'vbox',
            layoutConfig: {
                align: 'stretch'
            }
        }, cfg);

        this.mapPanel = cfg.mapPanel;

        Portal.details.DetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function(eventName, openlayer) {
            this.updateDetailsPanel(openlayer);
        }, this);
    },

    initComponent: function() {

        this.detailsPanelTabs = new Portal.details.DetailsPanelTab({
            map: this.map
        });

        this.dataCollectionSelectorPanel = new Portal.details.DataCollectionSelectorPanel();

        this.items = [ this.dataCollectionSelectorPanel, this.detailsPanelTabs ];

        Portal.details.DetailsPanel.superclass.initComponent.call(this);

        this.hideDetailsPanelContents();
    },

    // must be called when the panel is fully expanded for the slider
    updateDetailsPanel: function(layer, forceOpen) {
        if (layer) {
            if (layer.isOverlay()) {
                // show new layer unless user requested 'hideLayerOptions'
                this.detailsPanelTabs.handleLayer(layer);
                this.doLayout();
            }
        }
        else {
            this.hideDetailsPanelContents();
        }
    },

    hideDetailsPanelContents: function() {
        // clear the details Panel. ie. Don't show any layer options

        //DO NOT HIDE THE opacitySlider directly, or you WILL break things.-Alex
        this.detailsPanelTabs.setVisible(false);
    },

    showDetailsPanelContents: function() {
        this.doLayout();
    }
});

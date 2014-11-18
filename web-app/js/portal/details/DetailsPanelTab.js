/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanelTab = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {
        var childPanelConfig =  { map: cfg.map, layer: cfg.layer, mapPanel: cfg.mapPanel };

        this.subsetPanel = new Portal.details.SubsetPanel(childPanelConfig);
        this.infoPanel = new Portal.details.InfoPanel(childPanelConfig);
        this.stylePanel = new Portal.details.StylePanel(childPanelConfig);
        this.actionsPanel = new Portal.ui.MapActionsPanel(childPanelConfig);

        var config = Ext.apply({
            defaults: {
                style: {padding:'10px 15px 10px 10px'}
            },
            ref: 'detailsPanelTabs',
            border: false,
            activeTab: 0,
            enableTabScroll: true,
            items: [
                this.subsetPanel,
                this.infoPanel,
                this.stylePanel,
                this.actionsPanel
            ],
            flex: 1
        }, cfg);

        Portal.details.DetailsPanelTab.superclass.constructor.call(this, config);
    }
});

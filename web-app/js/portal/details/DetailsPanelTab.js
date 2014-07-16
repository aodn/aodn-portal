/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanelTab = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {
        var childPanelConfig =  { map: cfg.map, layer: cfg.layer };

        this.subsetPanel = new Portal.details.SubsetPanel(childPanelConfig);
        this.infoPanel = new Portal.details.InfoPanel(childPanelConfig);
        this.stylePanel = new Portal.details.StylePanel(childPanelConfig);

        var config = Ext.apply({
            defaults: {
                margin: 10
            },
            ref: 'detailsPanelTabs',
            border: false,
            activeTab: 0,
            enableTabScroll: true,
            items: [
                this.subsetPanel,
                this.infoPanel,
                this.stylePanel
            ],
            cls: 'floatingDetailsPanelContent',
            flex: 1
        }, cfg);

        Portal.details.DetailsPanelTab.superclass.constructor.call(this, config);
    }
});

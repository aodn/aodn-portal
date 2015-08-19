/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetItemsTabPanel = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {
        this.subsetPanel = new Portal.details.SubsetPanel(cfg);
        this.infoPanel = new Portal.details.InfoPanel(cfg);
        this.layerDetailsPanel = new Portal.details.LayerDetailsPanel(cfg);

        var config = Ext.apply({
            activeTab: 0,
            items: [
                this.subsetPanel,
                this.infoPanel,
                this.layerDetailsPanel
            ]
        }, cfg);

        Portal.details.SubsetItemsTabPanel.superclass.constructor.call(this, config);
    }
});

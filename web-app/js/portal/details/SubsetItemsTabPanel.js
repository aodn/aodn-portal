/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetItemsTabPanel = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {
        var childPanelConfig =  { map: cfg.map, layer: cfg.layer };

        this.subsetPanel = new Portal.details.SubsetPanel(childPanelConfig);
        this.infoPanel = Ext4.createWrapped('Portal.details.InfoPanel', childPanelConfig);
        this.stylePanel = new Portal.details.StylePanel(childPanelConfig);

        var config = Ext.apply({
            activeTab: 0,
            items: [
                this.subsetPanel,
                this.infoPanel,
                this.stylePanel
            ],
            listeners: {
                beforetabchange: this._doTracking
            }
        }, cfg);

        Portal.details.SubsetItemsTabPanel.superclass.constructor.call(this, config);
    },

    _doTracking: function(tabPanel, newTab, oldTab){
        if(oldTab) {
            trackUsage(OpenLayers.i18n('subsetItemsTrackingCategory'),
                OpenLayers.i18n('subsetItemsTabsTrackingAction'),
                newTab.title,
                this.layer.name
            );
        }
        return true;
    }
});

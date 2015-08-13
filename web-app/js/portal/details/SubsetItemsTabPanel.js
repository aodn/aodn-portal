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

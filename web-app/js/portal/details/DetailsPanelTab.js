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
        this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(childPanelConfig);

        var config = Ext.apply({
            autoHeight: true,
            defaults: {
                style: {padding:'10px 15px 10px 10px'},
                autoHeight: true
            },
            border: false,
            activeTab: 0,
            items: [
                this.subsetPanel,
                this.infoPanel,
                this.stylePanel,
                this.mapOptionsPanel
            ],
            listeners: {
                beforetabchange: this._doTracking
            }
        }, cfg);

        Portal.details.DetailsPanelTab.superclass.constructor.call(this, config);
    },

    _doTracking: function(tabPanel, newTab, oldTab){
        if(oldTab) {
            trackUsage(OpenLayers.i18n('detailsTrackingCategory'),
                OpenLayers.i18n('detailsTabsTrackingAction'),
                newTab.title
            );
        }
        return true;
    }
});

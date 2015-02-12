/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanelAccordion = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        //var childPanelConfig =  { map: cfg.map, layer: cfg.layer, mapPanel: cfg.mapPanel };

        //this.subsetPanel = new Portal.details.SubsetPanel(childPanelConfig);
        //this.infoPanel = new Portal.details.InfoPanel(childPanelConfig);
        //this.stylePanel = new Portal.details.StylePanel(childPanelConfig);
        //this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(childPanelConfig);

        var config = Ext.apply({
            //containerScroll: true,
            //cls: "search-filter-panel filter-selection-panel",
            defaults: {
                // applied to each contained panel
                bodyStyle: 'padding:15px',
                layout:'fit'
            },
            cls: 'detailsPanelAccordion',
            layout:'accordion',
            autoScroll: true,
            layoutConfig: {
                // layout-specific configs go here
                animate: true
                //fill: true,
            },
            //titleCollapse: true,
            closable:true,
            listeners: {
                beforeAdd : this.collapseAll,
                beforetabchange: this._doTracking
            }
        }, cfg);

        Portal.details.DetailsPanelAccordion.superclass.constructor.call(this, config);
    },

    collapseAll: function(accordion, newItem, index) {
        this.items.each(function(f){
            f.collapse();
        });
    },

    _doTracking: function(tabPanel, newTab, oldTab) {
        /*        if(oldTab) {
         trackUsage(OpenLayers.i18n('detailsTrackingCategory'),
         OpenLayers.i18n('detailsTabsTrackingAction'),
         newTab.title,
         this.layer.name
         );
         }
         return true;*/
    }

});

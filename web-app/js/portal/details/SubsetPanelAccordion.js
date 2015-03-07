/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetPanelAccordion = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        //var childPanelConfig =  { map: cfg.map, layer: cfg.layer, mapPanel: cfg.mapPanel };

        //this.infoPanel = new Portal.details.InfoPanel(childPanelConfig);
        //this.stylePanel = new Portal.details.StylePanel(childPanelConfig);
        //this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(childPanelConfig);

        var config = Ext.apply({
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
            },
            closable:true,
            listeners: {
                beforeAdd : this.collapseAll,
                beforetabchange: this._doTracking
            }
        }, cfg);

        Portal.details.SubsetPanelAccordion.superclass.constructor.call(this, config);
    },

    collapseAll: function(accordion, newItem, index) {
        this.items.each(function(f){
            f.collapse();
        });
    },

    _doTracking: function(tabPanel, newTab, oldTab) {
        if (oldTab) {
            trackUsage(OpenLayers.i18n('detailsTrackingCategory'),
                OpenLayers.i18n('detailsTabsTrackingAction'),
                newTab.title,
                this.layer.name
            );
        }
        return true;
    }

});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetPanelAccordion = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        var config = Ext.apply({
            cls: 'subsetPanelAccordion',
            layout:'accordion',
            autoScroll: true,
            layoutConfig: {
                animate: true,
                collapseFirst: true,
                fill: true
            },
            listeners: {
                beforeAdd: this.collapseAll,
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
            trackUsage(OpenLayers.i18n('subsetItemsTrackingCategory'),
                OpenLayers.i18n('subsetItemsTabsTrackingAction'),
                newTab.title,
                this.layer.name
            );
        }
        return true;
    }

});

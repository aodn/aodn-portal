/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetPanelAccordion = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({
            cls: 'subsetPanelAccordion',
            layout: 'accordion',
            autoScroll: true,
            layoutConfig: {
                hideCollapseTool: true
            },
            listeners: {
                beforeAdd: this.collapseAll
            }
        }, cfg);

        Portal.details.SubsetPanelAccordion.superclass.constructor.call(this, config);
    },

    collapseAll: function() {
        this.items.each(function(f) {
            f.collapse();
        });
    }
});

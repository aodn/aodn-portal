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
            layout: 'noncollapsingaccordion',
            autoScroll: true,
            layoutConfig: {
                animate: true,
                hideCollapseTool: true
            }
        }, cfg);

        Portal.details.SubsetPanelAccordion.superclass.constructor.call(this, config);
    }
});

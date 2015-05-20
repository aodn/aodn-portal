/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var panelType = cfg.layer.isNcwms() ? Portal.details.NcWmsPanel : Portal.filter.ui.FilterGroupPanel;
        var newPanel = new panelType({
            map: cfg.map,
            layer: cfg.layer
        });

        var config = Ext.apply({
            title: '<h4>' + cfg.layer.name + '</h4>',
            hideMode: 'offsets', // fixes #1278
            items: [newPanel]
        }, cfg);

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);
    }
});

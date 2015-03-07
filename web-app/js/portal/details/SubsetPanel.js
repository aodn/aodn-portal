/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.layer = cfg.layer;
        var items = [];

        if (this.layer.isNcwms()) {
            var ncwmsPanel = new Portal.details.NcWmsPanel({
                map: cfg.map,
                layer: cfg.layer
            });

            items.push(ncwmsPanel);
        }
        else {
            var filterGroupPanel = new Portal.filter.FilterGroupPanel({
                map: cfg.map,
                layer: cfg.layer
            });

            items.push(filterGroupPanel);
        }

        var config = Ext.apply({
            title: '<h4>' + cfg.layer.name + '</h4>',
            autoHeight: true,
            items: items
        }, cfg);

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);
    }
});

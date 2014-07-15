/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.ncwmsPanel = new Portal.details.NcWmsPanel({
            map: cfg.map
        });

        var config = Ext.apply({
            title: OpenLayers.i18n('subsetPanelTitle'),
            layout: new Ext.layout.CardLayout(),
            items: [
                this.ncwmsPanel
            ]
        }, cfg);

        this.filterGroupPanels = {};

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);
    },

    handleLayer: function(layer, show, hide, target) {

        if (layer.isNcwms()) {
            this.layout.setActiveItem(this.ncwmsPanel.id);
            this.ncwmsPanel.handleLayer(layer, show, hide, target);
        }
        else {
            this._extJsLayoutHack(layer);
            this.layout.setActiveItem(this.filterGroupPanel.id);
            this.filterGroupPanel.handleLayer(layer, show, hide, target);
        }
    },

    _extJsLayoutHack: function(layer) {
        if (!layer.isNcwms()) {
            if (!this.filterGroupPanels[layer.id]) {
                var filterGroupPanel = new Portal.filter.FilterGroupPanel();
                this.add(filterGroupPanel);
                this.filterGroupPanels[layer.id] = filterGroupPanel;
            }

            this.filterGroupPanel = this.filterGroupPanels[layer.id];
        }
    }
});

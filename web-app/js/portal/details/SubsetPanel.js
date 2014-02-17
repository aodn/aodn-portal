
/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.aodaacPanel = new Portal.details.AodaacPanel({
            map: cfg.map
        });

        var config = Ext.apply({
            title: OpenLayers.i18n('subsetPanelTitle'),
            layout: new Ext.layout.CardLayout(),
            items: [
                this.aodaacPanel
            ]
        }, cfg);

        this.fgps = {};

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);
    },

    handleLayer: function(layer, show, hide, target) {

        this._extJsLayoutHack(layer);
        if (layer.isNcwms()) {
            this.layout.setActiveItem(this.aodaacPanel.id);
            this.aodaacPanel.handleLayer(layer, show, hide, target);
        }
        else {
            this.layout.setActiveItem(this.filterGroupPanel.id);
            this.filterGroupPanel.handleLayer(layer, show, hide, target);
        }
    },

    _extJsLayoutHack: function(layer) {
        if (!layer.isNcwms()) {
            if (!this.fgps[layer.id]) {
                var filterGroupPanel = new Portal.filter.FilterGroupPanel();
                this.add(filterGroupPanel);
                this.fgps[layer.id] = filterGroupPanel;
            }

            this.filterGroupPanel = this.fgps[layer.id];
        }
    }
});

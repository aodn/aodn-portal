
/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.filterGroupPanel = new Portal.filter.FilterGroupPanel();
        this.aodaacPanel = new Portal.details.AodaacPanel({
            map: cfg.map
        });

        var config = Ext.apply({
            title: OpenLayers.i18n('subsetPanelTitle'),
            layout: new Ext.layout.CardLayout(),
            items: [
                this.filterGroupPanel,
                this.aodaacPanel
            ]
        }, cfg);

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);
    },

    handleLayer: function(layer, show, hide, target) {

        this._extJsLayoutHack();

        if (layer.isNcwms()) {
            this.layout.setActiveItem(this.aodaacPanel.id);
        }
        else {
            this.layout.setActiveItem(this.filterGroupPanel.id);
        }

        // Probably only need to call one or the other of these depending on which one is active (see above)
        // - but for now, keeping same behaviour as before.
        this.aodaacPanel.handleLayer(layer, show, hide, target);
        this.filterGroupPanel.handleLayer(layer, show, hide, target);
    },

    _extJsLayoutHack: function() {
        // TODO: hopefully can remove this? Haven't got a test for it.
        // Remove filter pane; and add afresh to avoid ExtJS layout bug
        this.remove(this.filterGroupPanel);
        this.filterGroupPanel = new Portal.filter.FilterGroupPanel();
        this.insert(0, this.filterGroupPanel);
    }
});

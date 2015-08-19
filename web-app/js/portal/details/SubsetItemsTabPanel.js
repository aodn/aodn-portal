/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetItemsTabPanel = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {
        this.filterGroupPanel = this._newFilterGroupPanel(cfg);
        this.infoPanel = new Portal.details.InfoPanel(cfg);
        this.layerDetailsPanel = new Portal.details.LayerDetailsPanel(cfg);

        var config = Ext.apply({
            activeTab: 0,
            items: [
                this.filterGroupPanel,
                this.infoPanel,
                this.layerDetailsPanel
            ]
        }, cfg);

        Portal.details.SubsetItemsTabPanel.superclass.constructor.call(this, config);
    },

    _newFilterGroupPanel: function(cfg) {
        var filterGroupPanel = cfg.dataCollection.isNcwms() ?
            new Portal.details.NcWmsPanel(cfg) : new Portal.filter.ui.FilterGroupPanel(cfg);
        filterGroupPanel.title = OpenLayers.i18n('subsetPanelTitle');

        return filterGroupPanel;
    }
});

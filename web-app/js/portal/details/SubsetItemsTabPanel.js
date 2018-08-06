Ext.namespace('Portal.details');

Portal.details.SubsetItemsTabPanel = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {

        var childPanelConfig =  {
            map: cfg.map,
            dataCollection: cfg.dataCollection,
            dataCollectionStore: cfg.dataCollectionStore
        };

        this.filterGroupPanel = this._newFilterGroupPanel(childPanelConfig);
        this.infoPanel = new Portal.details.InfoPanel(childPanelConfig);
        this.layerDetailsPanel = new Portal.details.LayerDetailsPanel(childPanelConfig);

        var config = Ext.apply({
            activeTab: this.getInitTab(cfg.dataCollection),
            items: [
                this.filterGroupPanel,
                this.infoPanel,
                this.layerDetailsPanel
            ]
        }, cfg);

        Portal.details.SubsetItemsTabPanel.superclass.constructor.call(this, config);
    },

    getInitTab: function(dataCollection) {
        return (dataCollection.shareLinkUsed && dataCollection.shareLinkUsed == true) ? 1: 0;
    },

    _newFilterGroupPanel: function(cfg) {

        var filterGroupPanel;

        if (cfg.dataCollection.isAla()) {
            filterGroupPanel = new Portal.filter.ui.AlaFilterGroupPanel(cfg);
        }
        else if (cfg.dataCollection.isNcwms()) {
            filterGroupPanel = new Portal.details.NcWmsPanel(cfg);
        }
        else {
            filterGroupPanel = new Portal.filter.ui.FilterGroupPanel(cfg);
        }

        filterGroupPanel.title = OpenLayers.i18n('subsetPanelTitle');

        return filterGroupPanel;
    }
});

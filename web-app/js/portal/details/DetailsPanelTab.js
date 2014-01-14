
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanelTab = Ext.extend(Ext.TabPanel, {

    constructor: function (cfg) {
        var config = Ext.apply({
            defaults: {
                margin: 10
            },
            ref: 'detailsPanelTabs',
            border: false,
            activeTab: 0,
            enableTabScroll: true,
            cls: 'floatingDetailsPanelContent',
            flex: 1
        }, cfg);

        Portal.details.DetailsPanelTab.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        this.filterGroupPanel = new Portal.filter.FilterGroupPanel();
        this.aodaacPanel = new Portal.details.AodaacPanel({ map: this.map });
        this.infoPanel = new Portal.details.InfoPanel();
        this.stylePanel = new Portal.details.StylePanel();

        this.items = [
            this.filterGroupPanel,
            this.aodaacPanel,
            this.infoPanel,
            this.stylePanel
        ];

        Portal.details.DetailsPanelTab.superclass.initComponent.call(this);
    },

    handleLayer: function(layer) {
        this._ensurePanelsRendered();
        // Remove filter pane; and add afresh to avoid ExtJS layout bug
        this.remove(this.filterGroupPanel);
        this.filterGroupPanel = new Portal.filter.FilterGroupPanel();
        this.filterGroupPanel.handleLayer(layer, this._showTab, this._hideTab, this);

        if (this.grailsLayerId) {
            this.insert(0, this.filterGroupPanel);
        }

        this.aodaacPanel.handleLayer(layer, this._showTab, this._hideTab, this);
        this.infoPanel.handleLayer(layer, this._showTab, this._hideTab, this);
        this.stylePanel.handleLayer(layer, this._showTab, this._hideTab, this);

        this.show();
    },

    _ensurePanelsRendered: function() {
        var items = this.items.items;
        for (var i = items.length - 1; i >= 0; i--) {

            items[i].show();
        }
    },

    _hideTab: function(tab) {
        this.hideTabStripItem(tab.id);
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items.get(i);
            if (item) {
                if (Ext.get(this.getTabEl(item)) // tests fail without this test (but they shouldn't).
                    && Ext.get(this.getTabEl(item)).isVisible())
                {
                    this.setActiveTab(item);
                    i = this.items.length;
                }
            }
        }
    },

    _showTab: function(tab) {
        this.unhideTabStripItem(tab.id);
    }
});

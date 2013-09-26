
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

        this.infoPanel = new Portal.details.InfoPanel();
        this.stylePanel = new Portal.details.StylePanel();
        this.aodaacPanel = new Portal.details.AodaacPanel({ map: this.map });
        this.filterPanel = new Portal.filter.FilterPanel();

        this.items = [
            this.filterPanel,
            this.aodaacPanel,
            this.infoPanel,
            this.stylePanel
        ];

        Portal.details.DetailsPanelTab.superclass.initComponent.call(this);
    },

    update: function(layer) {
        //Update the other tab panels
        this.stylePanel.update(layer, this._showTab, this._hideTab, this);
        this.infoPanel.update(layer, this._showTab, this._hideTab, this);
        this.aodaacPanel.update(layer, this._showTab, this._hideTab, this);

        /**
         This seems like the neatest way to stop the table layout from keep appending
         rows (despite removeAll called) to the layout, thus pushing elements further down
         the panel.
         **/
        this.remove(this.filterPanel);
        this.filterPanel = new Portal.filter.FilterPanel();
        this.insert(0, this.filterPanel);  // filter tab first when shown
        this.filterPanel.update(layer, this._showTab, this._hideTab, this);

        this.show();
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

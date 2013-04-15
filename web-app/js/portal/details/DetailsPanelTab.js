
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanelTab = Ext.extend(Ext.TabPanel, {

    constructor: function(cfg) {
    	var config = Ext.apply({
    defaults: {
        margin: 10
    },
    id: 'detailsPanelTabs',
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
        this.aodaacPanel = new Portal.details.AodaacPanel();
        this.filterPanel = new Portal.filter.FilterPanel();

        this.items = [
            this.infoPanel,
            this.stylePanel,
            this.aodaacPanel,
            this.filterPanel
        ];

        Portal.details.DetailsPanelTab.superclass.initComponent.call(this);
    },

    update: function(layer) {

    	//Update the other tab panels
        this.stylePanel.update( layer, this._showTab, this._hideTab, this );
        this.infoPanel.update( layer, this._showTab, this._hideTab, this );
        this.aodaacPanel.update( layer, this._showTab, this._hideTab, this );

		/**
			This seems like the neatest way to stop the table layout from keep appending
			rows (despite removeAll called) to the layout, thus pushing elements further down
			the panel.
		**/
        this.remove(this.filterPanel);
        this.filterPanel = new Portal.filter.FilterPanel();
        this.add(this.filterPanel);
        this.filterPanel.update( layer, this._showTab, this._hideTab, this );
//        this._hideTab(this.filterPanel);

        this.show();
    },

    _hideTab: function(tab) {
    	this.hideTabStripItem(tab.id);
    	for(var i = 0; i < this.items.length; i++) {
    		var item = this.items.get(i);
    		if (item) {
		    	if (Ext.get(this.getTabEl(item)).isVisible()) {
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

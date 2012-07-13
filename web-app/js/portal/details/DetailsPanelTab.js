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

        this.items = [
            this.infoPanel,
            this.stylePanel,
            this.aodaacPanel
        ];

        Portal.details.DetailsPanelTab.superclass.initComponent.call(this);
    },

    update: function(layer) {

    	//Update the other tab panels
        this.stylePanel.update( layer, this._showTab, this._hideTab, this );
        this.infoPanel.update( layer, this._showTab, this._hideTab, this );
        this.aodaacPanel.update( layer, this._showTab, this._hideTab, this );

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
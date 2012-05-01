Ext.namespace('Portal.details');

Portal.details.DetailsPanelTab = Ext.extend(Ext.TabPanel, {
    defaults: {
        margin: 10,
        autoScroll: true
    },
    id: 'detailsPanelTabs',
    ref: 'detailsPanelTabs',
    border: false,
    activeTab: 0,
    enableTabScroll: true,

    cls: 'floatingDetailsPanelContent',

    initComponent: function(){
        this.stylePanel = new Portal.details.StylePanel();
        this.animationPanel = new Portal.details.AnimationPanel();

        this.items = [
            this.stylePanel,
            this.animationPanel
        ];

        Portal.details.DetailsPanelTab.superclass.initComponent.call(this);
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
        this.stylePanel.setSelectedLayer(layer);
        this.animationPanel.setSelectedLayer(layer);
    },

    update: function(){
        this.stylePanel.updateStyles();
        this.animationPanel.update();
    }

});
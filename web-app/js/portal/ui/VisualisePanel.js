Ext.namespace('Portal.ui');

Portal.ui.VisualisePanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.mapPanel = cfg.mapPanel;
        this.mapPanel.region = 'center';

        var globalGeometryFilterPanel = new Portal.details.GlobalGeometryFilterPanel({
            map: this.mapPanel.map,
            hideLabel: false
        });

        this.detailsPanel = new Portal.details.SubsetPanel({
            region: 'west',
            collapsible: true,
            collapsed: false,
            collapseMode: 'mini',
            margins: {top:0, right:10, bottom:0, left:0},
            width: 355,
            map: this.mapPanel.map,
            mapPanel: this.mapPanel,
            dataCollectionStore: cfg.dataCollectionStore,
            globalGeometryFilterPanel: globalGeometryFilterPanel
        });

        var config = Ext.apply({
            layout: 'border',
            id: 'visualisePanel',
            stateful: false,
            items: [
                this.mapPanel,
                this.detailsPanel
            ]
        }, cfg);

        Portal.ui.VisualisePanel.superclass.constructor.call(this, config);

        this.on('beforehide', function() { this.onBeforeHide() }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, function() {
            this.detailsPanel.expand();
        }, this);
    },

    onBeforeHide: function() {
        this.mapPanel.beforeParentHide();
    }
});

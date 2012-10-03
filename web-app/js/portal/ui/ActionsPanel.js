Ext.namespace('Portal.ui');

Portal.ui.ActionsPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(cfg);
        this.activeLayersPanel = new Portal.ui.ActiveLayersPanel(cfg);
        var config = Ext.apply({
            id: 'activeMenuPanel',
		    flex: 1,
		    padding: '0px 0px 20px 0px',
            autoScroll: true,
		    minHeight: 100,
		    items:[
		        this.mapOptionsPanel,
		        this.activeLayersPanel
		    ]
		}, cfg);
		Portal.ui.ActionsPanel.superclass.constructor.call(this, config);

		this.addEvents('removelayer', 'zoomtolayer', 'togglevisibility');
        this.relayEvents(this.activeLayersPanel, ['removelayer', 'zoomtolayer', 'togglevisibility']);
        this.relayEvents(this.mapOptionsPanel, ['removealllayers', 'resetmap', 'hidelayeroptionschecked', 'hidelayeroptionsunchecked', 'autozoomchecked', 'autozoomunchecked']);

        //
        // This panel (which contains both the MapOptions and the ActiveLayers), needs to
        // orchestrate event handling between the two child panels, specifically when the
        // auto zoom check box is toggled and when a different active layer is selected.
        //
        this.activeLayersPanel.on('selectedactivelayerchanged', function()
        {
            if (this.autoZoomEnabled())
            {
                this.activeLayersPanel.zoomToLayer();
            }
        }, this);

        this.mapOptionsPanel.on('autozoomchecked', function()
        {
            this.activeLayersPanel.zoomToLayer();
        }, this);
    },

    initBaseLayerCombo: function() {
        this.mapOptionsPanel.initBaseLayerCombo();
    },

    getActiveLayerNodes: function() {
        return this.activeLayersPanel.getActiveLayerNodes();
    },

    layerOptionsVisible: function() {
        return this.mapOptionsPanel.layerOptionsVisible();
    },

    autoZoomEnabled: function() {
        return this.mapOptionsPanel.autoZoomEnabled();
    },

	loadSnapshot: function(id) {
        this.mapOptionsPanel.loadSnapshot(id);
    }
});
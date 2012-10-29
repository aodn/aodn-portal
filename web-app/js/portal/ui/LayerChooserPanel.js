Ext.namespace('Portal.ui');

Portal.ui.LayerChooserPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.appConfig = cfg.appConfig;
        this.mapPanel = cfg.mapPanel;
        this.initLeftTabMenuPanel(this.appConfig);

        var config = Ext.apply({
            id: "leftMenus",
            width: 340,
            minWidth: 300,
            maxWidth: 460,
            margins : {left:5},
            padding: 4,
            collapsible: true,
            stateful: false,
            split: true,
            headerCfg:  {
                cls: 'menuHeader',
                html: 'Message'
            },
            title: OpenLayers.i18n('layerChooserMenuHeader'),
            layout: 'vbox',
            layoutConfig: {
              align: 'stretch'
            },
            autoScroll: true,
            items: [
                this.leftTabMenuPanel
            ],
            cls: 'leftMenus'
        }, cfg);

        Portal.ui.LayerChooserPanel.superclass.constructor.call(this, config);

        this.registerEvents();

        this.addEvents('addlayerclicked');
    },

    initLeftTabMenuPanel: function(appConfig) {
        this.leftTabMenuPanel = new Portal.ui.MapMenuPanel({
            menuId: appConfig.defaultMenu.id
        });
    },

    registerEvents: function() {
        this.registerOwnEvents();
        this.registerMapPanelEvents();
        this.registerMonitoringEvents();
    },

    registerOwnEvents: function() {

        this.on('beforeexpand', function() {
            this.layerSwitcher.destroy();
        }, this);

        this.on('beforecollapse', function() {
            this.layerSwitcher = new OpenLayers.Control.LayerSwitcher({
                roundedCornerColor: '#34546E'
            });
            this.mapPanel.map.addControl(this.layerSwitcher);
        }, this);
    },

    registerMapPanelEvents: function() {
		this.mon(this.mapPanel, 'removelayer', this.removeLayer, this);
		this.mon(this.mapPanel, 'removealllayers', function() {
			this.leftTabMenuPanel.toggleNodeBranch(true);
		}, this);
		 this.mon(this.mapPanel, 'resetmap', function() {
			this.leftTabMenuPanel.toggleNodeBranch(true);
		}, this);
	},

    registerMonitoringEvents: function() {
        this.mon(this.leftTabMenuPanel, 'click', this.onMenuNodeClick, this);
    },

    onMenuNodeClick: function(node) {
        if (node.attributes.grailsLayerId) {
            this.fireEvent('addlayerclicked');
            this.mapPanel.addGrailsLayer(node.attributes.grailsLayerId);
        }
    },

    removeLayer: function(openLayer, newDetailsPanelLayer) {

        this.leftTabMenuPanel.toggleLayerNodes(openLayer.grailsLayerId, true);
    },

    addMapLayer: function(layerDescriptor, showLoading) {
        this.mapPanel.addLayer(this.mapPanel.getOpenLayer(layerDescriptor), showLoading);
    }
});
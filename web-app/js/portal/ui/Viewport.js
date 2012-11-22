
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function(cfg) {
        this.mainTabPanel = new Portal.ui.MainTabPanel({
            region: 'center'
        });

        this.layerChooserPanel = new Portal.ui.LayerChooserPanel({
            region: 'west',
            appConfig: cfg.appConfig,
            mapPanel: this.mainTabPanel.getMapPanel()
            // width: cfg.appConfig.westWidth // Todo - DN: Max and min are specified in JS, should default be too?
        });

        var config = Ext.apply({
            layout: 'border',
            boxMinWidth: 1050,
            items: [
                {
                    unstyled: true,
                    region: 'north',
                    height: cfg.appConfig.headerHeight + 15
                },
                this.mainTabPanel,
                {
                    region: 'south',
                    height: 15,
                    unstyled: true
                },
                this.layerChooserPanel

            ]}, cfg);

        Portal.ui.Viewport.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.ui.Viewport.superclass.initComponent.call(this);

        this.mon(this.layerChooserPanel, 'addlayerclicked', this.onLayerChooserAddLayerClicked, this);

        Ext.MsgBus.subscribe( 'facetedSearch.layerSelected', this.onLayerChooserAddLayerClicked, this );

        //TODO: find a better home for this
        this.on('afterrender', function() {
            jQuery("#loader").hide('slow'); // close the loader
        });
    },

    onLayerChooserAddLayerClicked: function() {
        if (this.mainTabPanel.homePanelActive()) {
            this.mainTabPanel.showPortalPanel();
        }
    },

    setActiveTab: function(tabIndex) {
        this.mainTabPanel.setActiveTab(tabIndex);
    },

    isMapVisible: function() {
        return this.mainTabPanel.isMapVisible();
    },

	onResetMap: function() {
		// centre map and set zoom clear layers
		//
		// and details panel
		this.mainTabPanel.getPortalPanel().getRightDetailsPanel().collapseAndHide();
	},

    showSnapshot: function(id) {
        this.mainTabPanel.loadSnapshot(id);
    }
});

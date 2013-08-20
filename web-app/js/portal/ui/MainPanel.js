/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

// Tab indexes (global)
TAB_INDEX_HOME = 0;
TAB_INDEX_MAP = 1;
TAB_INDEX_SEARCH = 2;
TAB_INDEX_DOWNLOAD_CART = 3;

Portal.ui.MainPanel = Ext.extend(Ext.Panel, {

    constructor:function (cfg) {

        Ext.apply(this, cfg);

        this.portalPanel = new Portal.ui.PortalPanel({appConfig:Portal.app.config});
        this.searchTabPanel = this._initSearchTabPanel(cfg);
        this.homePanel = new Portal.ui.HomePanel({appConfig:Portal.app.config});
        this.downloadCartPanel = new Portal.cart.DownloadPanel()

        var config = Ext.apply({
            activeItem: TAB_INDEX_SEARCH,
            margins: {
                left: 5,
                right: 5
            },
            unstyled:true,
            layout: 'card',
            items:[
                this.homePanel,
                this.portalPanel,
                this.searchTabPanel,
                this.downloadCartPanel
            ]
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe('selectedLayerChanged', this.onSelectedLayerChange, this);
    },

    _initSearchTabPanel: function(cfg) {

        if (this.appConfigStore.isFacetedSearchEnabled()) {
            return new Portal.ui.search.SearchPanel({
                itemId: 'searchPanel',
                proxyUrl: proxyURL,
		        catalogUrl: Portal.app.config.catalogUrl,
                spatialSearchUrl: this.appConfigStore.getById('spatialsearch.url').data.value,
		        protocols: Portal.app.config.metadataLayerProtocols.split("\n").join(' or '),
		        dragAndDrop: cfg.dragAndDrop,
                resultGridSize: 10
		    });
        }
        else {
            return new Portal.search.SearchTabPanel({mapPanel:this.getMapPanel()});
        }
    },

    getPortalPanel:function () {
        return this.portalPanel;
    },

    getMapPanel:function () {
        return this.portalPanel.getMapPanel();
    },

    homePanelActive:function () {
        return this.getActiveTab() === this.homePanel;
    },

    showPortalPanel:function () {
        this.setActiveTab(TAB_INDEX_MAP);
    },

    getActiveTab: function() {
        return this.layout.activeItem;
    },

    setActiveTab:function (item) {

        this.layout.setActiveItem(item);

        // Portal.ui.MainPanel.superclass.setActiveTab.call(this, item);

        if (!this.isMapVisible()) {
            this.portalPanel.getMapPanel()._closeFeatureInfoPopup();
        }

        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        //TODO: componentise this
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
        jQuery('#viewPortTab' + tabIndex).addClass('viewPortTabActive');
    },

    isMapVisible:function () {
        return this.isMapSelected();
    },

    isMapSelected:function () {
        return this.getActiveTab() === this.portalPanel;
    },

    onSelectedLayerChange:function () {
        if (this.homePanelActive()) {
            this.showPortalPanel();
        }
    }
});

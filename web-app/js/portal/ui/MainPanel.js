/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

TAB_INDEX_SEARCH = 0;
TAB_INDEX_VISUALIZE = 1;
TAB_INDEX_DOWNLOAD = 2;

Portal.ui.MainPanel = Ext.extend(Ext.Panel, {

    constructor:function (cfg) {

        Ext.apply(this, cfg);

        this.searchTabPanel = this._initSearchTabPanel(cfg);
        this.visualizePanel = new Portal.ui.VisualizePanel({appConfig:Portal.app.config});
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
                this.searchTabPanel,
                this.visualizePanel,
                this.downloadCartPanel
            ]
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);
    },

    afterRender: function() {
        Portal.ui.MainPanel.superclass.afterRender.call(this);
        this._highlightActiveTab();
    },

    _initSearchTabPanel: function(cfg) {

        return new Portal.ui.search.SearchPanel({
            itemId: 'searchPanel',
            proxyUrl: proxyURL,
            catalogUrl: Portal.app.config.catalogUrl,
            spatialSearchUrl: this.appConfigStore.getById('spatialsearch.url').data.value,
            protocols: Portal.app.config.metadataLayerProtocols.split("\n").join(' or '),
            dragAndDrop: cfg.dragAndDrop,
            resultGridSize: 10
        });
    },

    getMapPanel:function () {
        return this.visualizePanel.getMapPanel();
    },

    getActiveTab: function() {
        return this.layout.activeItem;
    },

    setActiveTab:function (item) {

        this.layout.setActiveItem(item);

        if (!this.isMapVisible()) {
            this.visualizePanel.getMapPanel()._closeFeatureInfoPopup();
        }

        this._highlightActiveTab();
    },

    _highlightActiveTab: function() {
        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        //TODO: componentise this
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
        jQuery('#viewPortTab' + tabIndex).removeClass('viewPortTabDisabled').addClass('viewPortTabActive');
    },

    isMapVisible:function () {
        return this.isMapSelected();
    },

    isMapSelected:function () {
        return this.getActiveTab() === this.visualizePanel;
    }
});

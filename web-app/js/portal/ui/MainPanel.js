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

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        this.searchTabPanel = this._initSearchTabPanel(cfg);
        this.visualisePanel = new Portal.ui.VisualisePanel({appConfig:Portal.app.config});
        this.downloadPanel = new Portal.cart.DownloadPanel();

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
                this.visualisePanel,
                this.downloadPanel
            ]
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);
    },

    afterRender: function() {
        Portal.ui.MainPanel.superclass.afterRender.call(this);
        this._highlightActiveTab();
    },

    _initSearchTabPanel: function() {

        return new Portal.ui.search.SearchPanel({
            itemId: 'searchPanel',
            proxyUrl: proxyURL,
            catalogUrl: Portal.app.config.catalogUrl,
            spatialSearchUrl: this.appConfigStore.getById('spatialsearch.url').data.value,
            protocols: Portal.app.config.metadataLayerProtocols.split("\n").join(' or ')
        });
    },

    getActiveTab: function() {
        return this.layout.activeItem;
    },

    setActiveTab: function(tabIndex) {

        var previousSelectedTabIndex = this._getIndexFor(this.getActiveTab());

        this._notifyPanelBeforeSelection(tabIndex);

        this.layout.setActiveItem(tabIndex);

        this._notifyPanelAfterDeselection(previousSelectedTabIndex);

        this._highlightActiveTab();
    },

    _notifyPanelBeforeSelection: function(index) {

        var panel = this._getTabPanelFor(index);

        if (panel && panel.beforeDisplay) {

            panel.beforeDisplay();
        }
    },

    _notifyPanelAfterDeselection: function(index) {

        var panel = this._getTabPanelFor(index);

        if (panel && panel.afterHide) {

            panel.afterHide();
        }
    },

    _getTabPanelFor: function(index) {

        return this._getTabPanelItems()[index];
    },

    _getIndexFor: function(panel) {

        return this._getTabPanelItems().indexOf(panel);
    },

    _getTabPanelItems: function() {

        return this.items.items;
    },

    _highlightActiveTab: function() {
        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        //TODO: componentise this
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
        jQuery('#viewPortTab' + tabIndex).removeClass('viewPortTabDisabled').addClass('viewPortTabActive');
    }
});

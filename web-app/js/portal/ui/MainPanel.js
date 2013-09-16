/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

TAB_INDEX_SEARCH = 0;
TAB_INDEX_VISUALISE = 1;
TAB_INDEX_DOWNLOAD = 2;

Portal.ui.MainPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        this.mapPanel = new Portal.ui.MapPanel();

        this.searchPanel = new Portal.ui.search.SearchPanel({ mapPanel: this.mapPanel });
        this.visualisePanel = new Portal.ui.VisualisePanel({ mapPanel: this.mapPanel });
        this.downloadPanel = new Portal.cart.DownloadPanel();

        this.addEvents('tabchange');

        var config = Ext.apply({
            activeItem: TAB_INDEX_SEARCH,
            margins: {
                left: 5,
                right: 5
            },
            unstyled: true,
            layout: 'card',
            items: [
                this.searchPanel,
                this.visualisePanel,
                this.downloadPanel
            ],
            bbar: new Portal.ui.MainToolbar({
                mainPanel: this
            })
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe('viewgeonetworkrecord', this._onViewGeoNetworkRecord, this);
    },

    _onViewGeoNetworkRecord: function() {
        this.setActiveTab(TAB_INDEX_VISUALISE);
    },

    afterRender: function() {
        Portal.ui.MainPanel.superclass.afterRender.call(this);
        this._highlightActiveTab();
    },

    getActiveTab: function() {
        return this.layout.activeItem;
    },

    setActiveTab: function(tabIndex) {
        this.layout.setActiveItem(tabIndex);
        this._highlightActiveTab();
        this.fireEvent('tabchange', this);
    },

    hasNextTab: function() {
        return this.layout.activeItem != this.downloadPanel
    },

    hasPrevTab: function() {
        return this.layout.activeItem != this.searchPanel
    },

    navigateToNextTab: function() {
        if (this._getActiveItemIndex() < TAB_INDEX_DOWNLOAD) {
            this.setActiveTab(this._getActiveItemIndex() + 1);
        }
    },

    navigateToPrevTab: function() {
        if (this._getActiveItemIndex() > TAB_INDEX_SEARCH) {
            this.setActiveTab(this._getActiveItemIndex() - 1);
        }
    },

    _getActiveItemIndex: function() {
        var activeItemIndex;
        if (this.layout.activeItem == TAB_INDEX_SEARCH || this.layout.activeItem == this.searchPanel) {
            activeItemIndex = TAB_INDEX_SEARCH;
        }
        else if (this.layout.activeItem == TAB_INDEX_VISUALISE || this.layout.activeItem == this.visualisePanel) {
            activeItemIndex = TAB_INDEX_VISUALISE;
        }
        else if (this.layout.activeItem == TAB_INDEX_DOWNLOAD || this.layout.activeItem == this.downloadPanel) {
            activeItemIndex = TAB_INDEX_DOWNLOAD;
        }

        return activeItemIndex;
    },

    _highlightActiveTab: function() {
        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        //TODO: componentise this
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
        jQuery('#viewPortTab' + tabIndex).removeClass('viewPortTabDisabled').addClass('viewPortTabActive');
    }
});

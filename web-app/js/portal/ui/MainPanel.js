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

        var config = Ext.apply({
            activeItem: TAB_INDEX_SEARCH,
            margins: {
                left: 5,
                right: 5
            },
            unstyled:true,
            layout: 'card',
            items:[
                this.searchPanel,
                this.visualisePanel,
                this.downloadPanel
            ]
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe('activegeonetworkrecordadded', this._onActiveGeoNetworkRecordAdded, this);
    },

    _onActiveGeoNetworkRecordAdded: function() {
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
    },

    _highlightActiveTab: function() {
        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        //TODO: componentise this
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
        jQuery('#viewPortTab' + tabIndex).removeClass('viewPortTabDisabled').addClass('viewPortTabActive');
    }
});

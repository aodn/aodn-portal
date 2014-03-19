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

        var visualiseLayerStore = new Portal.data.LayerStore();

        // TODO: probably we can remove this 'singleton' type access to the 'ActiveGeoNetworkRecordStore'
        // and only pass it down to the components that actually need access to it.
        Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE =
            new Portal.data.ActiveGeoNetworkRecordStore({
                layerStore: visualiseLayerStore
            });

        this.mapPanel = new Portal.ui.MapPanel({
            layers: visualiseLayerStore
        });
        this.searchPanel = new Portal.ui.search.SearchPanel({
            mapPanel: this.mapPanel
        });
        this.visualisePanel = new Portal.ui.VisualisePanel({
            mapPanel: this.mapPanel
        });
        this.downloadPanel = new Portal.cart.DownloadPanel({
            navigationText: OpenLayers.i18n('navigationButtonDownload'),
            mainPanel: this
        });

        this.addEvents('tabchange');

        var config = Ext.apply({
            activeItem: TAB_INDEX_SEARCH,
            margins: {
                left: 10,
                right: 10,
                top: 10
            },
            unstyled: true,
            layout: new Portal.ui.NavigableCardLayout(),
            items: [
                this.searchPanel,
                this.visualisePanel,
                this.downloadPanel
            ],
            bbar: new Portal.ui.MainToolbar({
                mainPanel: this
            }),
            bbarCfg: {
                cls: 'mainToolBar'
            }
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.VIEW_GEONETWORK_RECORD, this._onViewGeoNetworkRecord, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.FILTER_LOADED, this._allowAccessToAllTabs, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, this._refreshView, this);
    },

    _onViewGeoNetworkRecord: function() {
        this.setActiveTab(TAB_INDEX_VISUALISE);
    },

    afterRender: function() {
        Portal.ui.MainPanel.superclass.afterRender.call(this);
        this._highlightActiveTab();

        log.debug('MainPanel rendered');
    },

    getActiveTab: function() {
        return this.layout.getActiveTab();
    },

    isDownloadTabActive: function() {
        return (this.items.indexOf(this.getActiveTab()) == this.TAB_INDEX_DOWNLOAD)
    },

    setActiveTab: function(tabIndex) {
        this.layout.setActiveTab(tabIndex);
    },

    _highlightActiveTab: function() {

        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        // clean up
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive').removeClass('viewPortTabActiveLast');

        // all tabs up until the selected tab highlighted
        for (var i=0;i<=tabIndex;i++) {
            var newClasses = (i == tabIndex) ? 'viewPortTabActive viewPortTabActiveLast' : 'viewPortTabActive';
            jQuery('#viewPortTab' + i).removeClass('viewPortTabDisabled').addClass(newClasses);
        }

    },

    // // onclick now will be active (jquery.js)
    _allowAccessToAllTabs: function() {
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabDisabled');
    },

    _refreshView: function() {
        jQuery('[id^=viewPortTab]').addClass('viewPortTabDisabled');
        this.layout.setActiveTab(0);
        this._highlightActiveTab();
    }

});

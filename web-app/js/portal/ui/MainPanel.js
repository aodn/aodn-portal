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

        this.addEvents('tabchange');

        var fetcher = new Portal.data.GeoNetworkRecordFetcher();

        var config = Ext.apply({
            activeItem: fetcher.hasUuidsInUrl() ? TAB_INDEX_VISUALISE : TAB_INDEX_SEARCH,
            margins: {
                left: 10,
                right: 10,
                top: 10
            },
            unstyled: true,
            layout: new Portal.ui.NavigableCardLayout({
                layoutOnCardChange: true
            }),
            items: this.panels,
            bbar: new Portal.ui.MainToolbar({
                mainPanel: this
            }),
            bbarCfg: {
                cls: 'mainToolBar'
            }
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.VIEW_GEONETWORK_RECORD, this._onViewGeoNetworkRecord, this);
    },

    _onViewGeoNetworkRecord: function() {
        this.setActiveTab(TAB_INDEX_VISUALISE);
    },

    afterRender: function() {
        Portal.ui.MainPanel.superclass.afterRender.call(this);
        this._highlightActiveTab();
    },

    getActiveTab: function() {
        return this.layout.getActiveTab();
    },

    setActiveTab: function(tabIndex) {
        Portal.ui.MainPanel.maxStepReached = Math.max(tabIndex, Portal.ui.MainPanel.maxStepReached);
        this.layout.setActiveTab(tabIndex);
    },

    setDownloadTab: function() {
        this.layout.setActiveTab(TAB_INDEX_DOWNLOAD);
    },

    _highlightActiveTab: function() {

        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        // clean slate
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive').removeClass('viewPortTabActiveLast');
        // a collection was added
        if (tabIndex > 0) {
            jQuery('[id^=viewPortTab]').removeClass('viewPortTabDisabled');
        }
        // all tabs up until the selected tab highlighted
        for (var i = 0; i <= tabIndex; i++) {
            var newClasses = (i == tabIndex) ? 'viewPortTabActive viewPortTabActiveLast' : 'viewPortTabActive';
            jQuery('#viewPortTab' + i).removeClass('viewPortTabDisabled').addClass(newClasses);
        }
    }
});

Portal.ui.MainPanel.maxStepReached = TAB_INDEX_SEARCH;

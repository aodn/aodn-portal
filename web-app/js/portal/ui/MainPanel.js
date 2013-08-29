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

        Ext.MsgBus.subscribe('activegeonetworkrecordadded', this._onActiveGeoNetworkRecordAdded, this);
    },

    _onActiveGeoNetworkRecordAdded: function() {
        this.setActiveTab(TAB_INDEX_VISUALISE);
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

        this.layout.setActiveItem(tabIndex);

        //
        // Nasty hack for #27 - without this, the details panel on the right has no content
        // and it partially obscures the MapPanel.
        //
        // It's probably worth having a look at how the RightDetailsPanel/DetailsPanel/DetailsTabPanel
        // etc etc etc interact in terms of layout when selected layer changes - and perhaps this forced
        // layout can be removed.
        //
        // DF: In addition, if you remove this, you'll also get problems such
        // as #343. So please if you do decide to remove it - make sure things
        // don't break YET AGAIN
        this.doLayout(false, true /* force update */);

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

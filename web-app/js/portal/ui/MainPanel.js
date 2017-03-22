Ext.namespace('Portal.ui');

TAB_INDEX_SEARCH = 0;
TAB_INDEX_VISUALISE = 1;
TAB_INDEX_DOWNLOAD = 2;

Portal.ui.MainPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        this.addEvents('tabchange');

        var fetcher = new Portal.data.MetadataRecordFetcher({
            dataCollectionStore: this.dataCollectionStore
        });
        fetcher.loadCollectionsFromUrl();

        var config = Ext.apply({
            activeItem: TAB_INDEX_SEARCH,
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
                mainPanel: this,
                dataCollectionStore: this.dataCollectionStore
            }),
            bbarCfg: {
                cls: 'mainToolBar'
            }
        }, cfg);

        Portal.ui.MainPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, this._onDataCollectionAdded, this);
    },

    _onDataCollectionAdded: function() {
        this._highlightActiveTab();
    },

    afterRender: function() {
        Portal.ui.MainPanel.superclass.afterRender.call(this);
        this._highlightActiveTab(true);
    },

    getActiveTab: function() {
        return this.layout.getActiveTab();
    },

    setActiveTab: function(tabIndex) {
        this.layout.setActiveTab(tabIndex);
    },

    setDownloadTab: function() {
        this.layout.setActiveTab(TAB_INDEX_DOWNLOAD);
    },

    _highlightActiveTab: function(initialLoad) {

        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        // clean slate
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive').removeClass('viewPortTabActiveLast');

        // a collection was added
        if (!initialLoad) {
            jQuery('[id^=viewPortTab]').removeClass('viewPortTabDisabled');
        }

        // all tabs up until the selected tab highlighted
        for (var i = 0; i <= tabIndex; i++) {
            var newClasses = (i == tabIndex) ? 'viewPortTabActive viewPortTabActiveLast' : 'viewPortTabActive';
            jQuery('#viewPortTab' + i).removeClass('viewPortTabDisabled').addClass(newClasses);
        }

        this.setViewPortTabActions(!initialLoad);

    },

    setViewPortTabActions: function(activateAll) {

        jQuery(".viewPortTab").on("mouseenter", "button", function(event){

            var parentTab = jQuery(this).parents('.viewPortTab');
            var tabId = parentTab.attr('id');
            var tabIdInt = parseInt(tabId.substr(tabId.length - 1));

            jQuery(this).off(); // clear all actions on button
            if (parentTab.hasClass('viewPortTabActive') || activateAll) {
                    // add the onclick action
                    jQuery(this).click(function() {
                        trackNavigationUsage(
                            'navigationTrackingProgressBarAction',
                            OpenLayers.i18n('navigationTrackingStepPrefix') + (tabIdInt + 1)
                        );
                        setViewPortTab(tabIdInt);
                    });
            }
        });
    }
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function(cfg) {

        // approximate height of viewport main tabs. css will impact on this buffer
        this.viewportTabsHeight = 180;

        var layerStore = new Portal.data.LayerStore();
        var mapPanel = new Portal.ui.MapPanel({layers: layerStore});

        // TODO: probably we can remove this 'singleton' type access to the 'ActiveGeoNetworkRecordStore'
        // and only pass it down to the components that actually need access to it.
        Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE =
            new Portal.data.ActiveGeoNetworkRecordStore({
                layerStore: layerStore
            });

        this.mainPanel = new Portal.ui.MainPanel({
            region: 'center',
            mapPanel: mapPanel,
            panels: [
                new Portal.search.SearchPanel({
                    mapPanel: mapPanel
                }),
                new Portal.ui.VisualisePanel({
                    mapPanel: mapPanel
                }),
                new Portal.cart.DownloadPanel({
                    downloadPanelBody: new Portal.cart.DownloadPanelBody()
                })
            ]
        });

        this.urlUpdater = new Portal.data.UrlUpdater();

        this.downloadCartWidget = new Portal.ui.DownloadCartWidget({});

        var config = Ext.apply(
            {
                layout: 'border',
                boxMinWidth: 1050,
                items: this._getItems(cfg)
            },
            cfg
        );

        Portal.ui.Viewport.superclass.constructor.call(this, config);
    },

    /**
     * TODO: this is not currently called, but leaving it here for now as it can be useful for detecting uneccessary
     * nesting of containers.
     */
    _logContainersWithOnlyOneChild: function() {
        var nestedCount = 0;

        var countChildItems = function(container) {

            if (container.items) {

                if (container.items.length === 1) {
                    nestedCount++;
                    console.log('Component has only 1 child', typeof(container), container.id, 'layout', container.layout);
                }

                Ext.each(container.items.items, function(item) {
                    countChildItems(item);
                }, this);
            }
        };

        countChildItems(this);

        console.log('nested count: ' + nestedCount);
    },

    _getItems: function(cfg) {
        return [
            {
                unstyled: true,
                region: 'north',
                height: this.viewportTabsHeight,
                items: this.downloadCartWidget
            },
            this.mainPanel,
            {
                region: 'south',
                height: 5,
                unstyled: true
            }
        ];
    },

    setActiveTab: function(tabIndex) {
        this.mainPanel.setActiveTab(tabIndex);
    },

    setDownloadTab: function() {
        this.mainPanel.setDownloadTab();
    },

    isOnTab: function(tabIndex) {
        var currentTabIndex = this.mainPanel.items.indexOf(this.mainPanel.getActiveTab());
        return tabIndex == currentTabIndex;
    }
});

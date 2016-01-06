Ext.namespace('Portal.ui');

Portal.ui.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function(cfg) {

        // approximate height of viewport main tabs. css will impact on this buffer
        this.viewportTabsHeight = 195;

        var layerStore = this._newLayerStore();
        var mapPanel = new Portal.ui.MapPanel({layers: layerStore});
        var dataCollectionStore = new Portal.data.DataCollectionStore({
            layerStore: layerStore
        });

        this.mainPanel = new Portal.ui.MainPanel({
            region: 'center',
            mapPanel: mapPanel,
            dataCollectionStore: dataCollectionStore,
            panels: [
                new Portal.search.SearchPanel({
                    mapPanel: mapPanel,
                    dataCollectionStore: dataCollectionStore
                }),
                new Portal.ui.VisualisePanel({
                    mapPanel: mapPanel,
                    dataCollectionStore: dataCollectionStore
                }),
                new Portal.cart.DownloadPanel({
                    dataCollectionStore: dataCollectionStore
                })
            ]
        });

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

    _newLayerStore: function() {
        return new Portal.data.LayerStore();
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

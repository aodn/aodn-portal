Ext.namespace('Portal.details');

Portal.details.DataCollectionDetailsPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var tabPanelForLayer = this._initSubsetItemsTabPanel(cfg);

        var layerAdapter = cfg.dataCollection.getLayerAdapter();

        this.createTools(layerAdapter);
        this.addListeners(layerAdapter);
        this.numTileErrors = 0;

        var config = Ext.apply({
            cls: 'dataCollectionDetailsPanel',
            title: this._getHtmlTitle(cfg.dataCollection.getTitle()),
            collectionTitle: cfg.dataCollection.getTitle(),
            autoHeight: true,
            defaults: {
                style: {padding: '10px'},
                autoHeight: true
            },
            items: [tabPanelForLayer],
            toolTemplate: new Ext.Template('<div class="x-tool-awesome fa fa-fw {styles}" title="{title}"></div>'),
            tools: [
                this.errorToolItem,
                this.spinnerToolItem,
                this.deleteToolItem
            ],
            listeners: {
                expand: this._onExpand
            }
        }, cfg);

        Portal.details.DataCollectionDetailsPanel.superclass.constructor.call(this, config);
    },

    addListeners: function(layerAdapter) {
        layerAdapter.on('loadstart', this._onLayerLoadStart, this);
        layerAdapter.on('loadend', this._onLayerLoadEnd, this);
        layerAdapter.on('tileerror', this._onLayerLoadError, this);
    },

    removeListeners: function(layerAdapter) {
        layerAdapter.un('loadstart', this._onLayerLoadStart, this);
        layerAdapter.un('loadend', this._onLayerLoadEnd, this);
        layerAdapter.un('tileerror', this._onLayerLoadError, this);
    },

    _getHtmlTitle: function(title) {
        return String.format("<h4 title=\"{0}\">{1}</h4>", title, Ext.util.Format.ellipsis(title, 100, true));
    },

    _onExpand: function() {
        Ext.MsgBus.publish(
            PORTAL_EVENTS.DATA_COLLECTION_SELECTED,
            this.dataCollection
        );
    },

    _onLayerLoadStart: function() {
        this._indicateLayerLoading(true);
        this._indicateLayerError(false);
    },

    _onLayerLoadEnd: function() {
        this._indicateLayerLoading(false);
        if(this.numTileErrors > 0) {
            jQuery.get('/layer/logLayerError?layer=' + this.collectionTitle);
        }
    },

    _onLayerLoadError: function() {
        this._indicateLayerLoading(false);
        this._indicateLayerError(true);
        this.numTileErrors++;
    },

    _indicateLayerError: function(show) {
        show ? this.tools.errorToolItem.show() : this.tools.errorToolItem.hide();
    },

    _indicateLayerLoading: function(loading) {
        loading ? this.tools.spinnerToolItem.show() : this.tools.spinnerToolItem.hide();
    },

    _initSubsetItemsTabPanel: function(cfg) {
        return new Portal.details.SubsetItemsTabPanel({
            map: cfg.map,
            dataCollection: cfg.dataCollection,
            dataCollectionStore: cfg.dataCollectionStore,
            listeners: {
                beforeTabChange: this._doTracking
            }
        });
    },

    createTools: function(layer) {

        this.errorToolItem = {
            id: 'errorToolItem',
            styles: 'error fa-exclamation-triangle',
            hidden: true,
            title: OpenLayers.i18n('layerProblem')
        };
        this.spinnerToolItem = {
            id: 'spinnerToolItem',
            styles: 'fa-spin fa-spinner',
            hidden: !layer.isLoading(),
            title: OpenLayers.i18n('loadingMessage')
        };
        this.deleteToolItem = {
            id: 'deleteToolItem',
            styles: 'fa-close',
            handler: this._layerDelete,
            title: OpenLayers.i18n('removeDataCollectionTooltip'),
            scope: this
        };
    },

    _layerDelete: function() {
        this.removeListeners(this.dataCollection.getLayerAdapter());
        this.dataCollectionStore.remove(this.dataCollection);
    },

    _doTracking: function(panel, newTab, currentTab) {

        if (currentTab) {
            trackUsage(
                OpenLayers.i18n('subsetItemsTrackingCategory'),
                OpenLayers.i18n('subsetItemsTabsTrackingAction'),
                newTab.title,
                this.dataCollection.getTitle()
            );
            return true;
        }
    }
});

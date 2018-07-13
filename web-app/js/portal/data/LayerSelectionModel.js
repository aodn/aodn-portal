
Ext.namespace('Portal.data');

Portal.data.LayerSelectionModel = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext.apply(this, config);
        this._initLayers();

        Portal.data.LayerSelectionModel.superclass.constructor.call(this, config);
    },

    isNcwms: function() {
        return this._getDefaultLayer().isNcwms();
    },

    isAla: function() {
        return this._getDefaultLayer().isAla();
    },

    getLayers: function() {
        return this.layerCache;
    },

    _eachLayer: function(fn, scope) {
        Ext.each(this.getLayers(), fn, scope);
    },

    _getDefaultLayer: function() {
        return this.layerCache[0];
    },

    getSelectedLayer: function() {
        if (!this.selectedLayer) {
            this.setSelectedLayer(this._getDefaultLayer());
        }

        return this.selectedLayer;
    },

    setSelectedLayer: function(newLayer) {
        var oldLayer = this.selectedLayer;
        this.selectedLayer = newLayer;
        this.fireEvent('selectedlayerchanged', this.selectedLayer, oldLayer);
    },

    _initLayers: function() {
        this.layerCache = [];

        var wmsLayerLinks = this.dataCollection.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.wms);
        Ext.each(wmsLayerLinks, function(layerLink) {
            this.layerCache.push(this._linkToOpenLayer(layerLink, this.dataCollection));
        }, this);
    },

    // TODO: unit tests?
    _linkToOpenLayer: function(layerLink, dataCollection) {

        var layerDisplayName;
        if (layerLink.title == "") {
            layerDisplayName = dataCollection.getTitle();
        }

        var serverUri = layerLink.href;
        var serverInfo = Portal.data.Server.getInfo(serverUri);

        layerLink.server = serverInfo;

        if (layerLink.server == Portal.data.Server.UNKNOWN) {
            dataCollection = undefined;
            log.error("Server '" + serverUri + "' is blocked!");
        }

        var layerDescriptor = new Portal.common.LayerDescriptor(
            layerLink, layerDisplayName, dataCollection, serverInfo.getLayerType()
        );

        return layerDescriptor.toOpenLayer();
    }
});

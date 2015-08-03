/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.DataCollectionLayers = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext.apply(this, config);
        this._initLayers();

        Portal.data.DataCollectionLayers.superclass.constructor.call(this, config);
    },

    getLayers: function() {
        return this.layerCache;
    },

    getDefaultLayer: function() {
        return this.layerCache[0];
    },

    getSelectedLayer: function() {
        if (!this.selectedLayer) {
            this.selectedLayer = this.getDefaultLayer();
        }

        return this.selectedLayer;
    },

    setSelectedLayer: function(layer) {
        this.selectedLayer = layer;
        this.fireEvent('selectedlayerchanged', this.selectedLayer);
    },

    _initLayers: function() {
        this.layerCache = [];

        Ext.each(this.dataCollection.getWmsLayerLinks(), function(layerLink) {
            // TODO: rename LayerLink classes/vars appropriately - when is a layer link *really*
            // a layer link?
            var convertedLayerLink = Portal.search.data.LinkStore.prototype._convertLink(layerLink);
            this.layerCache.push(this._linkToOpenLayer(convertedLayerLink, this.dataCollection));
        }, this);
    },

    // TODO: unit tests?
    _linkToOpenLayer: function(layerLink, dataCollection) {
        var layerDisplayName = dataCollection.get('title');
        var serverUri = layerLink.server.uri;
        var serverInfo = Portal.data.Server.getInfo(serverUri);

        layerLink.server = serverInfo;

        if (layerLink.server == Portal.data.Server.UNKNOWN) {
            dataCollection = undefined;
            this._serverUnrecognized(serverUri);
        }

        var layerDescriptor = new Portal.common.LayerDescriptor(
            layerLink, layerDisplayName, dataCollection, serverInfo.getLayerType()
        );

        return layerDescriptor.toOpenLayer();
    },

    _serverUnrecognized: function(serverUri) {
        log.error("Server '" + serverUri + "' is blocked!!");
    }
});

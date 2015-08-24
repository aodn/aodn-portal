/*
 * Copyright 2015 IMOS
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

    isNcwms: function() {
        return this._getDefaultLayer().isNcwms();
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
        this._unregisterLayerEventListeners();

        var oldLayer = this.selectedLayer;
        this.selectedLayer = newLayer;

        this._registerLayerEventListeners();
        this.fireEvent('selectedlayerchanged', this.selectedLayer, oldLayer);
    },

    _registerLayerEventListeners: function() {
        this._updateLayerEventListeners('on');
    },

    _unregisterLayerEventListeners: function() {
        this._updateLayerEventListeners('un');
    },

    _updateLayerEventListeners: function(fn) {
        if (this.selectedLayer) {
            this.selectedLayer.events[fn]({
                'loadstart': this._onLayerLoadStart,
                'loadend': this._onLayerLoadEnd,
                'tileerror': this._onLayerTileError,
                scope: this
            });
        }
    },

    _onLayerEvent: function(eventName) {
        this.fireEvent(eventName, this.selectedLayer);
    },

    _onLayerLoadStart: function() {
        this._onLayerEvent('loadstart');
    },

    _onLayerLoadEnd: function() {
        this._onLayerEvent('loadend');
    },

    _onLayerTileError: function() {
        this._onLayerEvent('tileerror');
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
            log.error("Server '" + serverUri + "' is blocked!");
        }

        var layerDescriptor = new Portal.common.LayerDescriptor(
            layerLink, layerDisplayName, dataCollection, serverInfo.getLayerType()
        );

        return layerDescriptor.toOpenLayer();
    }
});

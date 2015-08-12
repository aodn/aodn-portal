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

        this._layerState = {};

        Portal.data.DataCollectionLayers.superclass.constructor.call(this, config);
    },

    getLayers: function() {
        return this.layerCache;
    },

    eachLayer: function(fn, scope) {
        Ext.each(this.getLayers(), fn, scope);
    },

    getDefaultLayer: function() {
        return this.layerCache[0];
    },

    getSelectedLayer: function() {
        if (!this.selectedLayer) {
            this.setSelectedLayer(this.getDefaultLayer());
        }

        return this.selectedLayer;
    },

    setSelectedLayer: function(newLayer) {
        this._unregisterLayerEventListeners();

        var oldLayer = this.selectedLayer;
        this.selectedLayer = newLayer;

        this._copyAttributesFromSelectedLayer();

        this._registerLayerEventListeners();
        this.fireEvent('selectedlayerchanged', this.selectedLayer, oldLayer);
    },

    _setLayerProperty: function(key, value) {
        this._layerProperties()[key] = value;
    },
    
    _getLayerProperty: function(key) {
        return this._layerProperties()[key];
    },

    _layerProperties: function() {

        var layer = this.getSelectedLayer();
        var key = layer.id;

        if (this._layerState[key] == undefined) {
            this._layerState[key] = {};
        }

        return this._layerState[key];
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
            this._serverUnrecognized(serverUri);
        }

        var layerDescriptor = new Portal.common.LayerDescriptor(
            layerLink, layerDisplayName, dataCollection, serverInfo.getLayerType()
        );

        return layerDescriptor.toOpenLayer();
    },

    _serverUnrecognized: function(serverUri) {
        log.error("Server '" + serverUri + "' is blocked!!");
    },

    //
    // TODO: Following functions to be replaced by `LayerGroup`?
    //
    _copyAttributesFromSelectedLayer: function() {
        Ext.each([
            'bboxMaxX',
            'bboxMaxY',
            'bboxMinX',
            'bboxMinY',
            'opacity',
            'projection',
            'zoomOverride'
        ], function(attr) {
            this[attr] = this.getSelectedLayer()[attr];
        }, this);
    },

    _is130: function() {
        return this.getSelectedLayer()._is130();
    },

    setOpacity: function(opacity) {
        this.eachLayer(function(layer) {
            layer.setOpacity(opacity);
        });
    },

    setVisibility: function(visible) {
        this.eachLayer(function(layer) {
            layer.setVisibility(visible);
        });
    },

    hasBoundingBox: function() {
        return this.getSelectedLayer().hasBoundingBox();
    },

    setScaleRange: function(min, max) {

        var layer = this.getSelectedLayer();

        this._setLayerProperty('scaleRange', {
            min: min,
            max: max
        });

        layer.mergeNewParams({
            COLORSCALERANGE: min + "," + max
        });
    },

    getScaleRange: function() {
        return this._getLayerProperty('scaleRange') || {};
    },

    setStyle: function(style) {

        this._setLayerProperty('style', style);

        this.getSelectedLayer().mergeNewParams({
            styles: style
        });
    },

    getStyle: function() {

        return this._getLayerProperty('style') || this.getSelectedLayer().defaultStyle;
    }
});


Ext.namespace('Portal.data');

//
// This class implements various OpenLayers.Layer functions using a DataCollection (and its associated layers).
// It allows client code to essentially treat a DataCollection as it would a Layer, without having to use code
// such as:
//
//    dataCollection.getLayerSelectionModel().getSelectedLayer()...
//
// all over the place.
//
Portal.data.DataCollectionLayerAdapter = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext.apply(this, config);

        this._layerProperties = {};

        this._onSelectedLayerChanged(this._getSelectedLayer());
        this.layerSelectionModel.on('selectedlayerchanged', this._onSelectedLayerChanged, this);

        Portal.data.LayerSelectionModel.superclass.constructor.call(this, config);
    },

    _getSelectedLayer: function() {
        return this.layerSelectionModel.getSelectedLayer();
    },

    _onSelectedLayerChanged: function(newLayer, oldLayer) {
        this._copyAttributesFromSelectedLayer();

        if (oldLayer) {
            this._unregisterLayerEventListeners(oldLayer);
        }

        this._registerLayerEventListeners(newLayer);
    },

    _onLayerEvent: function(eventName) {
        this.fireEvent(eventName, this._getSelectedLayer());
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

    _eachLayer: function(fn, scope) {
        this.layerSelectionModel._eachLayer(fn, scope);
    },

    _registerLayerEventListeners: function(layer) {
        this._updateLayerEventListeners(layer, 'on');
    },

    _unregisterLayerEventListeners: function(layer) {
        this._updateLayerEventListeners(layer, 'un');
    },

    _updateLayerEventListeners: function(layer, fn) {
        if (layer) {
            layer.events[fn]({
                'loadstart': this._onLayerLoadStart,
                'loadend': this._onLayerLoadEnd,
                'tileerror': this._onLayerTileError,
                scope: this
            });
        }
    },

    isLoading: function() {
        return this._getSelectedLayer().loading;
    },

    _setLayerProperty: function(key, value) {
        this._getLayerProperties()[key] = value;
    },

    _getLayerProperty: function(key) {
        return this._getLayerProperties()[key];
    },

    _getLayerProperties: function() {

        var layer = this._getSelectedLayer();
        var key = layer.id;

        if (!this._layerProperties) {
            this._layerProperties = {};
        }

        if (this._layerProperties[key] == undefined) {
            this._layerProperties[key] = {};
        }

        return this._layerProperties[key];
    },

    _copyAttributesFromSelectedLayer: function() {
        Ext.each([
            'opacity',
            'projection'
        ], function(attr) {
            this[attr] = this._getSelectedLayer()[attr];
        }, this);
    },

    applyFilters: function(filters) {
        this._eachLayer(function(layer) {
            if (layer.applyFilters) {
                layer.applyFilters(filters);
            }
        });
    },

    setOpacity: function(opacity) {
        this._eachLayer(function(layer) {
            layer.setOpacity(opacity);
        });
    },

    setVisibility: function(visible) {
        this._eachLayer(function(layer) {
            layer.setVisibility(visible);
        });
    },

    hasBoundingBox: function() {
        return this._getSelectedLayer().hasBoundingBox();
    },

    setScaleRange: function(min, max) {

        var layer = this._getSelectedLayer();

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

        this._getSelectedLayer().mergeNewParams({
            styles: style
        });
    },

    getStyle: function() {
        return this._getLayerProperty('style') || this._getSelectedLayer().defaultStyle;
    }
});

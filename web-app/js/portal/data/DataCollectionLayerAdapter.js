/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

//
// This class implements various OpenLayers.Layer functions using a DataCollection (and its associated layers).
// It allows client code to essentially treat a DataCollection as it would a Layer, without having to use code
// such as:
//
//    dataCollection.getLayerState().getSelectedLayer()...
//
// all over the place.
//
Portal.data.DataCollectionLayerAdapter = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {
        Ext.apply(this, config);

        // TODO: rename - conflicts with `LayerState` class.
        this._layerState = {};

        this._copyAttributesFromSelectedLayer();
        this.layerState.on('selectedlayerchanged', function(newlayer) {
            console.log('copyAttrs');
            this._copyAttributesFromSelectedLayer();
        }, this);

        Portal.data.DataCollectionLayers.superclass.constructor.call(this, config);
    },

    getSelectedLayer: function() {
        return this.layerState.getSelectedLayer();
    },

    _eachLayer: function(fn, scope) {
        this.layerState._eachLayer(fn, scope);
    },

    isLoading: function() {
        return this.getSelectedLayer().loading;
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

        if (!this._layerState) {
            this._layerState = {};
        }

        if (this._layerState[key] == undefined) {
            this._layerState[key] = {};
        }

        return this._layerState[key];
    },

    _copyAttributesFromSelectedLayer: function() {
        Ext.each([
            'bboxMaxX',
            'bboxMaxY',
            'bboxMinX',
            'bboxMinY',
            'opacity',
            'projection'
        ], function(attr) {
            this[attr] = this.getSelectedLayer()[attr];
        }, this);
    },

    _is130: function() {
        return this.getSelectedLayer()._is130();
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

/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.ui.openlayers.control');

Portal.ui.openlayers.SpatialConstraintType = {
    NONE: 'none',
    POLYGON: 'polygon',
    BOUNDING_BOX: 'bounding box'
}

Portal.ui.openlayers.control.SpatialConstraint = Ext.extend(OpenLayers.Control.DrawFeature, {

    constructor: function(options) {

        this.layerName = 'spatial constraint';

        options = options || {};

        this.layer = new OpenLayers.Layer.Vector(
            this.layerName,
            {
                displayInLayerSwitcher: false
            }
        );

        var handler = options.handler || OpenLayers.Handler.RegularPolygon;
        options.handlerOptions =
            options.handlerOptions || {
                sides: 4,
                irregular: true
            };

        options.autoActivate = options.autoActivate || true;

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [this.layer, handler, options]);

        this._configureEventsAndHandlers();

        if (options.initialConstraint) {
            this.layer.addFeatures(new OpenLayers.Feature.Vector(options.initialConstraint));
            this.events.triggerEvent('spatialconstraintadded');
        }

        this._isModified = false;
    },

    _configureEventsAndHandlers: function() {
        this.events.addEventType('spatialconstraintadded');
        this.events.addEventType('spatialconstraintcleared');
        this.events.addEventType('spatialconstrainttypechanged');

        this.layer.events.on({
            scope: this,
            "sketchstarted": this._onSketchStarted,
            "sketchcomplete": this._onSketchComplete
        });
    },

    setMap: function(map) {
        map.addLayer(this.layer);
        return OpenLayers.Control.DrawFeature.prototype.setMap.apply(this, arguments);
    },

    removeFromMap: function() {
        this.deactivate();
        this._removeMapEvents();
        this.map.removeLayer(this.layer);
        this.map.removeControl(this);
    },

    clear: function() {
        this.layer.destroyFeatures();
        this._isModified = true;
    },

    isModified: function() {
        return this._isModified;
    },

    hasConstraint: function() {
        return this._getFeature() != undefined;
    },

    getConstraint: function() {
        if (this.hasConstraint()) {
            return this._getFeature().geometry;
        }
    },

    getConstraintAsWKT: function() {
        if (this.hasConstraint()) {
            return this._getFeature().geometry.toWkt();
        }
    },

    _removeMapEvents: function() {
        this.map.events.un({
            "addlayer": this._setLayersToTop
        })
    },

    _setLayersToTop: function(addLayerEvent) {
        this._setDrawingLayerToTop();
        this._setResultLayerToTop();
    },

    _setDrawingLayerToTop: function() {
        this._setLayerToTop(this.handler.layer);
    },

    _setResultLayerToTop: function() {
        this._setLayerToTop(this.layer);
    },

    _setLayerToTop: function(layer) {
        if (layer && layer.map)  {
            layer.map.setLayerIndex(layer, layer.map.layers.length - 1);
        }
    },

    _getFeature: function() {
        return this.layer.features[0];
    },

    _onSketchStarted: function() {
        this.clear();
    },

    _onSketchComplete: function(event) {
        this.events.triggerEvent('spatialconstraintadded', event.feature.geometry);
    }
});

Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap = function(map, handler) {
    map.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
        handler: handler,
        'displayClass': 'none'
    });

    map.addControl(map.spatialConstraintControl);

    map.events.on({
        scope: map.spatialConstraintControl,
        "addlayer": map.spatialConstraintControl._setLayersToTop
    });

    map.spatialConstraintControl.events.on({
        scope: map,
        "spatialconstraintadded": function(geometry) {
            this.events.triggerEvent('spatialconstraintadded', geometry);
        }
    });
};



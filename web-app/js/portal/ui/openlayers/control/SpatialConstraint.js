/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.ui.openlayers.control');

Portal.ui.openlayers.SpatialConstraintType = {
    POLYGON: 'polygon',
    BOUNDING_BOX: 'bounding box'
};

Portal.ui.openlayers.control.SpatialConstraint = Ext.extend(OpenLayers.Control.DrawFeature, {

    MIN_AREA_PERCENT: 0.01,

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
            trackUsage( 'Filters', 'SpatialConstraint', 'created-init');
        }

        this._isModified = false;
    },

    _configureEventsAndHandlers: function() {
        this.events.addEventType('spatialconstraintadded');
        this.events.addEventType('spatialconstraintcleared');
        this.events.addEventType('spatialconstrainttypechanged');

        this.layer.events.on({
            scope: this,
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

    redraw: function(geometry) {
        this.clear();
        this.layer.addFeatures(new OpenLayers.Feature.Vector(geometry));
        this.events.triggerEvent('spatialconstraintadded', geometry);
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
            "changelayer": this._layerChanged
        });

        this.map.events.un({
            "removelayer": this._layerRemoved
        });
    },

    _layerAdded: function(addLayerEvent) {
        this._setDrawingLayersToTop();
    },

    _layerChanged: function(layer, property) {
        this._setDrawingLayersToTop();
    },

    _layerRemoved: function(layer) {
        this._setDrawingLayersToTop();
    },

    _setDrawingLayersToTop: function() {
        // Set drawing layer and polygon layer to be on top of any layer in
        // terms of Z index
        maxZIndexForOverlay = OpenLayers.Map.prototype.Z_INDEX_BASE['Feature'] - 1;

        if (this.handler && this.handler.layer) {
            this.handler.layer.setZIndex(maxZIndexForOverlay - 1);
        }
        this.layer.setZIndex(maxZIndexForOverlay);
    },

    _getFeature: function() {
        return this.layer.features[0];
    },

    _onSketchComplete: function(event) {

        var area = event.feature.geometry.getArea();

        if (this._getPercentOfViewportArea(area) > this.MIN_AREA_PERCENT){
            this.clear();
            this.events.triggerEvent('spatialconstraintadded', event.feature.geometry);
            trackUsage( OpenLayers.i18n('filtersTrackingCategory'), OpenLayers.i18n('filtersTrackingSpatialConstraintAction'), OpenLayers.i18n('trackingSpatialConstraintSketched'));
        }
        else {
            return false; // will stop the sketch feature from being added to the layer.
        }
    },

    _getPercentOfViewportArea: function(spatialExtentArea) {
        var mapArea = this._getMapArea();
        return (spatialExtentArea / parseFloat(mapArea)) * 100;
    },

    _getMapArea: function() {
        return this.map.getExtent().toGeometry().getArea();
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
        "addlayer": map.spatialConstraintControl._layerAdded
    });

    map.events.on({
        scope: map.spatialConstraintControl,
        "changelayer": map.spatialConstraintControl._layerChanged
    });

    map.events.on({
        scope: map.spatialConstraintControl,
        "removelayer": map.spatialConstraintControl._layerRemoved
    });

    map.spatialConstraintControl.events.on({
        scope: map,
        "spatialconstraintadded": function(geometry) {
            this.events.triggerEvent('spatialconstraintadded', geometry);
        }
    });
};



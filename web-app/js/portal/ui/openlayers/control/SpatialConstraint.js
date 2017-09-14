Ext.namespace('Portal.ui.openlayers.control');

Portal.ui.openlayers.SpatialConstraintType = {
    POLYGON: 'polygon',
    BOUNDING_BOX: 'bounding box'
};

Portal.ui.openlayers.control.SpatialConstraint = Ext.extend(OpenLayers.Control.DrawFeature, {

    SPATIAL_EXTENT_ERROR_TIMEOUT: 1200,

    errorStyle: {
        fillOpacity: 0.3,
        strokeOpacity: 0.5,
        strokeDashstyle: "dashdot",
        fillColor: "#FF0300",
        strokeColor: "#FF0300"
    },

    constructor: function(layer, options) {

        // valid spatial constraints will be drawn to this layer
        this.vectorlayer = layer;

        options = options || {};

        // invalid spatial constraints will be highlighted on this layer
        this.errorLayer = new OpenLayers.Layer.Vector(
            'errors',
            {
                displayInLayerSwitcher: false,
                style: this.errorStyle
            }
        );

        var handler = options.handler || OpenLayers.Handler.RegularPolygon;
        options.handlerOptions =
            options.handlerOptions || {
                sides: 4,
                irregular: true
            };

        options.autoActivate = options.autoActivate || true;

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [this.vectorlayer, handler, options]);

        this._configureEventsAndHandlers();

        if (options.initialConstraint) {
            this.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(options.initialConstraint));
            this.events.triggerEvent('spatialconstraintadded');
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingInitLabel'));
        }
    },

    _configureEventsAndHandlers: function() {
        this.events.addEventType('spatialconstraintadded');
        this.events.addEventType('spatialconstraintcleared');
        this.events.addEventType('spatialconstrainttypechanged');

        this.vectorlayer.events.on({
            scope: this,
            "sketchstarted": this._onSketchStarted,
            "sketchcomplete": this._onSketchComplete
        });
    },

    _onSketchStarted: function(e) {

        this.triggerMapClick(e);
        if (this.map.mapPanel) {
            this.map.mapPanel._closeFeatureInfoPopup();
        }
    },

    triggerMapClick: function(e) {

        var lonlat = new OpenLayers.LonLat([
            e.vertex.getCentroid().x,
            e.vertex.getCentroid().y
        ]);

        e.xy = this.map.getViewPortPxFromLonLat(lonlat);
        this.map.events.triggerEvent('click', e);
    },

    setMap: function(map) {
        map.addLayer(this.vectorlayer);
        map.addLayer(this.errorLayer)
        return OpenLayers.Control.DrawFeature.prototype.setMap.apply(this, arguments);
    },

    remove: function() {
        this.deactivate();
        this._removeMapEvents();
        this._removeVectorLayerEvents();
        this.removeControl(this);
        this.removeLayer(this.errorLayer);
    },

    removeLayer: function(layer) {
        jQuery("#" + layer.div.id).remove();

        OpenLayers.Util.removeItem(this.map.layers, layer);
        layer.removeMap(this);
        layer.map = null;
    },

    removeControl: function(control) {

        if ((control) && (control == this.map.getControl(control.id))) {

            if (control.div && (control.div.parentNode)) {
                control.div.parentNode.removeChild(control.div);
            }
            OpenLayers.Util.removeItem(this.map.controls, control);
            OpenLayers.Util.removeItem(this.map.toolPanel.controls, control);
        }
    },

    clear: function() {
        if (this.vectorlayer.destroyFeatures) {
            this.vectorlayer.destroyFeatures();
        }
        this._setGeometryFilter();
    },

    drawGeometry: function(geometry) {
        this.clear();
        this.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(geometry));
        this.setGeometry(geometry);
    },

    setGeometry: function(geometry) {
        this._setGeometryFilter(geometry);
        this.events.triggerEvent('spatialconstraintadded', geometry);
    },

    _setGeometryFilter: function(geometry) {
        this.map.geometryFilter = geometry;
    },

    hasConstraint: function() {
        return this._getFeature() != undefined;
    },

    getConstraint: function() {
        if (this.hasConstraint()) {
            return this.getNormalizedGeometry(this._getFeature().geometry);
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

    _removeVectorLayerEvents: function() {
        this.vectorlayer.events.un({
            scope: this,
            "sketchstarted": this._onSketchStarted,
            "sketchcomplete": this._onSketchComplete
        });
    },

    _layerAdded: function() {
        this._setDrawingLayersToTop();
    },

    _layerChanged: function() {
        this._setDrawingLayersToTop();
    },

    _layerRemoved: function() {
        this._setDrawingLayersToTop();
    },

    _setDrawingLayersToTop: function() {
        // Set drawing layer, error layer and polygon layer to be on top of any layer in
        // terms of Z index
        var maxZIndexForOverlay = OpenLayers.Map.prototype.Z_INDEX_BASE['Feature'] - 1;

        if (this.handler && this.handler.layer && this.handler.div) {
            this.handler.layer.setZIndex(maxZIndexForOverlay - 2);
        }

        this.vectorlayer.setZIndex(maxZIndexForOverlay - 1);

        if (this.errorLayer.div) {
            this.errorLayer.setZIndex(maxZIndexForOverlay);
        }
    },

    _getFeature: function() {
        // Contains geometry that is not normalised
        return this.vectorlayer.features[0];
    },

    _checkSketch: function(geometry) {
        return this.validator.isValid(geometry);
    },

    _resetErrorLayerAfterTimeout: function() {
        var that = this;
        setTimeout((function() {
            that._clearError();
        }), that.SPATIAL_EXTENT_ERROR_TIMEOUT);
    },

    _clearError: function() {
        if (this.errorLayer.destroyFeatures) {
            this.errorLayer.destroyFeatures();
        }
    },

    addAntimeridianFeature: function() {
        var meridianLine = new OpenLayers.Geometry.LineString([
            new OpenLayers.Geometry.Point(180, -90),
            new OpenLayers.Geometry.Point(180, 90)
        ]);
        var meridianLineFeature = new OpenLayers.Feature.Vector(meridianLine, null, this.errorStyle);
        this.errorLayer.addFeatures([meridianLineFeature]);
    },

    _onSketchComplete: function(event) {
        var geometry = event.feature.geometry;

        if (this._checkSketch(geometry)) {
            this.clear();
            var normalisedGeometry = this.getNormalizedGeometry(geometry);
            this.setGeometry(normalisedGeometry);
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingSpatialConstraintSketched'));
            return true;
        }
        else {
            this.errorLayer.addFeatures([event.feature]);
            if (geometry.crossesAntimeridian()) {
                this.addAntimeridianFeature();
            }
            else {
                this.map.mapPanel.findFeatureInfoForGeometry(geometry); // trigger GFI then
            }
            this._resetErrorLayerAfterTimeout();
            return false;
        }
    },

    getNormalizedGeometry: function(geometry) {
        return new OpenLayers.Geometry.fromWKT(geometry.toWkt());
    }
});

Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap = function(map, handler) {

    map.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint(
        map.constraintLayer,
        {
            title: OpenLayers.i18n("drawingControl"),
            handler: handler,
            'displayClass': 'olControlDrawFeature',
            validator: new Portal.filter.validation.SpatialConstraintValidator({
                map: map
            })
        }
    );

    map.toolPanel.addControls([map.spatialConstraintControl]);

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

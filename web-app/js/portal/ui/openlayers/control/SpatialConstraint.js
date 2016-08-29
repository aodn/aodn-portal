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

    constructor: function(options) {

        this.layerName = 'spatial constraint';

        options = options || {};

        this.vectorlayer = new OpenLayers.Layer.Vector(
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

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [this.vectorlayer, handler, options]);

        this._configureEventsAndHandlers();

        if (options.initialConstraint) {
            this.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(options.initialConstraint));
            this.events.triggerEvent('spatialconstraintadded');
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingInitLabel'));
        }

        this._isModified = false;
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
        this.vectorlayer.style = OpenLayers.Feature.Vector.style['default'];
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
        return OpenLayers.Control.DrawFeature.prototype.setMap.apply(this, arguments);
    },

    resetSpatialConstraint: function() {
        this.deactivate();
        this._removeMapEvents();
        this.removeControl(this);
        this.clear();
        this._setGeometryFilter();
        this.removeLayer(this.vectorlayer);
    },

    removeLayer: function(vectorLayer) {
        jQuery("#" + this.vectorlayer.div.id).remove();

        OpenLayers.Util.removeItem(this.map.layers, vectorLayer);
        vectorLayer.removeMap(this);
        vectorLayer.map = null;
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
        this.vectorlayer.destroyFeatures();
        this._isModified = true;
    },

    redraw: function(geometry) {
        this.clear();
        this.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(geometry));
    },

    setGeometry: function(geometry) {
        this.oldGeometry = geometry;
        this._setGeometryFilter(geometry);
        this.events.triggerEvent('spatialconstraintadded', geometry);
    },

    _setGeometryFilter: function(geometry) {
        this.map.geometryFilter = geometry;
    },

    isModified: function() {
        return this._isModified;
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
        // Set drawing layer and polygon layer to be on top of any layer in
        // terms of Z index
        var maxZIndexForOverlay = OpenLayers.Map.prototype.Z_INDEX_BASE['Feature'] - 1;

        if (this.handler && this.handler.layer) {
            this.handler.layer.setZIndex(maxZIndexForOverlay - 1);
        }
        this.vectorlayer.setZIndex(maxZIndexForOverlay);
    },

    _getFeature: function() {
        // Contains geometry that is not normalised
        return this.vectorlayer.features[0];
    },

    _checkSketch: function(geometry) {
        return this.validator.isValid(geometry);
    },

    _showSpatialExtentError: function(geometry) {
        this.vectorlayer.style = this.errorStyle;

        if (geometry.crossesAntimeridian()) {
            this.addAntimeridian();
        }

        setTimeout(
            this._resetSpatialExtentError,
            this.SPATIAL_EXTENT_ERROR_TIMEOUT,
            this
        );
    },

    _resetSpatialExtentError: function(that) {
        if (that.oldGeometry) {
            that.vectorlayer.style = OpenLayers.Feature.Vector.style['default'];
            that.redraw(that.oldGeometry);
        }
        else {
            that.map.events.triggerEvent('spatialconstraintcleared');
        }
    },

    addAntimeridian: function() {
        var meridianLine = new OpenLayers.Geometry.LineString([
            new OpenLayers.Geometry.Point(180, -90),
            new OpenLayers.Geometry.Point(180, 90)
        ]);
        var meridianLineFeature = new OpenLayers.Feature.Vector(meridianLine, null, this.errorStyle);
        this.vectorlayer.addFeatures([meridianLineFeature]);
    },

    _onSketchComplete: function(event) {
        this.clear();
        var geometry = event.feature.geometry;

        if (this._checkSketch(geometry)) {
            var normalisedGeometry = this.getNormalizedGeometry(geometry);
            this.setGeometry(normalisedGeometry);
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', OpenLayers.i18n('trackingSpatialConstraintSketched'));
        }
        else {
            this._showSpatialExtentError(geometry);
            if (!geometry.crossesAntimeridian()) {
                this.map.mapPanel.findFeatureInfoForGeometry(geometry); // trigger GFI then
            }
            return true; // Let the features to be added to the layer
        }
    },

    getNormalizedGeometry: function(geometry) {
        return new OpenLayers.Geometry.fromWKT(geometry.toWkt());
    }
});

Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap = function(map, handler) {

    map.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
        title: OpenLayers.i18n("drawingControl"),
        handler: handler,
        'displayClass': 'olControlDrawFeature',
        validator: new Portal.filter.validation.SpatialConstraintValidator({
            map: map
        })
    });

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

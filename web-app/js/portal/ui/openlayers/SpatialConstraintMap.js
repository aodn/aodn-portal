OpenLayers.SpatialConstraintMap = OpenLayers.Class(OpenLayers.Map, {

    initialize: function(div, options) {

        OpenLayers.Map.prototype.initialize.apply(this, arguments);

        this.constraintLayer = new OpenLayers.Layer.Vector(
            'spatial constraint',
            {
                displayInLayerSwitcher: false
            }
        );

        this.events.addEventType('featureInfoClick');
        this.events.addEventType('spatialconstraintusermodded');
        this.events.addEventType('spatialconstraintcleared');

        this.events.register(
            'spatialconstraintusermodded',
            this,
            function(geometry) {
                this.spatialConstraintControl.drawGeometry(geometry);
            }
        );

        this.events.register(
            'spatialconstraintcleared',
            this,
            function() {
                this.clearSpatialConstraint();
            }
        );
    },

    getConstraint: function() {
        if (this.spatialConstraintControl) {
            return this.spatialConstraintControl.getConstraint();
        }

        return undefined;
    },

    hasConstraint: function() {
        return this.spatialConstraintControl ? this.spatialConstraintControl.hasConstraint() : false;
    },

    addSpatialConstraint: function(defaultSpatialConstraintType) {
        this.defaultSpatialConstraintType = defaultSpatialConstraintType;
        this.doSetSpatialConstraintStyle(defaultSpatialConstraintType);
    },

    setSpatialConstraintStyle: function(polygonStyle) {

        // Avoid unnecessary removal/addition of the control.
        if (this.polygonStyle != polygonStyle) {
            this.doSetSpatialConstraintStyle(polygonStyle);
            this.events.triggerEvent('spatialconstrainttypechanged', polygonStyle);

            var val = 'type=' + polygonStyle;
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', val);
        }
    },

    getSpatialConstraintType: function() {
        return this.polygonStyle;
    },

    clearSpatialConstraint: function() {
        if (this.hasConstraint()) {
            this.spatialConstraintControl.clear();
        }

        if (this.polygonStyle != this.defaultSpatialConstraintType) {
            this.doSetSpatialConstraintStyle(this.defaultSpatialConstraintType);
        }
    },

    doSetSpatialConstraintStyle: function(polygonStyle) {

        this.polygonStyle = polygonStyle;

        if (this.spatialConstraintControl) {
            this.spatialConstraintControl.remove();
        }

        if (polygonStyle == Portal.ui.openlayers.SpatialConstraintType.POLYGON) {
            this.addSpatialConstraintControlToMap(OpenLayers.Handler.Polygon);
        }
        else if (polygonStyle == Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX) {
            this.addSpatialConstraintControlToMap();
        }

        if (this.spatialConstraintControl && this.spatialConstraintControl.div){
            this.spatialConstraintControl.activate();
        }
        this.navigationControl.deactivate();
    },

    addSpatialConstraintControlToMap: function(handler) {
        Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(this, handler);
    },

    CLASS_NAME: "OpenLayers.SpatialConstraintMap"
});

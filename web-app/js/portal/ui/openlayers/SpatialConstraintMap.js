OpenLayers.SpatialConstraintMap = OpenLayers.Class(OpenLayers.Map, {

    initialize: function(div, options) {

        OpenLayers.Map.prototype.initialize.apply(this, arguments);

        this.events.addEventType('spatialconstraintusermodded');
        this.events.addEventType('spatialconstraintcleared');

        this.events.register(
            'spatialconstraintusermodded',
            this,
            function(geometry) {
                this.spatialConstraintControl.setGeometry(geometry);
                this.spatialConstraintControl.redraw(geometry);
            }
        );

        this.events.register(
            'spatialconstraintcleared',
            this,
            function() {
                this.setSpatialConstraint();
            }
        );
    },

    getConstraint: function() {
        if (this.spatialConstraintControl) {
            return this.spatialConstraintControl.getConstraint();
        }

        return undefined;
    },

    isConstraintModified: function() {
        if (this.spatialConstraintControl) {
            return this.spatialConstraintControl.isModified();
        }
        else {
            return false;
        }
    },

    setDefaultSpatialConstraintType: function(spatialConstraintType) {
        this.defaultSpatialConstraintType = spatialConstraintType;
        this.setSpatialConstraint();
    },

    setSpatialConstraintStyle: function(polygonStyle) {

        // Avoid unnecessary removal/addition of the control.
        if (this.polygonStyle != polygonStyle) {
            this.doSetSpatialConstraint(polygonStyle);
            this.events.triggerEvent('spatialconstrainttypechanged', polygonStyle);

            var val = 'type=' + polygonStyle;
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', val);
        }
    },

    getSpatialConstraintType: function() {
        return this.polygonStyle;
    },

    setSpatialConstraint: function() {
        if (this.polygonStyle != this.defaultSpatialConstraintType || this.isConstraintModified()) {
            this.doSetSpatialConstraint(this.defaultSpatialConstraintType);
        }
    },

    doSetSpatialConstraint: function(polygonStyle) {

        this.polygonStyle = polygonStyle;

        if (this.spatialConstraintControl) {
            this.spatialConstraintControl.resetSpatialConstraint();
        }

        switch (polygonStyle) {
            case Portal.ui.openlayers.SpatialConstraintType.POLYGON:
                this.addSpatialConstraintControlToMap(OpenLayers.Handler.Polygon);
                this.activateSpatialConstraintControl(true);
                break;
            case Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX:
                this.addSpatialConstraintControlToMap();
                this.activateSpatialConstraintControl(true);
                break;
            case Portal.ui.openlayers.SpatialConstraintType.POINT:
                this.addSpatialConstraintControlToMap();
                this.activateSpatialConstraintControl(false);
                break;
        }

        this.navigationControl.deactivate();
    },

    activateSpatialConstraintControl: function(activate) {
        if (this.spatialConstraintControl && this.spatialConstraintControl.div && activate){
            this.spatialConstraintControl.activate();
            //activate a simple getfeatureinfo
        }
        else {
            this.spatialConstraintControl.deactivate();
        }
    },

    addSpatialConstraintControlToMap: function(handler) {
        Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(this, handler);
    },

    CLASS_NAME: "OpenLayers.SpatialConstraintMap"
});

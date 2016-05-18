OpenLayers.SpatialConstraintMap = OpenLayers.Class(OpenLayers.Map, {

    initialize: function(div, options) {

        OpenLayers.Map.prototype.initialize.apply(this, arguments);

        this.events.addEventType('spatialconstraintusermodded');
        this.events.addEventType('spatialconstraintcleared');
        this.events.addEventType('resetspatialconstraint');

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

        this.events.register(
            'resetspatialconstraint',
            this,
            function(constraintType) {
                this.resetToDefaultConstraint(constraintType);
            }
        );
    },

    getConstraint: function() {
        if (this.spatialConstraintControl) {
            return this.spatialConstraintControl.getConstraint();
        }

        return undefined;
    },

    resetToDefaultConstraint: function(constraintType) {
        if (constraintType == Portal.ui.openlayers.SpatialConstraintType.POINT) {
            this.setSpatialConstraintStyle(this.defaultSpatialConstraintType);
        }
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

    setSpatialConstraintStyle: function(constraintType) {

        // Avoid unnecessary removal/addition of the control.
        if (this.constraintType != constraintType) {
            this.doSetSpatialConstraint(constraintType);
            this.events.triggerEvent('spatialconstrainttypechanged', constraintType);

            var val = 'type=' + constraintType;
            trackFiltersUsage('filtersTrackingSpatialConstraintAction', val);
        }
    },

    getSpatialConstraintType: function() {
        return this.constraintType;
    },

    setSpatialConstraint: function() {
        if (this.constraintType != this.defaultSpatialConstraintType || this.isConstraintModified()) {
            this.doSetSpatialConstraint(this.defaultSpatialConstraintType);
        }
    },

    doSetSpatialConstraint: function(constraintType) {

        this.constraintType = constraintType;

        if (this.spatialConstraintControl) {
            this.spatialConstraintControl.resetSpatialConstraint();
        }

        switch (constraintType) {
            case Portal.ui.openlayers.SpatialConstraintType.POLYGON:
                this.addSpatialConstraintControlToMap(constraintType, OpenLayers.Handler.Polygon);
                this.activateSpatialConstraintControl(true);
                break;
            case Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX:
                this.addSpatialConstraintControlToMap(constraintType);
                this.activateSpatialConstraintControl(true);
                break;
            case Portal.ui.openlayers.SpatialConstraintType.POINT:
                this.addSpatialConstraintControlToMap(constraintType);
                this.activateSpatialConstraintControl(false);
                break;
        }

        this.navigationControl.deactivate();
        this.clickControl.activate();
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

    addSpatialConstraintControlToMap: function(constraintType, handler) {
        Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(this, handler, constraintType);
    },

    CLASS_NAME: "OpenLayers.SpatialConstraintMap"
});

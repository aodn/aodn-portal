/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.GeoFacetMapToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {

    /**
     * Constructor: Portal.search.GeoFacetMapToolbar
     * Create an geofacet toolbar for a given layer.
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {

        options = Ext.apply({
            displayClass: 'olControlEditingToolbar'
        }, options);

        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);

        this.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
            handler: OpenLayers.Handler.Polygon,
            'displayClass': 'olControlDrawFeaturePolygon'
        });

        var self = this;
        this.events.addEventType('spatialconstraintadded');
        this.events.addEventType('spatialconstraintcleared');

        this.spatialConstraintControl.events.on({
            'spatialconstraintadded': function() {
                self.events.triggerEvent('spatialconstraintadded');
            },
            'spatialconstraintcleared': function() {
                self.events.triggerEvent('spatialconstraintcleared');
            }
        });

        this.addControls([
            new OpenLayers.Control.Navigation(),
            this.spatialConstraintControl
        ]);
    },

    activateDefaultControl: function() {
        this.spatialConstraintControl.activate();
    },

    CLASS_NAME: "Portal.search.GeoFacetMapToolbar"
});

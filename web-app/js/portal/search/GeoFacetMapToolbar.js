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
            displayClass: 'olControlGeoFacetToolbar'
        }, options);

        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);

        this.constraintLayer = new OpenLayers.Layer.Vector(
            'spatial constraint',
            {
                displayInLayerSwitcher: false
            }
        );

        this.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint(
            this.constraintLayer,
            {
                handler: OpenLayers.Handler.Polygon,
                'displayClass': 'olControlDrawFeature'
            }
        );

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

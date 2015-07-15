/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext4.namespace('Portal.search');

Portal.search.GeoFacetMapToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {

    /**
     * Constructor: Portal.search.GeoFacetMapToolbar
     * Create an geofacet toolbar for a given layer.
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {

        options = Ext4.apply({
            displayClass: 'olControlEditingToolbar'
        }, options);

        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);

        this.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
            handler: OpenLayers.Handler.Polygon,
            'displayClass': 'olControlDrawFeaturePolygon'
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

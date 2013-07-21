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
     * layer - {<OpenLayers.Layer.Vector>}
     * options - {Object}
     */
    initialize: function(layer, options) {

        options = Ext.apply({
            displayClass: 'olControlEditingToolbar'
        }, options);

        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);

        this.addControls([
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.DrawFeature(
                layer,
                OpenLayers.Handler.Polygon,
                {
                    'displayClass': 'olControlDrawFeaturePolygon'
                }
            )
        ]);
    },

    CLASS_NAME: "Portal.search.GeoFacetMapToolbar"
});

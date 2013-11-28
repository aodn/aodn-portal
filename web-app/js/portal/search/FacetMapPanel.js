/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetMapPanel = Ext.extend(Portal.common.MapPanel, {

    RESOLUTIONS: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625],

    constructor: function (cfg) {

        var layerStore = new Portal.data.LayerStore();

        var config = Ext.apply({
            layers: layerStore
        }, cfg);

        Portal.search.FacetMapPanel.superclass.constructor.call(this, config);

        this._initGeoFacetMapToolbar();
        this._initMap();

        this.map.events.register("mouseover", this, function () {
            //need to do this because things go wack if the parent panel is moved, for instance due to scrolling
            this.map.updateSize();
        });

        // Otherwise we end up off the west coast of Africa
        this.zoomToInitialBbox();
        this.geoFacetMapToolbar.activateDefaultControl();
    },

    _initGeoFacetMapToolbar: function() {
        this.geoFacetMapToolbar = new Portal.search.GeoFacetMapToolbar();

        this.geoFacetMapToolbar.events.register(
            'spatialconstraintadded',
            this,
            function(geometry) {
                this.fireEvent('polygonadded', geometry);
            }
        );

        this.addEvents('polygonadded');
    },

    _initMap: function(mapConfig) {
        this.map = new OpenLayers.Map({
            controls: [
                new OpenLayers.Control.ZoomPanel(),
                this.geoFacetMapToolbar
            ],
            resolutions: this.RESOLUTIONS,
            restrictedExtent: new OpenLayers.Bounds.fromArray([null, -90, null, 90])
        });
    },

    hasCurrentFeature: function() {
        return this.geoFacetMapToolbar.spatialConstraintControl.hasConstraint();
    },

    clearGeometry: function() {
        this.geoFacetMapToolbar.spatialConstraintControl.clear();
    },

    getBoundingPolygonAsWKT: function() {
        return this.geoFacetMapToolbar.spatialConstraintControl.getConstraintAsWKT();
    }
});

Ext.reg('portal.search.facetmappanel', Portal.search.FacetMapPanel);

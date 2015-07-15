/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.search');

Portal.search.FacetMapPanel = Ext.extend(Portal.common.MapPanel, {

    RESOLUTIONS: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625],

    constructor: function (cfg) {

        var layerStore = new Portal.data.LayerStore();

        var config = Ext4.apply({
            layers: layerStore
        }, cfg);

        Portal.search.FacetMapPanel.superclass.constructor.call(this, config);

        this._initGeoFacetMapToolbar();
        this._initMap();
        this._initSpatialConstraintValidator();

        this.map.events.register("mousemove", this, this._updateMapSize);
        this.map.events.register("mouseover", this, this._updateMapSize);

        // Otherwise we end up off the west coast of Africa
        this.zoomToInitialBbox();
        this.geoFacetMapToolbar.activateDefaultControl();
    },

    _initGeoFacetMapToolbar: function() {
        this.geoFacetMapToolbar = new Portal.search.GeoFacetMapToolbar();

        this.map.events.register(
            'spatialconstraintadded',
            this,
            function(geometry) {
                this.fireEvent('polygonadded', geometry);
            }
        );

        this.addEvents('polygonadded');
    },

    _initMap: function() {
        this.map = new OpenLayers.Map({
            controls: [
                new OpenLayers.Control.ZoomPanel(),
                this.geoFacetMapToolbar
            ],
            resolutions: this.RESOLUTIONS,
            restrictedExtent: new OpenLayers.Bounds.fromArray([-360, -90, 360, 90])
        });
    },

    _initSpatialConstraintValidator: function() {
        this.geoFacetMapToolbar.spatialConstraintControl.validator = new Portal.filter.validation.SpatialConstraintValidator({
            map: this.map
        });
    },

    _updateMapSize: function() {
        //need to do this because things go wack if the parent panel is moved, for instance due to scrolling
        this.map.updateSize();
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

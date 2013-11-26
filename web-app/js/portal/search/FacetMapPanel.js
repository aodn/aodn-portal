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

        this._configurePolygonVector();

        var layerStore = new Portal.data.LayerStore();
        layerStore.add(new GeoExt.data.LayerRecord({
            layer: this.polygonVector,
            title: this.polygonVector.name
        }));

        this.geoFacetMapToolbar = new Portal.search.GeoFacetMapToolbar(this.polygonVector);

        var config = Ext.apply({
            layers: layerStore
        }, cfg);

        Portal.search.FacetMapPanel.superclass.constructor.call(this, config);

        this._initMap();

        this.map.events.register("mouseover", this, function () {
            //need to do this because things go wack if the parent panel is moved, for instance due to scrolling
            this.map.updateSize();
        });

        // Otherwise we end up off the west coast of Africa
        this.zoomToInitialBbox();
        this.geoFacetMapToolbar.activateDefaultControl();
    },

    _configurePolygonVector: function() {
        this.polygonVector = new OpenLayers.Layer.Vector("GeoFilter Vector");
        this.polygonVector.events.register("sketchstarted", this, function () {
            this.clearGeometry();
        });

        this.polygonVector.events.register("sketchcomplete", this, function () {
            this.fireEvent('polygonadded', this.getCurrentFeature());
        });
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

    getCurrentFeature: function () {
        if (this.polygonVector.features.length > 0) {
            return this.polygonVector.features[0];
        }
    },

    getCurrentGeometry: function() {
        if (this.getCurrentFeature()) {
            return this.getCurrentFeature().geometry;
        }
    },

    hasCurrentFeature: function() {
        return this.getCurrentFeature();
    },

    hasCurrentGeometry: function() {
        return this.getCurrentGeometry();
    },

    clearGeometry: function() {
        this.polygonVector.destroyFeatures();
    },

    getBoundingPolygonAsWKT: function() {
        if (this.getCurrentFeature()) {
            var wktFormatter = new OpenLayers.Format.WKT();
            return wktFormatter.write(this.getCurrentFeature());
        }
    }
});

Ext.reg('portal.search.facetmappanel', Portal.search.FacetMapPanel);

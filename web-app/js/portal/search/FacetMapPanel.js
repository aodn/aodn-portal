/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetMapPanel = Ext.extend(Portal.search.CloneMapPanel, {

    RESOLUTIONS: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625],

    constructor: function (cfg) {
        this.polygonVector = new OpenLayers.Layer.Vector("GeoFilter Vector");
        this.polygonVector.events.register("sketchstarted", this, function () {
            this.clearGeometry();
        });

        this.polygonVector.events.register("sketchcomplete", this, function () {
            this.fireEvent('polygonadded', this.getCurrentFeature());
        });

        this.geoFacetMapToolbar = new Portal.search.GeoFacetMapToolbar(this.polygonVector);
        var config = Ext.apply({
            mapConfig: {
                controls: [
                    new OpenLayers.Control.ZoomPanel(),
                    this.geoFacetMapToolbar
                ],
                resolutions: this.RESOLUTIONS
            }
        }, cfg);

        Portal.search.FacetMapPanel.superclass.constructor.call(this, config);


        this.map.events.register("mouseover", this, function () {
            //need to do this because things go wack if the parent panel is moved, for instance due to scrolling
            this.map.updateSize();
        });

        this.addEvents('polygonadded');

        this.map.addLayer(this.polygonVector);
        // Otherwise we end up off the west coast of Africa
        this.zoomToInitialBbox();
        this.geoFacetMapToolbar.activateDefaultControl();
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

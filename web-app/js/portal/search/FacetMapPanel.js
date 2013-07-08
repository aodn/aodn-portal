/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetMapPanel = Ext.extend(Portal.search.CloneMapPanel, {

    constructor:function (cfg) {
        this.polygonVector = new OpenLayers.Layer.Vector("GeoFilter Vector");
        this.polygonDrawer = new OpenLayers.Control.DrawFeature(this.polygonVector, OpenLayers.Handler.Polygon, {title:"GeoFilter"});
        this.boxDrawer= new OpenLayers.Control.DrawFeature(this.polygonVector, OpenLayers.Handler.RegularPolygon, {title:"GeoFilter", handlerOptions:{irregular:true}});

        this.polygonVector.events.register("sketchstarted", this, function () {
            this.polygonVector.destroyFeatures();
        });

        this.polygonVector.events.register("beforefeatureadded", this, function (evt) {
            return !(this.checkSelfIntersection(evt.feature.geometry));
        });

        this.navigationController = new OpenLayers.Control.Navigation();
        this.zoom = new OpenLayers.Control.ZoomPanel();

        var config = Ext.apply({
            mapConfig: {
                controls: [
                    this.navigationController,
                    new OpenLayers.Control.MousePosition(),
                    this.zoom,
                    this.polygonDrawer,
                    this.boxDrawer
                ],
                restrictedExtent: new OpenLayers.Bounds.fromArray([null, -90, null, 90]),
                resolutions: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625]
            }
        }, cfg);

        Portal.search.FacetMapPanel.superclass.constructor.call(this, config);


        this.map.events.register("mouseover", this, function () {
            //need to do this because things go wack if the parent panel is moved, for instance due to scrolling
            this.map.updateSize();
        });

        this.map.addLayer(this.polygonVector);
        // Otherwise we end up off the west coast of Africa
        this.zoomToInitialBbox();
    },

    //Following three methods taken from a stackexchange thread at http://gis.stackexchange.com/questions/23755/determine-if-a-polygon-intersects-itself-in-openlayers
    checkSelfIntersection:function (polygon) {

        if (polygon.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
            //checking only outer ring
            var outer = polygon.components[0].components;
            var segments = [];
            for (var i = 1; i < outer.length; i++) {
                var segment = new OpenLayers.Geometry.LineString([outer[i - 1].clone(), outer[i].clone()]);
                segments.push(segment);
            }
            for (var j = 0; j < segments.length; j++) {
                if (this.segmentIntersects(segments[j], segments)) {
                    return true;
                }
            }
        }
        return false;
    },

    startOrStopEquals:function (segment1, segment2) {

        return segment1.components[0].equals(segment2.components[0])
            || segment1.components[0].equals(segment2.components[1])
            || segment1.components[1].equals(segment2.components[0])
            || segment1.components[1].equals(segment2.components[1]);
    },

    segmentIntersects:function (segment, segments) {
        for (var i = 0; i < segments.length; i++) {
            if (!segments[i].equals(segment)) {
                if (segments[i].intersects(segment) && !this.startOrStopEquals(segments[i], segment)) {
                    return true;
                }
            }
        }
        return false;
    },

    getCurrentFeature: function () {

        if (this.polygonVector.features.length > 0) {
            return this.polygonVector.features[0];
        }
        else {
            return false;
        }
    },

    getCurrentGeometry: function() {

        if (!this.getCurrentFeature()) {
            return false;
        }

        return this.getCurrentFeature().geometry;
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

        if (!this.getCurrentFeature()) {
            return false;
        }

        var wktFormatter = new OpenLayers.Format.WKT();
        return wktFormatter.write(this.getCurrentFeature());
    },

    switchToNavigation: function() {
        this.navigationController.activate();
        this.polygonDrawer.deactivate();
        this.boxDrawer.deactivate();
    },

    switchToPolygonDrawer: function() {
        this.navigationController.deactivate();
        this.polygonDrawer.activate();
        this.boxDrawer.deactivate();
    },

    switchToBoxDrawer: function() {
        this.navigationController.deactivate();
        this.polygonDrawer.deactivate();
        this.boxDrawer.activate();
    }
});

Ext.reg('portal.search.facetmappanel', Portal.search.FacetMapPanel);


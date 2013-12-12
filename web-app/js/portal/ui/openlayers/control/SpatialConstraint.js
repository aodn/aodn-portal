/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.ui.openlayers.control');

Portal.ui.openlayers.control.SpatialConstraint = Ext.extend(OpenLayers.Control.DrawFeature, {

    constructor: function(options) {

        options = options || {};

        var layer = new OpenLayers.Layer.Vector(
            'spatial constraint',
            {
                displayInLayerSwitcher: false
            }
        );

        var handler = options.handler || OpenLayers.Handler.RegularPolygon;
        options.handlerOptions =
            options.handlerOptions || {
                sides: 4,
                irregular: true
            };

        options.autoActivate = options.autoActivate || true;

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [layer, handler, options]);

        this._configureEventsAndHandlers();

        if (options.initialConstraint) {
            this.layer.addFeatures(new OpenLayers.Feature.Vector(options.initialConstraint));
            this.events.triggerEvent('spatialconstraintadded');
        }
    },

    _configureEventsAndHandlers: function() {
        this.events.addEventType('spatialconstraintadded');
        this.events.addEventType('spatialconstraintcleared');

        this.layer.events.on({
            scope: this,
            "sketchstarted": this._onSketchStarted,
            "sketchcomplete": this._onSketchComplete
        });
    },

    setMap: function(map) {
        map.addLayer(this.layer);
        return OpenLayers.Control.DrawFeature.prototype.setMap.apply(this, arguments);
    },

    removeFromMap: function() {
        this.deactivate();
        this.map.removeLayer(this.layer);
        this.map.removeControl(this);
    },

    clear: function() {
        this.layer.destroyFeatures();
    },

    hasConstraint: function() {
        return this._getFeature() != undefined;
    },

    getConstraint: function() {
        if (this.hasConstraint()) {
            return this._getFeature().geometry;
        }
    },

    getConstraintAsWKT: function() {
        if (this.hasConstraint()) {
            return this._getFeature().geometry.toWkt();
        }
    },

    _getFeature: function() {
        return this.layer.features[0];
    },

    _onSketchStarted: function() {
        this.clear();
    },

    _onSketchComplete: function(event) {
        this.events.triggerEvent('spatialconstraintadded', event.feature.geometry);
    }
});

Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap = function(map, handler) {
    map.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
        initialConstraint: Portal.utils.geo.bboxAsStringToGeometry(Portal.app.config.initialBbox),
        handler: handler,
        'displayClass': 'none'
    });

    map.addControl(map.spatialConstraintControl);

    map.spatialConstraintControl.events.on({
        scope: map,
        "spatialconstraintadded": function(geometry) {
            this.events.triggerEvent('spatialconstraintadded', geometry);
        },
        "spatialconstraintcleared": function() {
            this.events.triggerEvent('spatialconstraintcleared');
        }
    });

    if (Portal.app.config.initialBbox) {
        map.events.triggerEvent('spatialconstraintadded', map.spatialConstraintControl.getConstraint());
    }
};

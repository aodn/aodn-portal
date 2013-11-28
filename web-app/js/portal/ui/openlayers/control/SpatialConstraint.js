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
            var wktFormatter = new OpenLayers.Format.WKT();
            return wktFormatter.write(this._getFeature());
        }
    },

    _getFeature: function() {
        return this.layer.features[0];
    },

    _onSketchStarted: function() {
        this.events.triggerEvent('spatialconstraintcleared');
        this.clear();
    },

    _onSketchComplete: function(feature) {
        this.events.triggerEvent('spatialconstraintadded', feature.geometry);
    }
});

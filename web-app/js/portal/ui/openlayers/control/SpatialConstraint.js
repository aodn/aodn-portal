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

        var handler = options.handler || OpenLayers.Handler.Box;

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [layer, handler, options]);

        var self = this;
        this.events.addEventType('spatialconstraintadded');
        this.events.addEventType('spatialconstraintcleared');

        this.layer.events.on({
            "sketchstarted": function() {
                self.events.triggerEvent('spatialconstraintcleared');
            },
            "sketchcomplete": function(feature) {
                self.events.triggerEvent('spatialconstraintadded', feature.geometry);
            }
        });

        if (options.initialConstraint) {
            this.layer.addFeatures(new OpenLayers.Feature.Vector(options.initialConstraint));
            self.events.triggerEvent('spatialconstraintadded');
        }
    },

    setMap: function(map) {
        map.addLayer(this.layer);
        return OpenLayers.Control.DrawFeature.prototype.setMap.apply(this, arguments);
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
    }
});

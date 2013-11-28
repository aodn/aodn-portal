/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.ui.openlayers.control.SpatialConstraint', function() {

    var spatialConstraint;

    beforeEach(function() {
        spatialConstraint = new Portal.ui.openlayers.control.SpatialConstraint();
    });

    describe('constructor', function() {
        it('defaults', function() {
            expect(spatialConstraint).toBeInstanceOf(OpenLayers.Control.DrawFeature);
            expect(spatialConstraint.handler).toBeInstanceOf(OpenLayers.Handler.Box);
        });

        it('override handler', function() {
            spatialConstraint = new Portal.ui.openlayers.control.SpatialConstraint({
                handler: OpenLayers.Handler.Polygon
            });
            expect(spatialConstraint.handler).toBeInstanceOf(OpenLayers.Handler.Polygon);
        });

        it('initialise with constraint', function() {
            var constraint = constructGeometry();
            spatialConstraint = new Portal.ui.openlayers.control.SpatialConstraint({
                initialConstraint: constraint
            });

            expect(spatialConstraint.getConstraint()).toEqual(constraint);
        });
    });

    describe('layer', function() {
        it('intialises layer', function() {
            expect(spatialConstraint.layer).toBeInstanceOf(OpenLayers.Layer.Vector);
            expect(spatialConstraint.layer.displayInLayerSwitcher).toBeFalsy();
        });

        it("fires 'spatialconstraintadded' on layer sketchcomplete", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', feature);

            expect(eventSpy).toHaveBeenCalledWith(geometry);
        });

        it("fires 'spatialconstraintcleared' on layer sketchstarted", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintcleared');
            spatialConstraint.events.on({
                'spatialconstraintcleared': eventSpy
            });

            spatialConstraint.layer.events.triggerEvent('sketchstarted');

            expect(eventSpy).toHaveBeenCalled();
        });

        it('clears existing constraint on layer sketchstarted', function() {
            spyOn(spatialConstraint, 'clear');
            spatialConstraint.layer.events.triggerEvent('sketchstarted');
            expect(spatialConstraint.clear).toHaveBeenCalled();
        });
    });

    describe('map', function() {
        it('adds vector layer to map', function() {
            var map = new OpenLayers.Map();
            map.addControl(spatialConstraint);

            expect(map.layers).toContain(spatialConstraint.layer);
        });
    });

    describe('clear', function() {
        it('destroys existing feature', function() {
            spyOn(spatialConstraint.layer, 'destroyFeatures');
            spatialConstraint.clear();
            expect(spatialConstraint.layer.destroyFeatures).toHaveBeenCalled();
        });
    });

    describe('get constraint', function() {
        it('undefined when layer has no feature', function() {
            expect(spatialConstraint.hasConstraint()).toBe(false);
            expect(spatialConstraint.getConstraint()).toBe(undefined);
        });

        it('equal to geometry of first feature from vector layer', function() {
            var geometry = constructGeometry();
            spatialConstraint.layer.addFeatures(new OpenLayers.Feature.Vector(geometry));

            expect(spatialConstraint.hasConstraint()).toBe(true);
            expect(spatialConstraint.getConstraint()).toBe(geometry);
        });

        it('as WKT', function() {
            var geometry = constructGeometry();
            spatialConstraint.layer.addFeatures(new OpenLayers.Feature.Vector(geometry));

            expect(spatialConstraint.getConstraintAsWKT()).toBe('POLYGON((1 2,3 4,1 2))');
        });
    });

    var constructGeometry = function() {
        return OpenLayers.Geometry.fromWKT('POLYGON((1 2, 3 4, 1 2))');
    };
});

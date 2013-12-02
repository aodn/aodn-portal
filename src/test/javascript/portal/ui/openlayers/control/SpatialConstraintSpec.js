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
        describe('defaults', function() {
            it('is of type DrawFeature', function() {
                expect(spatialConstraint).toBeInstanceOf(OpenLayers.Control.DrawFeature);
            });

            it('configures handler', function() {
                expect(spatialConstraint.handler).toBeInstanceOf(OpenLayers.Handler.RegularPolygon);
                expect(spatialConstraint.handlerOptions.sides).toBe(4);
                expect(spatialConstraint.handlerOptions.irregular).toBe(true);
           });
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
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', { feature: feature });

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

        var map;

        beforeEach(function() {
            map = new OpenLayers.Map();
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
        });

        it('adds layer to map when control added', function() {
            expect(map.layers).toContain(map.spatialConstraintControl.layer);
        });

        it('removes layer from map when control removed', function() {
            expect(map.layers).toContain(map.spatialConstraintControl.layer);

            map.spatialConstraintControl.removeFromMap();
            expect(map.layers).not.toContain(map.spatialConstraintControl.layer);
        });

        it('fires events from map', function() {
            var addedSpy = jasmine.createSpy('added');
            var clearedSpy = jasmine.createSpy('cleared');

            map.events.on({
                scope: this,
                'spatialconstraintadded': addedSpy,
                'spatialconstraintcleared': clearedSpy
            });

            map.spatialConstraintControl.events.triggerEvent('spatialconstraintadded');
            map.spatialConstraintControl.events.triggerEvent('spatialconstraintcleared');

            expect(addedSpy).toHaveBeenCalled();
            expect(clearedSpy).toHaveBeenCalled();
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
});

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

    describe('user', function() {

        it("fires 'spatialconstraintadded' on redraw", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = spatialConstraint.redraw(geometry);

            expect(eventSpy).toHaveBeenCalledWith(geometry);
        });

        it("fires 'spatialconstraintusermodded' causes redraw", function() {

            spyOn(spatialConstraint, 'redraw');

            var geometry = constructGeometry();
            var map = new OpenLayers.SpatialConstraintMap();
            map.spatialConstraintControl = spatialConstraint;
            map.events.triggerEvent('spatialconstraintusermodded', geometry);

            expect(spatialConstraint.redraw).toHaveBeenCalledWith(geometry);
        });
    });

    describe('layer', function() {

        beforeEach(function() {
            spatialConstraint._getPercentOfViewportArea = function() {return 50};
        });

        it('intialises layer', function() {
            expect(spatialConstraint.layer).toBeInstanceOf(OpenLayers.Layer.Vector);
            expect(spatialConstraint.layer.displayInLayerSwitcher).toBeFalsy();
        });

        it("fires 'spatialconstraintadded' on layer sketchcomplete where viewport area is above minimum", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', { feature: feature });

            expect(eventSpy).toHaveBeenCalledWith(geometry);
        });

        it('clears existing constraint on layer sketchcomplete where viewport area is above minimum', function() {
            spyOn(spatialConstraint, 'clear');

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', { feature: feature });
            expect(spatialConstraint.clear).toHaveBeenCalled();
        });

        it('does not fire spatialconstraintadded where viewport area is below minimum', function() {
            spatialConstraint._getPercentOfViewportArea = function() {return 0.0001};
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', { feature: feature });

            expect(eventSpy).not.toHaveBeenCalled();
        });

        it('does not clear constraint where viewport area is below minimum', function() {
            spatialConstraint._getPercentOfViewportArea = function() {return 0.0001};

            spyOn(spatialConstraint, 'clear');
            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', { feature: feature });
            expect(spatialConstraint.clear).not.toHaveBeenCalled();
        });
    });

    describe('map', function() {

        var map;

        beforeEach(function() {
            map = new OpenLayers.SpatialConstraintMap();
            map.navigationControl = {
                activate: noOp,
                deactivate: noOp
            };
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

            map.events.on({
                scope: this,
                'spatialconstraintadded': addedSpy
            });

            map.spatialConstraintControl.events.triggerEvent('spatialconstraintadded');
            expect(addedSpy).toHaveBeenCalled();
        });

        describe('clear', function() {
            it('destroys existing feature', function() {
                spyOn(map.spatialConstraintControl.layer, 'destroyFeatures');
                map.spatialConstraintControl.clear();
                expect(map.spatialConstraintControl.layer.destroyFeatures).toHaveBeenCalled();
            });
        });

        it('moves drawing layers to larger z index when layer added', function() {
            var newLayer = new OpenLayers.Layer.Vector('new layer');
            map.addLayer(newLayer);

            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer.getZIndex());
            expect(map.spatialConstraintControl.handler.layer.getZIndex()).toBeGreaterThan(newLayer.getZIndex());
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(map.spatialConstraintControl.handler.layer.getZIndex());
        });

        it('moves drawing layers to larger z index when layer removed', function() {
            var newLayer1 = new OpenLayers.Layer.Vector('new layer1');
            var newLayer2 = new OpenLayers.Layer.Vector('new layer2');
            map.addLayer(newLayer1);
            map.addLayer(newLayer2);

            map.removeLayer(newLayer2);

            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer1.getZIndex());
            expect(map.spatialConstraintControl.handler.layer.getZIndex()).toBeGreaterThan(newLayer1.getZIndex());
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(map.spatialConstraintControl.handler.layer.getZIndex());
        });

        it('moves drawing layers to larger z index when layers shuffled', function() {
            var newLayer1 = new OpenLayers.Layer.Vector('new layer1');
            var newLayer2 = new OpenLayers.Layer.Vector('new layer2');
            var newLayer3 = new OpenLayers.Layer.Vector('new layer3');

            map.addLayer(newLayer1);
            map.addLayer(newLayer2);
            map.addLayer(newLayer3);
            map.raiseLayer(newLayer1, 2);

            // Higher Z index than newLayer1
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer1.getZIndex());
            expect(map.spatialConstraintControl.handler.layer.getZIndex()).toBeGreaterThan(newLayer1.getZIndex());

            // Higher Z index than newLayer2
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer2.getZIndex());
            expect(map.spatialConstraintControl.handler.layer.getZIndex()).toBeGreaterThan(newLayer2.getZIndex());

            // Higher Z index than newLayer3
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer3.getZIndex());
            expect(map.spatialConstraintControl.handler.layer.getZIndex()).toBeGreaterThan(newLayer3.getZIndex());

            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(map.spatialConstraintControl.handler.layer.getZIndex());
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

    describe('getPercentOfViewportArea', function() {
        beforeEach(function() {
            spatialConstraint._getMapArea = function() { return 113 };
        });

        it('returns the correct percentage of viewport area', function() {
            var viewportArea = 8;
            var expectedSolution = 7.079646017699115;

            expect(spatialConstraint._getPercentOfViewportArea(viewportArea)).toBe(expectedSolution);
        });

        it('returns a number', function() {
            var viewportArea = 8;

            expect(typeof spatialConstraint._getPercentOfViewportArea(viewportArea)).toEqual("number");
        });
    });
});

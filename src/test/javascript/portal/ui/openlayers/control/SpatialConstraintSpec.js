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

            expect(spatialConstraint.getConstraint().toString()).toEqual(wktPolygon);
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

            expect(eventSpy).toHaveBeenCalled();
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
            spatialConstraint.map = { events: { triggerEvent: noOp } };
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.layer.events.triggerEvent('sketchcomplete', { feature: feature });

            expect(eventSpy).not.toHaveBeenCalled();
        });

        it("getNormalizedGeometry fixes Geometries with longitudes > 180 ", function() {

            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((192.2 2, -178 4, 1 2))');
            var normalisedGeometry = spatialConstraint.getNormalizedGeometry(geometry);

            expect(normalisedGeometry.getBounds().toString()).toEqual('-178,2,1,4');
        });


        it("getNormalizedGeometry leaves alone Geometries with longitudes < 180 not crossing ante meridian ", function() {

            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((92.2 2, 178 4, 92.5 2))');
            var normalisedGeometry = spatialConstraint.getNormalizedGeometry(geometry);

            expect(normalisedGeometry.getBounds().toString()).toEqual('92.2,2,178,4');
        });

        it("getNormalizedGeometry fix Geometries with both longitudes > 180 not crossing ante meridian ", function() {

            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((292.2 2, 278 4, 292.5 2))');
            var normalisedGeometry = spatialConstraint.getNormalizedGeometry(geometry);

            expect(normalisedGeometry.getBounds().toString()).toEqual('-82,2,-67.5,4');
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
            expect(spatialConstraint.getConstraint().toString()).toEqual(wktPolygon);
        });

        it('getConstraint not return an un-normalised geometry', function() {
            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((250 2, 3 4, 1 2))');
            spatialConstraint.layer.addFeatures(new OpenLayers.Feature.Vector(geometry));
            expect(spatialConstraint.getConstraint().toString()).toEqual('POLYGON((-110 2,3 4,1 2,-110 2))');
        });

        it('as WKT', function() {
            var geometry = constructGeometry();
            spatialConstraint.layer.addFeatures(new OpenLayers.Feature.Vector(geometry));

            expect(spatialConstraint.getConstraintAsWKT()).toBe(wktPolygon);
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

    describe('_checkSketch', function() {
        var feature;
        beforeEach(function() {
            feature = {
                geometry: {
                    crossesDateLine: function() { return true; }
                }
            };
        });

        it('checks geometry and ante-merdian crossing', function() {
            spyOn(feature.geometry, 'crossesDateLine').andReturn(false);
            spyOn(spatialConstraint, 'isGeometryLargeEnough').andReturn(true);

            spatialConstraint._checkSketch(feature);

            expect(spatialConstraint.isGeometryLargeEnough).toHaveBeenCalled();
            expect(feature.geometry.crossesDateLine).toHaveBeenCalled();
        })

        it('returns true if geometry is big enough and does not cross ante-meridian', function() {
            spyOn(feature.geometry, 'crossesDateLine').andReturn(false);
            spyOn(spatialConstraint, 'isGeometryLargeEnough').andReturn(true);

            expect(spatialConstraint._checkSketch(feature)).toEqual(true);
        });

        it('returns false if geometry is too small, shows error', function() {
            spyOn(feature.geometry, 'crossesDateLine').andReturn(false);
            spyOn(spatialConstraint, 'isGeometryLargeEnough').andReturn(false);
            spyOn(spatialConstraint, '_showAnteMeridianError');

            expect(spatialConstraint._checkSketch(feature)).toEqual(false);
            expect(spatialConstraint._showAnteMeridianError).toHaveBeenCalled();
        });

        it('returns false if crosses ante-meridian, shows error', function() {
            spyOn(feature.geometry, 'crossesDateLine').andReturn(true);
            spyOn(spatialConstraint, 'isGeometryLargeEnough').andReturn(false);
            spyOn(spatialConstraint, '_showAnteMeridianError');

            expect(spatialConstraint._checkSketch(feature)).toEqual(false);
            expect(spatialConstraint._showAnteMeridianError).toHaveBeenCalled();
        });
    });

    describe('onSketchComplete', function() {
        it('fires off an analytics report', function() {
            var testEvent = {
                feature: {
                    geometry: constructGeometry()
                }
            };
            spatialConstraint._getPercentOfViewportArea = function() {
                return 0.02;
            };

            spyOn(window, 'trackUsage');
            spatialConstraint._onSketchComplete(testEvent);
            expect(window.trackUsage).toHaveBeenCalledWith('Filters', 'Spatial Constraint', 'sketched', undefined);

        })
    });
});

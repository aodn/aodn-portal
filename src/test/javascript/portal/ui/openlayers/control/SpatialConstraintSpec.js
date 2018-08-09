describe('Portal.ui.openlayers.control.SpatialConstraint', function() {

    var spatialConstraint;
    var map;

    beforeEach(function() {

        map = new OpenLayers.SpatialConstraintMap();

        spatialConstraint = new Portal.ui.openlayers.control.SpatialConstraint(
            map.constraintLayer,
            {
                validator: new Portal.filter.validation.SpatialConstraintValidator({
                    map: map
                }),
                map: map
            }
        );
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
            spatialConstraint = new Portal.ui.openlayers.control.SpatialConstraint(
                map.constraintLayer,
                {
                handler: OpenLayers.Handler.Polygon
            });
            expect(spatialConstraint.handler).toBeInstanceOf(OpenLayers.Handler.Polygon);
        });

        it('initialise with constraint', function() {
            var constraint = constructGeometry();
            spatialConstraint = new Portal.ui.openlayers.control.SpatialConstraint(
                map.constraintLayer,
                {
                    initialConstraint: constraint
                }
            );

            expect(spatialConstraint.getConstraint().toString()).toEqual(wktPolygon);
        });
    });

    describe('user', function() {

        it("fires 'spatialconstraintadded' and calls '_setGeometryFilter' on setGeometry", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spyOn(spatialConstraint, '_setGeometryFilter');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            spatialConstraint.setGeometry(geometry);

            expect(spatialConstraint._setGeometryFilter).toHaveBeenCalled();
            expect(eventSpy).toHaveBeenCalledWith(geometry);
        });

        it("fires 'spatialconstraintusermodded' causes drawGeometry", function() {

            spyOn(spatialConstraint, 'drawGeometry');

            var geometry = constructGeometry();
            map.spatialConstraintControl = spatialConstraint;
            map.events.triggerEvent('spatialconstraintusermodded', geometry);

            expect(spatialConstraint.drawGeometry).toHaveBeenCalledWith(geometry);
        });
    });

    describe('layer', function() {

        beforeEach(function() {
            spatialConstraint._checkSketch = returns(true);
        });

        it('intialises layer', function() {
            expect(spatialConstraint.vectorlayer).toBeInstanceOf(OpenLayers.Layer.Vector);
            expect(spatialConstraint.vectorlayer.displayInLayerSwitcher).toBeFalsy();
        });

        it("fires 'spatialconstraintadded' on layer sketchcomplete where geometry is valid", function() {
            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.vectorlayer.events.triggerEvent('sketchcomplete', { feature: feature });

            expect(eventSpy).toHaveBeenCalled();
        });

        it('clears existing constraint on layer sketchcomplete where geometry is valid', function() {
            spyOn(spatialConstraint, 'clear');

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.vectorlayer.events.triggerEvent('sketchcomplete', { feature: feature });
            expect(spatialConstraint.clear).toHaveBeenCalled();
        });

        it('does not fire spatialconstraintadded where geometry is invalid', function() {

            var findFeatureInfoForGeometrySpy = jasmine.createSpy('findFeatureInfoForGeometrySpy');
            spatialConstraint._checkSketch = returns(false);
            spatialConstraint.map = {
                events: { triggerEvent: noOp },
                mapPanel: {findFeatureInfoForGeometry: findFeatureInfoForGeometrySpy}
            };

            var eventSpy = jasmine.createSpy('spatialconstraintadded');
            spatialConstraint.events.on({
                'spatialconstraintadded': eventSpy
            });

            var geometry = constructGeometry();
            var feature = new OpenLayers.Feature.Vector(geometry);
            spatialConstraint.vectorlayer.events.triggerEvent('sketchcomplete', { feature: feature });

            expect(eventSpy).not.toHaveBeenCalled();
            expect(findFeatureInfoForGeometrySpy).toHaveBeenCalled();
        });

        it("getNormalizedGeometry fixes Geometries with longitudes > 180 ", function() {

            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((192.2 2, -178 4, 1 2))');
            var normalisedGeometry = spatialConstraint.getNormalizedGeometry(geometry);

            expect(normalisedGeometry.getBounds().toString()).toEqual('-178,2,1,4');
        });

        it("getNormalizedGeometry leaves alone Geometries with longitudes < 180 not crossing antimeridian ", function() {

            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((92.2 2, 178 4, 92.5 2))');
            var normalisedGeometry = spatialConstraint.getNormalizedGeometry(geometry);

            expect(normalisedGeometry.getBounds().toString()).toEqual('92.2,2,178,4');
        });

        it("getNormalizedGeometry fix Geometries with both longitudes > 180 not crossing antimeridian ", function() {

            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((292.2 2, 278 4, 292.5 2))');
            var normalisedGeometry = spatialConstraint.getNormalizedGeometry(geometry);

            expect(normalisedGeometry.getBounds().toString()).toEqual('-82,2,-67.5,4');
        });
    });

    describe('map', function() {

        var map;

        beforeEach(function() {
            map = new OpenLayers.SpatialConstraintMap();
            map.toolPanel = new OpenLayers.Control.Panel();
            map.navigationControl = {
                activate: noOp,
                deactivate: noOp
            };
            Portal.ui.openlayers.control.SpatialConstraint.createAndAddToMap(map);
        });

        it('adds layer to toolPanel when control added', function() {
            expect(map.toolPanel.controls[0].layer).toEqual(map.spatialConstraintControl.layer);
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
                map.spatialConstraintControl.map = map;
                map.spatialConstraintControl.clear();
                expect(map.spatialConstraintControl.layer.destroyFeatures).toHaveBeenCalled();
            });
        });

        it('moves drawing layers to larger z index when layer added', function() {
            var newLayer = new OpenLayers.Layer.Vector('new layer');
            map.addLayer(newLayer);

            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer.getZIndex());
        });

        it('moves drawing layers to larger z index when layer removed', function() {
            var newLayer1 = new OpenLayers.Layer.Vector('new layer1');
            var newLayer2 = new OpenLayers.Layer.Vector('new layer2');
            map.addLayer(newLayer1);
            map.addLayer(newLayer2);

            map.removeLayer(newLayer2);

            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer1.getZIndex());
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

            // Higher Z index than newLayer2
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer2.getZIndex());

            // Higher Z index than newLayer3
            expect(map.spatialConstraintControl.layer.getZIndex()).toBeGreaterThan(newLayer3.getZIndex());

        });
    });

    describe('get constraint', function() {
        it('undefined when layer has no feature', function() {
            expect(spatialConstraint.hasConstraint()).toBe(false);
            expect(spatialConstraint.getConstraint()).toBe(undefined);
        });

        it('equal to geometry of first feature from vector layer', function() {
            var geometry = constructGeometry();
            spatialConstraint.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(geometry));

            expect(spatialConstraint.hasConstraint()).toBe(true);
            expect(spatialConstraint.getConstraint().toString()).toEqual(wktPolygon);
        });

        it('getConstraint not return an un-normalised geometry', function() {
            var geometry = OpenLayers.Geometry.fromWKT('POLYGON((250 2, 3 4, 1 2))');
            spatialConstraint.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(geometry));
            expect(spatialConstraint.getConstraint().toString()).toEqual('POLYGON((-110 2,3 4,1 2,-110 2))');
        });

        it('as WKT', function() {
            var geometry = constructGeometry();
            spatialConstraint.vectorlayer.addFeatures(new OpenLayers.Feature.Vector(geometry));

            expect(spatialConstraint.getConstraintAsWKT()).toBe(wktPolygon);
        });
    });

    describe('_checkSketch', function() {

        var geometry;

        beforeEach(function() {
            geometry = {
                crossesAntimeridian: noOp
            };
        });

        it('checks geometry and antimerdian crossing', function() {
            spyOn(geometry, 'crossesAntimeridian').andReturn(false);
            spyOn(spatialConstraint.validator, '_isLargeEnough').andReturn(true);

            spatialConstraint._checkSketch(geometry);

            expect(spatialConstraint.validator._isLargeEnough).toHaveBeenCalled();
            expect(geometry.crossesAntimeridian).toHaveBeenCalled();
        });

        it('returns true if geometry is big enough and does not cross antimeridian', function() {
            spyOn(geometry, 'crossesAntimeridian').andReturn(false);
            spyOn(spatialConstraint.validator, '_isLargeEnough').andReturn(true);

            expect(spatialConstraint._checkSketch(geometry)).toEqual(true);
        });

        it('returns false if geometry is too small', function() {
            spyOn(geometry, 'crossesAntimeridian').andReturn(false);
            spyOn(spatialConstraint.validator, '_isLargeEnough').andReturn(false);

            expect(spatialConstraint._checkSketch(geometry)).toEqual(false);
        });

        it('returns false if crosses antimeridian', function() {
            spyOn(geometry, 'crossesAntimeridian').andReturn(true);
            spyOn(spatialConstraint.validator, '_isLargeEnough').andReturn(false);

            expect(spatialConstraint._checkSketch(geometry)).toEqual(false);
        });
    });

    describe('onSketchComplete', function() {

        var testEvent;
        var testGeometry;
        var normalisedGeometry;
        var returnValue;

        beforeEach(function() {
            testGeometry = constructGeometry();
            normalisedGeometry = spatialConstraint.getNormalizedGeometry(testGeometry);
            testEvent = { feature: { geometry: testGeometry } };

            spyOn(window, 'trackUsage');
        });

        describe('with valid geometry', function() {

            beforeEach(function() {
                spyOn(spatialConstraint, '_checkSketch').andReturn(true);
                spyOn(spatialConstraint, 'getNormalizedGeometry').andReturn(normalisedGeometry);
                spyOn(spatialConstraint, 'setGeometry');

                returnValue = spatialConstraint._onSketchComplete(testEvent);
            });

            it('normalises and sets the geometry', function() {
                expect(spatialConstraint.setGeometry).toHaveBeenCalledWith(normalisedGeometry);
            });

            it('fires off an analytics report', function() {
                expect(window.trackUsage).toHaveBeenCalledWith('Filters', 'Spatial Constraint', 'sketched', undefined);
            });

            it('returns falsey', function() {
                expect(returnValue).toBeTruthy();
            });
        });

        describe('with invalid geometry', function() {

            beforeEach(function() {

                spatialConstraint.map.mapPanel = {findFeatureInfoForGeometry: returns()};
                spyOn(spatialConstraint, '_checkSketch').andReturn(false);
                spyOn(spatialConstraint, '_resetErrorLayerAfterTimeout');

                returnValue = spatialConstraint._onSketchComplete(testEvent);
            });

            it('shows the error indicator', function() {
                expect(spatialConstraint.errorLayer.features[0].geometry).toEqual(testGeometry);
                expect(spatialConstraint._resetErrorLayerAfterTimeout).toHaveBeenCalled();
            });

            it('does not track a usage event', function() {
                expect(window.trackUsage).not.toHaveBeenCalled();
            });

            it('returns false', function() {
                expect(returnValue).toBeFalsy();
            });
        });
    });

    describe('polygonConstraint', function() {

        var map;
        var polygonConstraint;

        beforeEach(function() {

            map = new OpenLayers.SpatialConstraintMap();

            polygonConstraint = new Portal.ui.openlayers.control.SpatialConstraint(
                map.constraintLayer,
                {
                    validator: new Portal.filter.validation.SpatialConstraintValidator({
                        map: map
                    }),
                    map: map,
                    handler: OpenLayers.Handler.Polygon
                });

            spyOn(polygonConstraint, '_mapMouseDown');
            polygonConstraint.map.events.on({
                "mousedown": polygonConstraint._mapMouseDown
            });
        });

        it('mousedown event does call the spatialConstraints _mapMouseDown method', function() {

            map.events.triggerEvent('mousedown');

            expect(polygonConstraint._mapMouseDown).toHaveBeenCalled();

        });
    });
});

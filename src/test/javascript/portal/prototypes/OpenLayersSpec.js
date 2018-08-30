describe('OpenLayers', function() {

    describe("Layer.WMS", function() {

        var openLayer;

        beforeEach(function() {
            openLayer = new OpenLayers.Layer.WMS();
            openLayer.server = {};
        });

        it("no bounding box", function() {
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("no bounding box", function() {
            openLayer.bboxMinX = 10;
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("no bounding box", function() {
            openLayer.bboxMinY = 10;
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("no bounding box", function() {
            openLayer.bboxMaxX = 10;
            expect(openLayer.hasBoundingBox()).toBeFalsy();
        });

        it("has bounding box", function() {
            openLayer.bboxMinX = 10;
            openLayer.bboxMinY = 10;
            openLayer.bboxMaxX = 10;
            openLayer.bboxMaxY = 10;
            expect(openLayer.hasBoundingBox()).toBeTruthy();
        });

        describe("_is130", function() {
            it("returns false when not 1.3.0", function() {
                openLayer.isNcwms = returns(true);
                openLayer.server = {wmsVersion: '1.1.1'};
                expect(openLayer._is130()).toBeFalsy();
            });

            it("returns correct for 1.3.0", function() {
                openLayer.isNcwms = returns(true);
                openLayer.server = {wmsVersion: '1.3.0'};
                expect(openLayer._is130()).toBeTruthy();
                openLayer.isNcwms = returns(false);
                expect(openLayer._is130()).toBeTruthy();
            });
        });

        describe('getFeatureRequestUrl', function() {

            it('calls buildGetFeatureRequestUrl correctly', function() {

                spyOn(OpenLayers.Layer.WMS, 'buildGetFeatureRequestUrl');
                spyOn(Portal.filter.combiner, 'DataDownloadCqlBuilder').andReturn({
                    buildCql: returns('download filters')
                });

                var testFilters = ['filters'];

                OpenLayers.Layer.WMS.getFeatureRequestUrl(testFilters, 'wms_uri', 'layerName', 'csv');

                expect(Portal.filter.combiner.DataDownloadCqlBuilder).toHaveBeenCalledWith({filters: testFilters});
                expect(OpenLayers.Layer.WMS.buildGetFeatureRequestUrl).toHaveBeenCalledWith('wms_uri', 'layerName', 'csv', 'download filters');
            });
        });

        describe('buildGetFeatureRequestUrl', function() {

            it('does not add a ? if not required', function() {

                var getFeatureUrl = OpenLayers.Layer.WMS.buildGetFeatureRequestUrl("wfs_url?a=b");

                expect(getFeatureUrl.startsWith('wfs_url?a=b&')).toBe(true);
            });

            it('adds a ? if required', function() {

                var getFeatureUrl = OpenLayers.Layer.WMS.buildGetFeatureRequestUrl("wfs_url");

                expect(getFeatureUrl.startsWith('wfs_url?')).toBe(true);
            });

            it('does not use the CQL filter if it is missing', function() {

                var expectedUrl = 'wfs_url?' +
                    'typeName=type_name' +
                    '&SERVICE=WFS' +
                    '&outputFormat=txt' +
                    '&REQUEST=GetFeature' +
                    '&VERSION=1.0.0';

                var getFeatureUrl = OpenLayers.Layer.WMS.buildGetFeatureRequestUrl('wfs_url', 'type_name', 'txt');

                expect(getFeatureUrl).toBe(expectedUrl);
            });

            it('uses the CQL filter if it is present', function() {

                var expectedUrl = 'wfs_url?' +
                    'typeName=type_name' +
                    '&SERVICE=WFS' +
                    '&outputFormat=csv' +
                    '&REQUEST=GetFeature' +
                    '&VERSION=1.0.0' +
                    '&CQL_FILTER=cql%20%25%3A%2F';

                var getFeatureUrl = OpenLayers.Layer.WMS.buildGetFeatureRequestUrl('wfs_url', 'type_name', 'csv', 'cql %:/');

                expect(getFeatureUrl).toBe(expectedUrl);
            });

            describe('getCsvDownloadFormat', function() {

                it("returns configured CSV output format for server", function() {
                    openLayer.server.csvDownloadFormat = 'csv-rulz-man';
                    expect(openLayer.getCsvDownloadFormat()).toBe('csv-rulz-man');
                });

                it("returns 'csv' by default", function() {
                    openLayer.server.csvDownloadFormat = null;
                    expect(openLayer.getCsvDownloadFormat()).toBe('csv');
                });
            });
        });

        describe('getFeatureInfoRequestString', function() {
            describe('uses featureInfoFormat format', function() {
                beforeEach(function() {
                    openLayer.setMap(new OpenLayers.Map());
                    openLayer.map.getProjectionObject = returns({
                        getCode: noOp
                    });
                    openLayer._getBoundingBox = noOp;
                    openLayer.server = {
                        infoFormat: 'text/html'
                    };
                });

                it('when format not already specified', function() {
                    openLayer.mergeNewParams({
                        format: undefined // note that OpenLayers sets the default format to 'image/jpeg' in this case...
                    });

                    expect(openLayer.getFeatureInfoRequestString()).toHaveParameterWithValue('FORMAT', 'text/html');
                    expect(openLayer.getFeatureInfoRequestString()).not.toHaveParameterWithValue('FORMAT', 'image/jpeg');
                });

                it('when format already specified', function() {
                    openLayer.mergeNewParams({
                        format: 'image/png'
                    });

                    expect(openLayer.getFeatureInfoRequestString()).toHaveParameterWithValue('FORMAT', 'text/html');
                    expect(openLayer.getFeatureInfoRequestString()).not.toHaveParameterWithValue('FORMAT', 'image/png');
                });
            });
        });
    });

    describe('Geometry', function() {
        describe('isBox', function() {
            it('returns true when box', function() {
                expect(OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 2,3 4,1 4,1 2))').isBox()).toEqual(true);
            });

            it('returns false when box', function() {
                expect(OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 4,1 2))').isBox()).toEqual(false);
            });
        });

        describe('getPrettyBounds', function() {
            it('returns pretty rounded bounds', function() {
                expect(OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 2,3.14159265 4,1 4,1 2))').getPrettyBounds()).toEqual('From Lat/Lon 2, 1 to Lat/Lon 4, 3.142');
            });
        });
    });

    describe('doSetSpatialConstraint', function() {
        var map;
        beforeEach(function() {
            map = new OpenLayers.SpatialConstraintMap();
            map.toolPanel = new OpenLayers.Control.Panel();

            map.navigationControl = {
                activate: jasmine.createSpy(),
                deactivate: jasmine.createSpy()
            };
            map.clickControl = {
                activate: jasmine.createSpy(),
                deactivate: jasmine.createSpy()
            };

            spyOn(window, 'trackUsage');
        });

        it('set polygon spatial constraint control when style is POLYGON', function() {
            map.doSetSpatialConstraintStyle(Portal.ui.openlayers.SpatialConstraintType.POLYGON);

            expect(map.spatialConstraintControl.handler).toBeInstanceOf(OpenLayers.Handler.Polygon);
            expect(map.spatialConstraintControl.handler).not.toBeInstanceOf(OpenLayers.Handler.RegularPolygon);
            expect(map.spatialConstraintControl.displayClass).toBe('olControlDrawFeature');
            expect(map.toolPanel.controls).toContain(map.spatialConstraintControl);
            expect(map.navigationControl.deactivate).toHaveBeenCalled();
        });

        it('set polygon spatial constraint control when style is BOUNDING_BOX', function() {
            map.doSetSpatialConstraintStyle(Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX);

            expect(map.spatialConstraintControl.handler).toBeInstanceOf(OpenLayers.Handler.RegularPolygon);
            expect(map.spatialConstraintControl.handler.sides).toBe(4);
        });

        it('has spatial constraint control', function() {
            map.doSetSpatialConstraintStyle(Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX);
            expect(map.spatialConstraintControl).toBeInstanceOf(Portal.ui.openlayers.control.SpatialConstraint);
        });

        it('changes spatial constraint on type change', function() {
            var spatialConstraintClearedSpy = jasmine.createSpy();
            map.events.on({
                'spatialconstrainttypechanged': spatialConstraintClearedSpy
            });

            map.setSpatialConstraintStyle('a style  that the current style is not set to');
            expect(spatialConstraintClearedSpy).toHaveBeenCalled();

            expect(window.trackUsage).toHaveBeenCalledWith('Filters', 'Spatial Constraint', 'type=a style  that the current style is not set to', undefined);
        });
    });
});

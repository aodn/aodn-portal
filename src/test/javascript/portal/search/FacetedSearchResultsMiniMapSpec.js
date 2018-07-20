describe("Portal.search.FacetedSearchResultsMiniMap", function() {
    var miniMap;
    var bbox;
    var uuid = 1234;
    var storeRowIndex = 0;
    var mapContainerId = "aUniqueIdCreatedBy-FacetedSearchResultsDataView-mapElementId";

    beforeEach(function() {
        bbox = new Portal.search.MetadataExtent();
        miniMap = new Portal.search.FacetedSearchResultsMiniMap({
            bbox: bbox,
            mapContainerId: mapContainerId
        });
    });

    describe('initialisation', function() {
        it('configures metadata extent', function() {
            expect(miniMap.metadataExtent).toBe(bbox);
        });

        it('configures uuid', function() {
            expect(miniMap.mapContainerId).toBe(mapContainerId);
        });
    });

    describe('addLayersAndRender', function() {
        beforeEach(function() {
            spyOn(miniMap, '_addBaseAndExtentLayers');
            spyOn(miniMap, '_renderAndPosition');
            miniMap.addLayersAndRender();
        });

        it('calls addBaseAndExtentLayers', function() {
            expect(miniMap._addBaseAndExtentLayers).toHaveBeenCalled();
        });

        it('calls renderAndPosition', function() {
            expect(miniMap._renderAndPosition).toHaveBeenCalled();
        });
    });

    describe('_addBaseAndExtentLayers', function() {
        var baseLayer;
        var extentLayer;

        beforeEach(function() {
            baseLayer = miniMap._getBaseLayer();
            extentLayer = {};
            spyOn(miniMap, '_getExtentLayer').andReturn(extentLayer);
            spyOn(miniMap, 'addLayers');
        });

        it('calls addLayers with base and extent', function() {
            miniMap._addBaseAndExtentLayers();
            expect(miniMap.addLayers).toHaveBeenCalledWith([
                baseLayer, extentLayer
            ]);
        });
    });

    describe('_renderAndPosition', function() {
        beforeEach(function() {
            spyOn(miniMap, 'render');
            spyOn(miniMap, 'setCenter');
            spyOn(miniMap, 'zoomToExtent');
            spyOn(Ext, 'get').andReturn(true);

            Portal.app.appConfig.portal.defaultDatelineZoomBbox = "0,90,0,90";
        });

        it('calls render', function() {
            miniMap._renderAndPosition();
            expect(miniMap.render).toHaveBeenCalledWith(mapContainerId);
        });

        it('calls zoomTo if bounds are small / zoomlevel too far in', function() {
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(40, -39.001, 40.001, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            spyOn(miniMap, 'zoomTo');
            miniMap._renderAndPosition();
            expect(miniMap.zoomTo).toHaveBeenCalled();
        });

        it('calls zoomTo and not _zoomToMultiGeometries if extent has global coverage', function() {
            var globalGeometry = new OpenLayers.Geometry();
            var globalBounds = new OpenLayers.Bounds(-180, -42, 180, -39);
            globalGeometry.setBounds(globalBounds);
            spyOn(miniMap.metadataExtent, 'getGeometries').andReturn(new Array(globalGeometry));
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(-180, -42, 180, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            spyOn(miniMap, 'zoomTo');
            spyOn(miniMap, '_zoomToMultiGeometries');
            miniMap._renderAndPosition();
            expect(miniMap.zoomTo).toHaveBeenCalled();
            expect(miniMap._zoomToMultiGeometries).not.toHaveBeenCalled();
        });

        it('calls _zoomToMultiGeometries if extent has two geometries intersecting over the antimeridian', function() {
            var firstGeo = new OpenLayers.Geometry();
            var secondGeo = new OpenLayers.Geometry();
            firstGeo.setBounds(new OpenLayers.Bounds(57, -42, 180, -39));
            secondGeo.setBounds(new OpenLayers.Bounds(-180, -42, -168, -39));
            spyOn(miniMap.metadataExtent, 'getGeometries').andReturn(new Array(firstGeo, secondGeo));
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(-180, -42, 180, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            spyOn(miniMap, 'zoomTo');
            spyOn(miniMap, '_zoomToMultiGeometries');
            miniMap._renderAndPosition();
            expect(miniMap.zoomTo).not.toHaveBeenCalled();
            expect(miniMap._zoomToMultiGeometries).toHaveBeenCalled();
        });

        it('calls _zoomToMultiGeometries if extent has more than two geometries intersecting over the antimeridian', function() {
            var firstGeo = new OpenLayers.Geometry();
            var secondGeo = new OpenLayers.Geometry();
            var thirdGeo = new OpenLayers.Geometry();
            firstGeo.setBounds(new OpenLayers.Bounds(57, -42, 180, -39));
            secondGeo.setBounds(new OpenLayers.Bounds(-180, -42, -168, -39));
            thirdGeo.setBounds(new OpenLayers.Bounds(-180, -42, -165, -39));
            spyOn(miniMap.metadataExtent, 'getGeometries').andReturn(new Array(firstGeo, secondGeo, thirdGeo));
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(-180, -42, 180, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            spyOn(miniMap, 'zoomTo');
            spyOn(miniMap, '_zoomToMultiGeometries');
            miniMap._renderAndPosition();
            expect(miniMap.zoomTo).not.toHaveBeenCalled();
            expect(miniMap._zoomToMultiGeometries).toHaveBeenCalled();
        });

        it('averages the geometries to find the centre if the geom before the antimeridian is wider', function() {
            var firstBounds = new OpenLayers.Bounds(-180, -42, -168, -39);
            var secondBounds = new OpenLayers.Bounds(57, -42, 180, -39);
            var expectedBounds = new OpenLayers.Bounds(69, -42, 180, -39)
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(-180, -42, 180, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            miniMap._renderAndPosition();
            resultingGeometry = miniMap._centreAdjacentGeometries(firstBounds, secondBounds);
            resultingGeometryReverse = miniMap._centreAdjacentGeometries(secondBounds, firstBounds);
            expect(resultingGeometry.left).toBe(expectedBounds.left);
            expect(resultingGeometry.right).toBe(expectedBounds.right);
            expect(resultingGeometryReverse.left).toBe(expectedBounds.left);
            expect(resultingGeometryReverse.right).toBe(expectedBounds.right);
        });

        it('averages the geometries to find the centre if the geom after the antimeridian is wider', function() {
            var firstBounds = new OpenLayers.Bounds(168, -42, 180, -39);
            var secondBounds = new OpenLayers.Bounds(-180, -42, -57, -39);
            var expectedBounds = new OpenLayers.Bounds(-180, -42, -69, -39)
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(-180, -42, 180, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            miniMap._renderAndPosition();
            resultingGeometry = miniMap._centreAdjacentGeometries(firstBounds, secondBounds);
            resultingGeometryReverse = miniMap._centreAdjacentGeometries(secondBounds, firstBounds);
            expect(resultingGeometry.left).toBe(expectedBounds.left);
            expect(resultingGeometry.right).toBe(expectedBounds.right);
            expect(resultingGeometryReverse.left).toBe(expectedBounds.left);
            expect(resultingGeometryReverse.right).toBe(expectedBounds.right);
        });

        it('averages the geometries to find the centre if it has more than two geometries intersecting over the antimeridian', function() {
            var firstBounds = new OpenLayers.Bounds(-180, -42, -168, -39);
            var secondBounds = new OpenLayers.Bounds(57, -42, 180, -39);
            var thirdBounds = new OpenLayers.Bounds(-180, -42, -165, -39);
            var expectedBounds = new OpenLayers.Bounds(84, -42, 180, -39)
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(-180, -42, 180, -39));
            spyOn(miniMap, 'getZoomForExtent').andReturn(12);
            miniMap._renderAndPosition();
            resultingGeometry = miniMap._centreAdjacentGeometries(firstBounds, secondBounds);
            resultingGeometry = miniMap._centreAdjacentGeometries(resultingGeometry, thirdBounds);
            expect(resultingGeometry.left).toBe(expectedBounds.left);
            expect(resultingGeometry.right).toBe(expectedBounds.right);
        });

        it('calls zoomToExtent', function() {
            miniMap._renderAndPosition();
            expect(miniMap.zoomToExtent).toHaveBeenCalled();
        });

        it('calls zoomToExtent if bounds are not set', function() {
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(false);
            miniMap._renderAndPosition();
            expect(miniMap.zoomToExtent).toHaveBeenCalled();
        });
    });
});

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

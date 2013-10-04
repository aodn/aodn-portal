/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.FacetedSearchResultsMiniMap", function() {
    var miniMap;
    var bbox;
    var uuid;

    beforeEach(function() {
        bbox = new Portal.search.MetadataExtent();
        uuid = 1234;

        miniMap = new Portal.search.FacetedSearchResultsMiniMap({
            bbox: bbox,
            uuid: uuid
        });
    });

    describe('initialisation', function() {
        it('configures mouse position control', function() {
            expect(miniMap.controls[0]).toBeInstanceOf(OpenLayers.Control.MousePosition);
        });

        it('configures display projection', function() {
            expect(miniMap.displayProjection).toBe(miniMap.EPSG_4326_PROJECTION);
        });

        it('configures metadata extent', function() {
            expect(miniMap.metadataExtent).toBe(bbox);
        });

        it('configures uuid', function() {
            expect(miniMap.uuid).toBe(uuid);
        });
    });

    describe('addLayersAndRender', function() {
        beforeEach(function() {
            spyOn(miniMap, '_addBaseAndExtentLayers');
            spyOn(window, 'setTimeout');
            miniMap.addLayersAndRender();
        });

        it('calls addBaseAndExtentLayers', function() {
            expect(miniMap._addBaseAndExtentLayers).toHaveBeenCalled();
        });

        it('calls setTimeout', function() {
            expect(window.setTimeout).toHaveBeenCalled();
        });
    });

    describe('_addBaseAndExtentLayers', function() {
        var baseLayer;
        var extentLayer;

        beforeEach(function() {
            baseLayer = {};
            extentLayer = {};
            spyOn(miniMap, '_getBaseLayer').andReturn(baseLayer);
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
        });

        it('calls render', function() {
            miniMap._renderAndPosition();
            expect(miniMap.render).toHaveBeenCalledWith('fsSearchMap' + uuid);
        });

        it('calls setCenter if bounds are set', function() {
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(new OpenLayers.Bounds(40, -40, 80, 40));
            miniMap._renderAndPosition();
            expect(miniMap.setCenter).toHaveBeenCalled();
        });

        it('calls zoomToExtent if bounds are not set', function() {
            spyOn(miniMap.metadataExtent, 'getBounds').andReturn(false);
            miniMap._renderAndPosition();
            expect(miniMap.zoomToExtent).toHaveBeenCalled();
        });
    });

    describe('_calculateZoomLevel', function() {
        it('limits zoom level between 1 and 4 inclusive', function() {
            spyOn(miniMap, 'getZoomForExtent');

            expectZoomLevelForExtent(0, 1);
            expectZoomLevelForExtent(1, 1);
            expectZoomLevelForExtent(4, 4);
            expectZoomLevelForExtent(5, 4);
        });

        var expectZoomLevelForExtent = function(zoomForExtent, expectedZoomLevel) {
            miniMap.getZoomForExtent.andReturn(zoomForExtent);
            expect(miniMap._calculateZoomLevel()).toBe(expectedZoomLevel);
        };
    });
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MapPanel", function() {

    Ext.Ajax.request.isSpy = false;
    spyOn(Ext.Ajax, 'request').andReturn('');

    var appConfig = {
        initialBbox : '130,-60,160,-20',
        autoZoom : false,
        hideLayerOptions : false
    };

    var mapPanel = new Portal.ui.MapPanel({
        appConfig : appConfig
    });

    describe('message bus tests', function() {

        it('on selectedLayerChanged event', function() {
            spyOn(mapPanel, 'zoomToLayer');

            mapPanel.autoZoom = true;
            Ext.MsgBus.publish('selectedLayerChanged');

            expect(mapPanel.zoomToLayer).toHaveBeenCalled();
        });

        it('on baseLayerChanged event', function() {
            spyOn(mapPanel, 'onBaseLayerChanged');

            var baseLayerRecord = { layer: "asdf" };
            Ext.MsgBus.publish('baseLayerChanged', baseLayerRecord);

            expect(mapPanel.onBaseLayerChanged).toHaveBeenCalledWith(baseLayerRecord);
        });

    });

    describe('zoom to layer tests', function() {

        var openLayer = new OpenLayers.Layer.WMS();
        openLayer.server = { type: "WMS-1.1.0" };

        beforeEach(function() {
            spyOn(mapPanel, 'zoomTo');
            spyOn(mapPanel.map, 'setCenter');
        });

        it('zoomTo not called for layer without bounds', function() {

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).not.toHaveBeenCalled();
            expect(mapPanel.map.setCenter).not.toHaveBeenCalled();
        });

        it('zoomTo called for layer with bounds', function() {

            openLayer.bboxMinX = 10;
            openLayer.bboxMinY = 10;
            openLayer.bboxMaxX = 20;
            openLayer.bboxMaxY = 20;

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).toHaveBeenCalled();
            expect(mapPanel.map.setCenter).not.toHaveBeenCalled();
        });

        it('zoomToLayer called with layer having zoom override', function() {
            openLayer.zoomOverride = {
                centreLon: 12,
                centreLat: 34,
                openLayersZoomLevel: 5
            };

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).not.toHaveBeenCalled();
            expect(mapPanel.map.setCenter).toHaveBeenCalled();
        });
    });

    describe('reset event', function() {

        it('should call reset()', function() {

            spyOn(mapPanel, 'reset');
            Ext.MsgBus.publish('reset');
            expect(mapPanel.reset).toHaveBeenCalled();
        });

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish('reset');
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('removeAllLayers event', function() {

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish('removeAllLayers');
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    it('layersLoading', function() {

        spyOn(mapPanel, '_updateLayerLoadingSpinner');

        Ext.MsgBus.publish('layersLoading', 0);
        expect(mapPanel._updateLayerLoadingSpinner).toHaveBeenCalledWith(0);

        Ext.MsgBus.publish('layersLoading', 1);
        expect(mapPanel._updateLayerLoadingSpinner).toHaveBeenCalledWith(1);
    });

    describe('Adding layer from Geoserver Feature Info response', function() {
        it('addingLayersFromGetFeatureInfo', function(){
            var oldCount = mapPanel.layers.getCount();
            setExtWmsLayer('http://geoserver.imos.org.au/geoserver/wms','Argo Track 5901184','1.1.1','float_cycle_vw','','float_id = 3189','');
            expect(mapPanel.layers.getCount()).toBe(oldCount + 1);
        });
    });

    describe('Ensure the MapPanel has methods that collaborators depend on', function() {
        it('Checks that getPanelX() can be called', function() {
            expect(mapPanel.getPanelX).toBeDefined();
        });

        it('Checks that getPanelY() can be called', function() {
            expect(mapPanel.getPanelY).toBeDefined();
        });
    });

    describe('tabchange event', function () {

        it(' calls _updateLayerLoadingSpinner', function () {


            spyOn(mapPanel, '_updateLayerLoadingSpinner');

            mapPanel.fireEvent("tabchange");

            expect(mapPanel._updateLayerLoadingSpinner).toHaveBeenCalled();
        });
    });

    Ext.Ajax.request.isSpy = false;
});

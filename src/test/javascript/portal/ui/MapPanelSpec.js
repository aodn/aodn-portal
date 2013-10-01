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

    var mapPanel;

    beforeEach(function() {
        mapPanel = new Portal.ui.MapPanel({
            appConfig : appConfig
        });
    });

    describe('message bus tests', function() {

        it('on selectedLayerChanged event', function() {
            spyOn(mapPanel, 'zoomToLayer');

            mapPanel.autoZoom = true;
            Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);

            expect(mapPanel.zoomToLayer).toHaveBeenCalled();
        });

        it('on baseLayerChanged event', function() {
            spyOn(mapPanel, 'onBaseLayerChanged');

            var baseLayerRecord = { layer: "asdf" };
            Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_CHANGED, baseLayerRecord);

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
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel.reset).toHaveBeenCalled();
        });

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('geonetwork record added event', function() {
        it('maximises map actions control on active geonetork record added event', function() {
            spyOn(mapPanel, '_maximiseMapActionsControl');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(mapPanel._maximiseMapActionsControl).toHaveBeenCalled();
        });

        it('calls map actions control maximise', function() {
            mapPanel.mapOptions._initMapActionsControl(mapPanel);
            spyOn(mapPanel.mapOptions.mapActionsControl, 'maximizeControl');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(mapPanel.mapOptions.mapActionsControl.maximizeControl).toHaveBeenCalled();
        });
    });

    describe('removeAllLayers event', function() {

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish('removeAllLayers');
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('Adding layer from Geoserver Feature Info response', function() {

        var url = 'http://geoserver.imos.org.au/geoserver/wms';
        var label = 'Argo Track 5901184';
        var type = '1.1.1';
        var layer = 'float_cycle_vw';
        var options = 'float_id = 3189';

        beforeEach(function() {
            spyOn(Portal.data.LayerStore.instance(), 'addUsingDescriptor').andCallThrough();
        });

        it('addingLayersFromGetFeatureInfo', function() {
            var oldCount = mapPanel.layers.getCount();
            setExtWmsLayer(url, label, type, layer, '', options, '');
            expect(mapPanel.layers.getCount()).toBe(oldCount + 1);
        });

        it('LayerStore called directly', function() {
            setExtWmsLayer(url, label, type, layer, '', options, '');
            expect(Portal.data.LayerStore.instance().addUsingDescriptor).toHaveBeenCalled();
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

    describe('beforeParentHide()', function() {

        it('calls _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');

            mapPanel.beforeParentHide();

            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    Ext.Ajax.request.isSpy = false;
});

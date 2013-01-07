
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
    
    afterEach(function() {
        mapPanel.destroy(); 
    });

    describe('message bus tests', function() {
        
        it('on selectedLayerChanged event', function() {
            spyOn(mapPanel, 'zoomToLayer');
            
            mapPanel.autoZoom = true;
            Ext.MsgBus.publish('selectedLayerChanged');
            
            expect(mapPanel.zoomToLayer).toHaveBeenCalled();
        });

    });
    
    describe('zoom to layer tests', function() {
        
        var openLayer = new OpenLayers.Layer.WMS();
        
        beforeEach(function() {
            spyOn(mapPanel, 'zoomTo');
            
            mapPanel.getServer = function(openLayer) {
                return { type: "WMS-1.1.0" };
            }
        });
        
        it('zoomToLayer not called for layer without bounds', function() {
            
            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).not.toHaveBeenCalled();
        });
        
        it('zoomToLayer called for layer with bounds', function() {
        
            openLayer.bboxMinX = 10;
            openLayer.bboxMinY = 10;
            openLayer.bboxMaxX = 20;
            openLayer.bboxMaxY = 20;

            mapPanel.zoomToLayer(openLayer);
            expect(mapPanel.zoomTo).toHaveBeenCalled();
        });
    });

    it('reset', function() {

        spyOn(mapPanel, 'reset');
        Ext.MsgBus.publish('reset');
        expect(mapPanel.reset).toHaveBeenCalled();
    });

    it('layersLoading', function() {

        spyOn(mapPanel, '_updateLayerLoadingSpinner');

        Ext.MsgBus.publish('layersLoading', 0);
        expect(mapPanel._updateLayerLoadingSpinner).toHaveBeenCalledWith(0);

        Ext.MsgBus.publish('layersLoading', 1);
        expect(mapPanel._updateLayerLoadingSpinner).toHaveBeenCalledWith(1);
    });

    it('addingLayersFromGetFeatureInfo', function(){
        var glob = jasmine.getGlobal();
        spyOn(glob, 'getMapPanel').andCallFake(function() {return mapPanel});

        var oldCount = mapPanel.layers.getCount();

        var server = new Object();
        server.uri = 	"http://geoserver.imos.org.au/geoserver/wms";
        server.type = "1.1.1";
        server.opacity = 100;
        server.infoFormat = "text/html";

        var layerDesc = new Object();
        layerDesc.server = server;
        layerDesc.title = "Argo Track 5901184";
        layerDesc.name = "float_cycle_vw";
        layerDesc.cql =  "float_id = 3189";
        layerDesc.defaultStyle = "";
        layerDesc.queryable = true;

        setExtWmsLayer('http://geoserver.imos.org.au/geoserver/wms','Argo Track 5901184','1.1.1','float_cycle_vw','','float_id = 3189','');

        expect(mapPanel.layers.getCount()).toBe(oldCount + 1);

    });
    
    Ext.Ajax.request.isSpy = false;
});

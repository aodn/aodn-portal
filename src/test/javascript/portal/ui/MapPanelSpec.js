
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
        
        it('updateAnimationControlsPanel called on selectedLayerChanged event', function() {
            spyOn(mapPanel, 'updateAnimationControlsPanel');
            
            Ext.MsgBus.publish('selectedLayerChanged', { isAnimatable: function() { return true;}});
            
            expect(mapPanel.updateAnimationControlsPanel).toHaveBeenCalled();
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
    
    describe('contains layer', function() {
        
        var openLayer = new OpenLayers.Layer.WMS();
        
        it('does not contain layer', function() {
            expect(mapPanel.containsLayer(openLayer)).toBeFalsy();
        })
        
        it('does contain layer', function() {
            mapPanel._addLayer(openLayer);
            expect(mapPanel.containsLayer(openLayer)).toBeTruthy();
        });
    });
    
    Ext.Ajax.request.isSpy = false;
});

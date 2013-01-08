
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.RightDetailsPanel", function() {

    var rightDetailsPanel;
    
    beforeEach(function() {
        rightDetailsPanel = new Portal.ui.RightDetailsPanel();
    });
    
    afterEach(function() {
        rightDetailsPanel.destroy(); 
    });

    describe('message bus tests', function() {
        
        it('update called on selectedLayerChanged event', function() {
            spyOn(rightDetailsPanel, 'update');

            var openLayer = new OpenLayers.Layer.WMS(
                'My Open Layer',
                'Mock URI'
            );
            
            Ext.MsgBus.publish('selectedLayerChanged', openLayer);
            
            expect(rightDetailsPanel.update).toHaveBeenCalled();
        });
    });
});

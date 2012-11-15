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
            
            Ext.MsgBus.publish('selectedLayerChanged', {});
            
            expect(rightDetailsPanel.update).toHaveBeenCalled();
        });
    });
});
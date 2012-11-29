
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.ActiveLayersPanel", function() {
    
    var activeLayersPanel = {};
    activeLayersPanel.activeLayersTreePanelSelectionChangeHandler = Portal.ui.ActiveLayersPanel.prototype.activeLayersTreePanelSelectionChangeHandler;
    activeLayersPanel.fireEvent = function(event) {}

    it("selection change triggers selectedLayerChanged event", function() {
        
        var selectedLayerChangedFired = false;
        
        Ext.MsgBus.subscribe("selectedLayerChanged", function() {
            selectedLayerChangedFired = true;
        });
        
        activeLayersPanel.activeLayersTreePanelSelectionChangeHandler({}, { layer: { isAnimatable: function() { return false}}});
        expect(selectedLayerChangedFired).toBe(true);
    });
});

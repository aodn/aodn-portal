
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.ViewPort", function() {
    var mockConfig = {
        westWidth: 30,
        headerHeight: 40
    };
    
    var mockMainTabPanel = {
        region: 'center',
        getMapPanel: jasmine.createSpy().andReturn({}),
        setActiveTab: jasmine.createSpy(),
        isMapVisible: jasmine.createSpy().andReturn(true)
    };
    
    var mockLayerChooserPanel = {
        show: function() {},
        hide: function() {}
    };

    var buildMockViewport = function() {
        spyOn(Portal.ui, "MainTabPanel").andReturn(mockMainTabPanel);
        spyOn(Portal.ui, "LayerChooserPanel").andReturn(mockLayerChooserPanel);
        spyOn(Portal.ui.Viewport.superclass.constructor, "call");
        
        return new Portal.ui.Viewport({appConfig: mockConfig});
    };
    
    it("creates mainTabPanel and layerChooser on instantiation", function() {
        var viewport = buildMockViewport();
        
        expect(Portal.ui.MainTabPanel).toHaveBeenCalled();
        expect(Portal.ui.LayerChooserPanel).toHaveBeenCalled();
        expect(mockMainTabPanel.getMapPanel).toHaveBeenCalled();
        expect(Portal.ui.Viewport.superclass.constructor.call).toHaveBeenCalled();
        expect(viewport.mainTabPanel).toEqual(mockMainTabPanel);
        expect(viewport.layerChooserPanel).toEqual(mockLayerChooserPanel);
    });
    
    it("calls mainTabPanel.setActiveTab when setActiveTab called", function() {
        var viewport = buildMockViewport();
        
        viewport.setActiveTab(1);
        
        expect(mockMainTabPanel.setActiveTab).toHaveBeenCalledWith(1);
    });
    
    it("returns value of mainTabPanel.isMapVisible when isMapVisible is called", function() {
        var viewport = buildMockViewport();
        
        var isMapVisible = viewport.isMapVisible();
        
        expect(isMapVisible).toEqual(true);
    });
    
});

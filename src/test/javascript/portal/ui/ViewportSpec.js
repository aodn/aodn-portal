
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.Viewport", function() {
    var mockConfig = {
        westWidth: 30,
        headerHeight: 40
    };

    var mockMainPanel = {
        region: 'center',
        setActiveTab: jasmine.createSpy(),
        isMapVisible: jasmine.createSpy().andReturn(true)
    };

    var buildMockViewport = function() {
        spyOn(Portal.ui, "MainPanel").andReturn(mockMainPanel);
        spyOn(Portal.ui.Viewport.superclass.constructor, "call");

        return new Portal.ui.Viewport({appConfig: mockConfig});
    };

    it("creates mainPanel on instantiation", function() {
        var viewport = buildMockViewport();

        expect(Portal.ui.MainPanel).toHaveBeenCalled();
        expect(Portal.ui.Viewport.superclass.constructor.call).toHaveBeenCalled();
        expect(viewport.mainPanel).toEqual(mockMainPanel);
    });

    it("calls mainPanel.setActiveTab when setActiveTab called", function() {
        var viewport = buildMockViewport();

        viewport.setActiveTab(1);

        expect(mockMainPanel.setActiveTab).toHaveBeenCalledWith(1);
    });

    it("returns value of mainPanel.isMapVisible when isMapVisible is called", function() {
        var viewport = buildMockViewport();

        var isMapVisible = viewport.isMapVisible();

        expect(isMapVisible).toEqual(true);
    });
});

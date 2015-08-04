describe("Portal.ui.Viewport", function() {

    var viewport;

    var mockConfig = {
        westWidth: 30,
        headerHeight: 40
    };

    var mockMainPanel = {
        region: 'center',
        setActiveTab: jasmine.createSpy()
    };

    beforeEach(function() {
        spyOn(Portal.ui, "MainPanel").andReturn(mockMainPanel);
        spyOn(Portal.ui.Viewport.superclass.constructor, "call");
        spyOn(Portal.ui.Viewport.prototype, '_newLayerStore').andReturn({});

        spyOn(Portal.ui, 'MapPanel');
        spyOn(Portal.ui, 'VisualisePanel');
        spyOn(Portal.search, 'SearchPanel');
        spyOn(Portal.cart, 'DownloadPanel');

        viewport = new Portal.ui.Viewport({appConfig: mockConfig});
    });

    it("creates mainPanel on instantiation", function() {

        expect(Portal.ui.MainPanel).toHaveBeenCalled();
        expect(Portal.ui.Viewport.superclass.constructor.call).toHaveBeenCalled();
        expect(viewport.mainPanel).toEqual(mockMainPanel);
    });

    it('creates necessary objects for dependancy injection', function() {

        expect(Portal.ui.MapPanel).toHaveBeenCalled();
        expect(Portal.ui.VisualisePanel).toHaveBeenCalled();
        expect(Portal.search.SearchPanel).toHaveBeenCalled();
        expect(Portal.cart.DownloadPanel).toHaveBeenCalled();
    });

    it("calls mainPanel.setActiveTab when setActiveTab called", function() {

        viewport.setActiveTab(1);

        expect(mockMainPanel.setActiveTab).toHaveBeenCalledWith(1);
    });
});

describe("Portal.search.FreeTextSearchPanel", function()
{
    var freeTextSearchPanel;

    var buildMockFreeTextSearchPanel = function() {
        freeTextSearchPanel = new Portal.search.FreeTextSearchPanel();
        freeTextSearchPanel.searcher = {
            removeFilters: function() {},
            addFilter: function() {},
            search: function() {}
        };
        freeTextSearchPanel.currentFilterContainer.collapse = function() {};
        return freeTextSearchPanel;
    };

    beforeEach(function() {
        freeTextSearchPanel = buildMockFreeTextSearchPanel();
    });

    it("searches when return pressed", function() {
        spyOn(freeTextSearchPanel, 'onGo');
        var event = {
            getKey: function() { return this.ENTER; },
            ENTER: "just a constant"
        };
        freeTextSearchPanel.onSearchChange(null, event);
        expect(freeTextSearchPanel.onGo).toHaveBeenCalled();
    });

    it("clears text box on clear", function() {
        spyOn(freeTextSearchPanel, 'onGo');
        spyOn(freeTextSearchPanel.searchField, 'reset');

        freeTextSearchPanel.resetLink.fireEvent('click');

        expect(freeTextSearchPanel.onGo).toHaveBeenCalled();
        expect(freeTextSearchPanel.searchField.reset).toHaveBeenCalledWith();
    });

    it("clears text box and filters on fresh search", function() {
        spyOn(freeTextSearchPanel.searchField, 'reset');
        spyOn(freeTextSearchPanel.searcher, 'removeFilters');

        freeTextSearchPanel.removeAnyFilters();

        expect(freeTextSearchPanel.searcher.removeFilters).toHaveBeenCalledWith('any');
        expect(freeTextSearchPanel.searchField.reset).toHaveBeenCalled();
    });

    describe("google analytics", function() {
        beforeEach(function() {
            spyOn(window, 'trackFacetUsage');
        });

        it("sends tracking information on go", function() {
            spyOn(freeTextSearchPanel.searchField, 'getRawValue').andReturn("search value");
            freeTextSearchPanel.onGo();
            expect(window.trackFacetUsage).toHaveBeenCalledWith("Keyword", "search value");
        });

        it("tracking information is case insensitive", function() {
            spyOn(freeTextSearchPanel.searchField, 'getRawValue').andReturn("SEARCH VALUE 222");
            freeTextSearchPanel.onGo();
            expect(window.trackFacetUsage).toHaveBeenCalledWith("Keyword", "search value 222");
        });
    });
});

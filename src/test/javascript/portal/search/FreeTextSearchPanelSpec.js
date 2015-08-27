
/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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

        freeTextSearchPanel.clearSearch();

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

    it("sends google analytics tracking information on go", function() {
        spyOn(window, 'trackFacetUsage');
        freeTextSearchPanel.onGo();
        expect(window.trackFacetUsage).toHaveBeenCalled();
    });
});

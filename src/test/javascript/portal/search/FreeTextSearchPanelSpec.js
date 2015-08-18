
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
        spyOn(freeTextSearchPanel.searchField, 'setRawValue');

        freeTextSearchPanel.clearSearch();

        expect(freeTextSearchPanel.onGo).toHaveBeenCalled();
        expect(freeTextSearchPanel.searchField.setRawValue).toHaveBeenCalledWith('');
    });

    it("sends google analytics tracking information on go", function() {
        spyOn(window, 'trackFacetUsage');
        freeTextSearchPanel.onGo();
        expect(window.trackFacetUsage).toHaveBeenCalled();
    });
});

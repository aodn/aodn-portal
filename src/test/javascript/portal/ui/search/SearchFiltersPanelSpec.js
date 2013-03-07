
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.search.SearchFiltersPanel", function() {

    var searchFiltersPanel;
    
    beforeEach(function() {
        searchFiltersPanel = new Portal.ui.search.SearchFiltersPanel({ searcher: new Portal.service.CatalogSearcher()});
    });
    
    it("flex 3, 1 for title bar item 0, 1", function() {
        expect(searchFiltersPanel.titleBar.items.get(0).flex).toBe(3);
        expect(searchFiltersPanel.titleBar.items.get(1).flex).toBe(1);
    });

    it("requests build summary only search when \'Clear all\' clicked", function() {
        searchFiltersPanel.searcher.search = jasmine.createSpy('search');

        searchFiltersPanel._onClearAllClicked();

        expect(searchFiltersPanel.searcher.search).toHaveBeenCalledWith(true);
    });
});

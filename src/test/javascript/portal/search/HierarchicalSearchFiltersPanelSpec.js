/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.HierarchicalSearchFiltersPanel", function() {

    var searchFiltersPanel;

    beforeEach(function() {
        searchFiltersPanel = new Portal.search.HierarchicalSearchFiltersPanel({
            searcher: new Portal.service.CatalogSearcher()
        });
    });

    it('initialisation', function() {

            expect(searchFiltersPanel.items.length).toBeGreaterThan(2);

    });
});

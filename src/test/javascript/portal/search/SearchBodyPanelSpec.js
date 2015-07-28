/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.SearchBodyPanel", function() {

    var searchBodyPanel;

    beforeEach(function() {
        searchBodyPanel = new Portal.search.SearchBodyPanel({
            resultsStore: new Portal.data.GeoNetworkRecordStore(),
            searcher: new Portal.service.CatalogSearcher()
        });

        spyOn(searchBodyPanel.searchResultsPanel, '_resetScrollPositionToTop');
    });

    describe('initialisation', function() {

        it('initialises results grid', function() {
            var searchResultsPanel = searchBodyPanel.searchResultsPanel;
            expect(searchResultsPanel).toBeInstanceOf(Portal.search.FacetedSearchResultsPanel);
            expect(searchResultsPanel.store).toBe(searchBodyPanel.resultsStore);
        });
    });

    describe('results store events', function() {
        it('calls onResultsStoreLoad', function() {
            spyOn(searchBodyPanel, '_onResultsStoreLoad');
            searchBodyPanel.resultsStore.fireEvent('load', searchBodyPanel.resultsStore);
            expect(searchBodyPanel._onResultsStoreLoad).toHaveBeenCalled();
        });

        describe('onResultsStoreLoad', function() {
            it('displays alert when store is empty', function() {
                spyOn(searchBodyPanel, '_displayNoResultsAlert');
                searchBodyPanel.resultsStore.getTotalCount = returns(0);
                searchBodyPanel._onResultsStoreLoad();
                expect(searchBodyPanel._displayNoResultsAlert).toHaveBeenCalled();
            });
        });
    });
});

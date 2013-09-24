/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.search.SearchBodyPanel", function() {

    var searchBodyPanel;

    beforeEach(function() {
        searchBodyPanel = new Portal.ui.search.SearchBodyPanel({
            resultsStore: new Portal.data.GeoNetworkRecordStore(),
            searcher: new Portal.service.CatalogSearcher()
        });
    });

    describe('initialisation', function() {
        it('sets fit layout', function() {
            expect(searchBodyPanel.layout).toBe('fit');
        });

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
                searchBodyPanel.resultsStore.getTotalCount = function() { return 0; };
                searchBodyPanel._onResultsStoreLoad();
                expect(searchBodyPanel._displayNoResultsAlert).toHaveBeenCalled();
            });
        });
    });

    describe('searcher events', function() {
        beforeEach(function() {
            spyOn(searchBodyPanel.searchResultsPanel, 'showLoadMask');
            spyOn(searchBodyPanel.searchResultsPanel, 'hideLoadMask');
        });

        it('calls searchResultsPanel showLoadMask on searchstart', function() {
            searchBodyPanel.searcher.fireEvent('searchstart');
            expect(searchBodyPanel.searchResultsPanel.showLoadMask).toHaveBeenCalled();
        });

        it('calls searchResultsPanel hideLoadMask on searchcomplete', function() {
            searchBodyPanel.searcher.fireEvent('searchcomplete');
            expect(searchBodyPanel.searchResultsPanel.hideLoadMask).toHaveBeenCalled();
        });

        it('calls searchResultsPanel hideLoadMask on summaryOnlySearchComplete', function() {
            searchBodyPanel.searcher.fireEvent('summaryOnlySearchComplete');
            expect(searchBodyPanel.searchResultsPanel.hideLoadMask).toHaveBeenCalled();
        });

        it('calls searchResultsPanel hideLoadMask on searcherror', function() {
            searchBodyPanel.searcher.fireEvent('searcherror');
            expect(searchBodyPanel.searchResultsPanel.hideLoadMask).toHaveBeenCalled();
        });
    });
});

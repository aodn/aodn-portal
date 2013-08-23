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
            resultsStore: new Portal.data.GeoNetworkRecordStore()
        });
    });

    describe('initialisation', function() {
        it('sets card layout', function() {
            expect(searchBodyPanel.layout).toBe('card');
        });

        it('initialises splash panel', function() {
            var splashPanel = searchBodyPanel.splashPanel;
            expect(splashPanel).toBeInstanceOf(Portal.ui.HomePanel);
            expect(searchBodyPanel.items.get(0)).toBe(splashPanel);
            expect(searchBodyPanel.activeItem).toBe(splashPanel);
        });

        it('initialises results grid', function() {
            var resultsGrid = searchBodyPanel.resultsGrid;
            expect(resultsGrid).toBeInstanceOf(Portal.search.FacetedSearchResultsGrid);
            expect(searchBodyPanel.items.get(1)).toBe(resultsGrid);
            expect(resultsGrid.hidden).toBeTruthy();
            expect(resultsGrid.store).toBe(searchBodyPanel.resultsStore);
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

            it('activates results grid card when store is not empty', function() {
                spyOn(searchBodyPanel, '_activateResultsGridCard');
                searchBodyPanel.resultsStore.getTotalCount = function() { return 1; };
                searchBodyPanel._onResultsStoreLoad();
                expect(searchBodyPanel._activateResultsGridCard).toHaveBeenCalled();
            });
        });
    });

    describe('filters panel events', function() {
        it('displays splash page on cleared filters', function() {
            spyOn(searchBodyPanel, '_activateSplashCard');
            searchBodyPanel.onFiltersCleared();
            expect(searchBodyPanel._activateSplashCard).toHaveBeenCalled();
        });
    });
});

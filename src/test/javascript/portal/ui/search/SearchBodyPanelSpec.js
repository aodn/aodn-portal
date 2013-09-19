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
        it('sets fit layout', function() {
            expect(searchBodyPanel.layout).toBe('fit');
        });

        it('initialises results grid', function() {
            var resultsGrid = searchBodyPanel.resultsGrid;
            expect(resultsGrid).toBeInstanceOf(Portal.search.FacetedSearchResultsGrid);
            expect(searchBodyPanel.items.get(0)).toBe(resultsGrid);
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
        });
    });
});

/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.search.SearchPanel", function() {

    var searchPanel;

    beforeEach(function() {
        searchPanel = new Portal.ui.search.SearchPanel({ protocols: {} });
    });

    describe('initialisation', function() {
        it('initialised Search', function() {
            expect(searchPanel.searcher).toBeInstanceOf(Portal.service.CatalogSearcher);
        });

        it('initialises SearchFiltersPanel', function() {
            expect(searchPanel.filtersPanel).toBeInstanceOf(Portal.ui.search.SearchFiltersPanel);
            expect(searchPanel.filtersPanel.searcher).toBeTruthy();
            expect(searchPanel.filtersPanel.region).toBe('west');
            expect(searchPanel.filtersPanel.split).toBeTruthy();
            expect(searchPanel.filtersPanel.width).toBe(340);
            expect(searchPanel.filtersPanel.bodyCssClass).toBe('p-header-space');
        });


        it('initialises results store', function() {
            var resultsStore = searchPanel.resultsStore;
            expect(resultsStore).toBeInstanceOf(Portal.data.GeoNetworkRecordStore);
        });

        it('initialises SearchBodyPanel', function() {
            expect(searchPanel.bodyPanel).toBeInstanceOf(Portal.ui.search.SearchBodyPanel);
            expect(searchPanel.bodyPanel.region).toBe('center');
            expect(searchPanel.bodyPanel.unstyled).toBeTruthy();
            expect(searchPanel.bodyPanel.unstyled).toBeTruthy();
        });
    });

    describe('searcher events', function() {
        it('loads data on completed search', function() {
            spyOn(searchPanel.resultsStore, 'loadData');
            spyOn(searchPanel.filtersPanel, '_setSpinnerText');
            var response = {};

            searchPanel.searcher.fireEvent('searchcomplete', response);
            expect(searchPanel.resultsStore.loadData).toHaveBeenCalledWith(response);
        });
    });

    describe('filters panel events', function() {
        it('notifies body panel on cleared filters', function() {
            spyOn(searchPanel.bodyPanel, 'onFiltersCleared');
            searchPanel.filtersPanel.fireEvent('filtersCleared');
            expect(searchPanel.bodyPanel.onFiltersCleared).toHaveBeenCalled();
        });
    });
});

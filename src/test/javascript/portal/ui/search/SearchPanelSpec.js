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
            var page = {from: 20, to: 40};

            searchPanel.searcher.fireEvent('searchcomplete', response, page);
            expect(searchPanel.resultsStore.loadData).toHaveBeenCalledWith(response);
            expect(searchPanel.resultsStore.startRecord).toEqual(19);
        });
    });

    describe('initComponent', function() {
        it('calls searcher search', function() {
            spyOn(searchPanel.searcher, 'search');
            spyOn(Portal.ui.search.SearchPanel.superclass, 'initComponent');
            searchPanel.initComponent();
            expect(searchPanel.searcher.search).toHaveBeenCalled();
        });
    });
});

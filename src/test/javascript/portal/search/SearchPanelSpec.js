describe("Portal.search.SearchPanel", function() {

    var searchPanel;

    beforeEach(function() {
        Portal.app.appConfig.enabledFacets = [];
        searchPanel = new Portal.search.SearchPanel({ protocols: {} });
        searchPanel.filtersPanel.spinner.update = noOp;

    });

    describe('initialisation', function() {
        it('initialised Search', function() {
            expect(searchPanel.searcher).toBeInstanceOf(Portal.service.CatalogSearcher);
        });

        it('initialises SearchFiltersPanel', function() {
            expect(searchPanel.filtersPanel).toBeInstanceOf(Portal.search.SearchFiltersPanel);
            expect(searchPanel.filtersPanel.searcher).toBeTruthy();
        });

        it('initialises results store', function() {
            var resultsStore = searchPanel.resultsStore;
            expect(resultsStore).toBeInstanceOf(Portal.data.MetadataRecordStore);
        });

        it('initialises SearchBodyPanel', function() {
            expect(searchPanel.bodyPanel).toBeInstanceOf(Portal.search.SearchBodyPanel);
        });
    });

    describe('searcher events', function() {
        it('loads data on completed search', function() {
            spyOn(searchPanel.resultsStore, 'loadData');
            spyOn(searchPanel.filtersPanel, '_setSpinnerText');
            var response = {};
            var page = {from: 30, to: 40};

            searchPanel.searcher.fireEvent('searchcomplete', response, page);
            expect(searchPanel.resultsStore.loadData).toHaveBeenCalled();
            expect(searchPanel.resultsStore.startRecord).toEqual(29);
        });


        it('sets scroll position to 0', function() {
            spyOn(searchPanel.resultsStore, 'loadData');
            spyOn(searchPanel.filtersPanel, '_setSpinnerText');
            spyOn(searchPanel.bodyPanel, 'resetScrollPositionToTop');
            var response = {};
            var page = {from: 1, to: 10};

            searchPanel.searcher.fireEvent('searchcomplete', response, page);
            expect(searchPanel.bodyPanel.resetScrollPositionToTop).toHaveBeenCalled();
        });

    });

    describe('initComponent', function() {
        it('calls searcher search', function() {
            spyOn(searchPanel.searcher, 'search');
            spyOn(Portal.search.SearchPanel.superclass, 'initComponent');
            searchPanel.initComponent();
            expect(searchPanel.searcher.search).toHaveBeenCalled();
        });
    });
});

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
            var page = {from: 20, to: 40};

            searchPanel.searcher.fireEvent('searchcomplete', response, page);
            expect(searchPanel.resultsStore.loadData).toHaveBeenCalledWith(response);
            expect(searchPanel.resultsStore.startRecord).toEqual(19);
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

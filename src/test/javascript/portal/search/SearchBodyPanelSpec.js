describe("Portal.search.SearchBodyPanel", function() {

    var searchBodyPanel;

    beforeEach(function() {
        searchBodyPanel = new Portal.search.SearchBodyPanel({
            resultsStore: new Portal.data.MetadataRecordStore(),
            searcher: new Portal.service.CatalogSearcher()
        });
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
                spyOn(searchBodyPanel, '_resetScrollPositionToTop');
                spyOn(searchBodyPanel, '_displayNoResultsAlert');
                searchBodyPanel.resultsStore.getTotalCount = returns(0);
                searchBodyPanel._onResultsStoreLoad();
                expect(searchBodyPanel._displayNoResultsAlert).toHaveBeenCalled();
            });

            it('sets scroll position to 0', function() {
                spyOn(searchBodyPanel, '_resetScrollPositionToTop').andCallThrough();
                searchBodyPanel.body = {
                    dom: {
                        scrollTop: 123
                    }
                };

                searchBodyPanel.resultsStore.fireEvent('load');
                expect(searchBodyPanel._resetScrollPositionToTop).toHaveBeenCalled();
                expect(searchBodyPanel.body.dom.scrollTop).toBe(0);
            });
        });
    });
});

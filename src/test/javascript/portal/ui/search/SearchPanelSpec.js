/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.search.SearchPanel", function() {

    var searchPanel;
    var bottomToolbar;

    // Test set-up
    beforeEach(function() {

        searchPanel = new Portal.ui.search.SearchPanel({resultGridSize: 17});
        searchPanel.searcher = {
            goToPage: jasmine.createSpy('goToPage')
        };
        searchPanel.resultsStore = {
            startRecord: 4
        };

        bottomToolbar = searchPanel.resultsGrid.getBottomToolbar();
        spyOn(bottomToolbar, 'onLoad');
    });

    it("check layout/positioning", function() {
        expect(searchPanel.filtersPanel.region).toBe('west');
        expect(searchPanel.resultsGrid.region).toBe('center');
    });
    
    // Test helper
    function testStartAndLimit(start, limit) {

        expect(bottomToolbar.onLoad).toHaveBeenCalledWith(
            searchPanel.resultsStore,
            null,
            {params:{start: start, limit: limit}}
        );
    }

    // Tests
    it('resultStoreLoad method should pass correct values on to resultGrid.getBottomToolbar()\'s onLoad method', function() {

        // First test
        searchPanel.resultsStoreLoad();

        testStartAndLimit( 4, 17 );

        // Test with other values (to confirm not hardcoded)
        searchPanel.resultsStore.startRecord = 88;
        searchPanel.resultGridSize = 55;
        bottomToolbar.onLoad.reset(); // reset spy

        searchPanel.resultsStoreLoad();

        testStartAndLimit( 88, 55 );
    });

    it('afterRender method should pass correct values on to resultGrid.getBottomToolbar()\'s onLoad method', function() {

        // First test
        searchPanel.afterRender();

        testStartAndLimit( 1, 17 );

        // Test with other values (to confirm not hardcoded)
        searchPanel.resultsStore.startRecord = 99;
        searchPanel.resultGridSize = 66;
        bottomToolbar.onLoad.reset(); // reset spy

        searchPanel.afterRender();

        testStartAndLimit( 1, 66 );
    });

    it('resultGridBBarBeforeChange method should pass correct values on to this.searcher\'s goToPage method and set resultStore.startRecord', function() {

        expect(searchPanel.resultsStore.startRecord).toBe(4);

        searchPanel.resultsGridBbarBeforeChange( {}, { start: 13, limit: 43 } );
        expect(searchPanel.resultsStore.startRecord).toBe(13); // Params.start
        expect(searchPanel.searcher.goToPage).toHaveBeenCalledWith(14, 43); // start + 1, limit

        searchPanel.resultsGridBbarBeforeChange( {}, { start: 100, limit: 100 } );
        expect(searchPanel.resultsStore.startRecord).toBe(100); // Params.start
        expect(searchPanel.searcher.goToPage).toHaveBeenCalledWith(101, 100); // Params.start + 1, params.limit
    });

    it('resultGridSize should be passed-in to resultGrid as \'pageSize\'', function() {

        expect(searchPanel.resultsGrid.pageSize).toBe(17);

        // Test another (to ensure not hard-coded)
        searchPanel = new Portal.ui.search.SearchPanel({resultGridSize: 36});
        expect(searchPanel.resultsGrid.pageSize).toBe(36);
    });
});

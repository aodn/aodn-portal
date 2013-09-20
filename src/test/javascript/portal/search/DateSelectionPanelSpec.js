
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.DateSelectionPanel", function()
{

    var testWindow;

    var buildMockSelectionPanel = function() {

        var searcher = new Portal.service.CatalogSearcher();

        searcher.timesSearchCalled = 0;
        searcher.search = function(page, summaryOnly) {
            this.timesSearchCalled++;
        };

        var dateFilter = new Portal.search.DateSelectionPanel({
            title: "Date Filter",
            hierarchical: false,
            searcher: searcher
        });

        return dateFilter;
    };

    beforeEach(function() {
        testWindow = new Ext.Window();
    });

    afterEach(function() {
        testWindow.close();
    });

    it("has title with header css class", function() {
        var dateFilter = buildMockSelectionPanel();

        expect(dateFilter.title.contains('<span class="term-selection-panel-header">' + "Date Filter" + '</span>')).toBeTruthy();
    });

    describe("setSelectedSubTitle", function() {
        it("makes title use header-selected css class followed by subtitle", function() {
            var dateFilter = buildMockSelectionPanel();

            dateFilter.setSelectedSubTitle("sub");

            expect(dateFilter.title.contains('<span class="term-selection-panel-header-selected">' + "Date Filter" + '</span>')).toBeTruthy();

            expect(dateFilter.title.contains('sub')).toBeTruthy();

        });
    });

    describe("removeSelectedSubTitle", function() {
        it("puts the title back to normal", function() {
            var dateFilter = buildMockSelectionPanel();

            dateFilter.removeSelectedSubTitle();

            expect(dateFilter.title.contains('<span class="term-selection-panel-header">' + "Date Filter" + '</span>')).toBeTruthy();
        });
    });

    describe("onGo", function() {
        it("doesn't do catalog search if start and end are empty", function() {
            var dateFilter = buildMockSelectionPanel();

            dateFilter.dateRange.setFilterValue({fromDate:"",toDate:""});

            dateFilter.onGo();
            expect(dateFilter.searcher.timesSearchCalled).toEqual(0);
        });

        it("calls catalog search when fromDate and/or toDate are set", function() {
            var dateFilter = buildMockSelectionPanel();

            dateFilter.dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});

            dateFilter.onGo();

            expect(dateFilter.searcher.timesSearchCalled).toEqual(1);

            dateFilter.dateRange.setFilterValue({fromDate:null,toDate:Date.parseDate("2012-10-27","Y-m-d")});

            dateFilter.onGo();

            expect(dateFilter.searcher.timesSearchCalled).toEqual(2);

            dateFilter.dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:null});

            dateFilter.onGo();

            expect(dateFilter.searcher.timesSearchCalled).toEqual(3);
        });
    });
});

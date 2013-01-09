
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
        var dateFilter = new Portal.search.DateSelectionPanel({
            title: "Date Filter",
            hierarchical: false,
            fieldGroup: 'organisationNames',
            fieldName: 'orgName',
            searcher: new Portal.service.CatalogSearcher()
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
});

/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.search.SearchFiltersPanel", function() {

    var searchFiltersPanel;

    beforeEach(function() {
        searchFiltersPanel = new Portal.ui.search.SearchFiltersPanel(_mockConfig());
        spyOn(searchFiltersPanel, '_setSpinnerText');
    });

    describe('clear all', function() {
        it('calls removeAnyFilters for each filter', function() {

            var filters = [
                'parameterFilter',
                'themeFilter',
                'methodFilter',
                'locationFilter',
                'organisationFilter',
                'dateFilter',
                'geoFilter'
            ]

            for (var i = 0; i < filters.length; i++) {
                spyOnFilter(searchFiltersPanel[filters[i]]);
            }

            for (var i = 0; i < filters.length; i++) {
                testClearAllLink(searchFiltersPanel[filters[i]]);
            }
        });
    });

    function spyOnFilter(filter) {
        spyOn(filter, 'removeAnyFilters');
    }

    function testClearAllLink(filter) {
        searchFiltersPanel.clearAllLink.fireEvent('click');
        expect(filter.removeAnyFilters).toHaveBeenCalled();
    }

    function _mockConfig() {
        return {
            searcher: _mockSearcher()
        }
    }

    function _mockSearcher() {
        return {
            on: nil,
            search: nil
        }
    }

    function nil() {}
});

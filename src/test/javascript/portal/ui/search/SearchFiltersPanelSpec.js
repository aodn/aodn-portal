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

    describe('new search', function() {
        it('calls removeAnyFilters for each filter', function() {

            var filters = [
                'parameterFilter',
                'organisationFilter',
                'platformFilter',
                'dateFilter',
                'geoFilter'
            ]

            for (var i = 0; i < filters.length; i++) {
                spyOnFilter(searchFiltersPanel[filters[i]]);
            }

            for (var i = 0; i < filters.length; i++) {
                testNewSearchButton(searchFiltersPanel[filters[i]]);
            }
        });
    });

    describe('new search button display behaviour for the geo facet', function() {
        it('displays the new search button when a polygon is added', function() {
            // Ideally I want to test this by firing a 'polygonadded' event but because of timing the expectation fails
            spyOn(searchFiltersPanel.newSearchButton, 'setVisible');
            searchFiltersPanel._showNewSearchForGeoFacet();
            expect(searchFiltersPanel.newSearchButton.setVisible).toHaveBeenCalledWith(true);
        });
    });

    function spyOnFilter(filter) {
        spyOn(filter, 'removeAnyFilters');
    }

    function testNewSearchButton(filter) {
        searchFiltersPanel.newSearchButton.fireEvent('click');
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

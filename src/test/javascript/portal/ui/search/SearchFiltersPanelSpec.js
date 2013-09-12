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

    describe('clear all link display behaviour for the geo facet', function() {
        it('displays the clear all link when a polygon is added', function() {
            // Ideally I want to test this by firing a 'polygonadded' event but because of timing the expectation fails
            spyOn(searchFiltersPanel.clearAllLink, 'setVisible');
            searchFiltersPanel._showClearAllForGeoFacet();
            expect(searchFiltersPanel.clearAllLink.setVisible).toHaveBeenCalledWith(true);
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

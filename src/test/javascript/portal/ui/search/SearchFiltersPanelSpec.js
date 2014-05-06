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

    describe('default configuration', function() {
        it('expands the parameter filter', function() {
            // Parameter filter is the first element in the filter array
            expect(searchFiltersPanel.filters[0].collapsed).toEqual(false);
        });

        it('expands the platform filter', function() {
            // Platform filter is the third element in the filter array
            expect(searchFiltersPanel.filters[2].collapsed).toEqual(false);
        });
    });

    describe('searchFiltersPanel', function() {
        it('scrolls to the correct location on expand', function() {

            var scrollSpy = jasmine.createSpy("scrollTo");

            searchFiltersPanel.filters[0].el = {
                dom: {
                    parentElement: {}
                }
            };

            searchFiltersPanel._getJQueryElement = function() {return { scrollTo: scrollSpy }};
            searchFiltersPanel._onExpand(searchFiltersPanel.filters[0]);

            expect(scrollSpy).toHaveBeenCalled();
            expect(scrollSpy.mostRecentCall.args[0]).toBe(searchFiltersPanel.filters[0].el.dom);
        });
    });

    describe('step title', function() {

        it('is correct', function() {

            var expectedTitle = OpenLayers.i18n('stepHeader', { stepNumber: 1, stepDescription: OpenLayers.i18n('step1Description') });
            expect(searchFiltersPanel.title).toEqual(expectedTitle);
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
            on: noOp,
            search: noOp
        }
    }
});

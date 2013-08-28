/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterPanel", function() {

    var filterPanel;

    beforeEach(function() {

        filterPanel = new Portal.filter.FilterPanel({});
    });

    describe('responds to expected methods', function() {
        it('has a _clearFilters method', function() {
            expect(filterPanel._clearFilters).toBeDefined();
        });
    });

    describe('the clear all filters button', function() {

        it('calls the _clearFilters method', function() {

            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"label":"data_centre","type":"String","name":"data_centre","possibleValues":["ifremer","aoml","csio","kordi","jma","kma","jamstec","incois","bodc","csiro"],"layerId":1499409,"enabled":true}]' });
                }
            );

            var target = {};
            var show = jasmine.createSpy('showCallBack');
            var hide = jasmine.createSpy('hideCallBack');

            spyOn(filterPanel, 'createFilterPanel');
            spyOn(filterPanel, '_clearFilters');

            filterPanel.update(
                {
                    grailsLayerId: 1499409
                },
                show,
                hide,
                target
            );

            expect(filterPanel.createFilterPanel).toHaveBeenCalled();
            expect(show).toHaveBeenCalled();
            filterPanel.clearFiltersButton.fireEvent('click');
            expect(filterPanel._clearFilters).toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {

        var _mockFilter = function(name) {

            return {
                getFilterName: function() {

                    return name;
                },
                handleRemoveFilter: function() {}
            }
        };

        it('clears all filters', function() {

            spyOn(filterPanel, '_updateFilter');

            filterPanel._handleAddFilter(_mockFilter('oxygen_sensor'));
            filterPanel._handleAddFilter(_mockFilter('data_centre'));
            filterPanel._handleAddFilter(_mockFilter('pi'));

            expect(Object.keys(filterPanel.activeFilters).length).toBe(3);

            filterPanel._clearFilters();

            expect(Object.keys(filterPanel.activeFilters).length).toBe(0);
        });
    });

    describe('_hasAnyActiveFilters()', function() {

        it('returns false when there are not any active filters', function() {

            expect(filterPanel._hasAnyActiveFilters()).toBe(false);
        });

        it('returns true when there are active filters', function() {

            filterPanel.activeFilters['oxygen_sensor'] = "oxygen_senor = true";

            expect(filterPanel._hasAnyActiveFilters()).toBe(true);
        });
    });
});

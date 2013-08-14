/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterPanel", function() {

    var filterPanel = new Portal.filter.FilterPanel({});

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

            spyOn(filterPanel, 'createFilter');
            spyOn(filterPanel, '_clearFilters');

            filterPanel.update(
                {
                    grailsLayerId: 1499409
                },
                show,
                hide,
                target
            );

            expect(filterPanel.createFilter).toHaveBeenCalled();
            expect(show).toHaveBeenCalled();
            filterPanel.clearFiltersButton.fireEvent('click');
            expect(filterPanel._clearFilters).toHaveBeenCalled();
        });
    });
});

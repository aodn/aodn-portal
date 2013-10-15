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

    describe('_onGetFilterSuccess', function() {

        var dummyResponse;
        var fnTarget = {};
        var showFunction = function() {};

        beforeEach(function() {

            dummyResponse = {responseText: "[{}]"};

            spyOn(filterPanel, 'createFilterPanel');
            spyOn(filterPanel, '_updateAndShow');
            spyOn(filterPanel, 'isLayerActive').andReturn(true);

            filterPanel._onGetFilterSuccess(dummyResponse, {}, showFunction, noOp, {});
        });

        it('creates a filter panel', function() {

            expect(filterPanel.createFilterPanel).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterPanel._updateAndShow).toHaveBeenCalledWith(showFunction, fnTarget);
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
            spyOn(filterPanel, '_updateLayerFilters');
            spyOn(filterPanel, 'isLayerActive').andReturn(true);

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
            expect(filterPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {

        var removeFilterSpy = jasmine.createSpy('handleRemoveFilter');

        var _mockFilter = function(name) {

            return {
                handleRemoveFilter: removeFilterSpy
            }
        };

        it('clears all filters', function() {

            spyOn(filterPanel, '_getActiveFilters').andReturn([
               _mockFilter('oxygen_sensor'),
               _mockFilter('data_centre'),
               _mockFilter('pi')
            ]);

            spyOn(filterPanel, '_updateLayerFilters');

            filterPanel._clearFilters();

            expect(removeFilterSpy.callCount).toBe(3);
            expect(filterPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('_updateAndShow', function() {

        beforeEach(function() {

            spyOn(filterPanel.loadingMessage, 'hide');
            spyOn(filterPanel, '_updateLayerFilters');

            filterPanel._updateAndShow(noOp, {});
        });

        it('hides the laoding message', function() {

            expect(filterPanel.loadingMessage.hide).toHaveBeenCalled();
        });

        it('calls _updateLayerFilter', function() {

            expect(filterPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });
});

/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.FilterGroupPanel", function() {

    var filterGroupPanel;

    beforeEach(function() {

        filterGroupPanel = new Portal.filter.FilterGroupPanel({});
    });

    describe('responds to expected methods', function() {
        it('has a _clearFilters method', function() {
            expect(filterGroupPanel._clearFilters).toBeDefined();
        });
    });

    describe('_showHideFilters', function() {

        var dummyResponse;
        var fnTarget = {};
        var showFunction = function() {};
        var layer;

        beforeEach(function() {
            layer = {};
            layer.filters = "[{}]";

            spyOn(filterGroupPanel, '_createFilterPanel');
            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);

            filterGroupPanel._showHideFilters(layer, showFunction, noOp, {});
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalledWith(showFunction, fnTarget);
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

            spyOn(filterGroupPanel, '_createFilterPanel');
            spyOn(filterGroupPanel, '_clearFilters');
            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);

            filterGroupPanel.handleLayer(
                {
                    grailsLayerId: 1499409
                },
                show,
                hide,
                target
            );

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
            expect(show).toHaveBeenCalled();
            filterGroupPanel.clearFiltersButton.fireEvent('click');
            expect(filterGroupPanel._clearFilters).toHaveBeenCalled();
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
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

            spyOn(filterGroupPanel, '_getActiveFilters').andReturn([
                _mockFilter('oxygen_sensor'),
                _mockFilter('data_centre'),
                _mockFilter('pi')
            ]);

            spyOn(filterGroupPanel, '_updateLayerFilters');

            filterGroupPanel._clearFilters();

            expect(removeFilterSpy.callCount).toBe(3);
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('_updateAndShow', function() {

        beforeEach(function() {

            spyOn(filterGroupPanel.loadingMessage, 'hide');
            spyOn(filterGroupPanel, '_updateLayerFilters');

            filterGroupPanel._updateAndShow(noOp, {});
        });

        it('hides the laoding message', function() {

            expect(filterGroupPanel.loadingMessage.hide).toHaveBeenCalled();
        });

        it('calls _updateLayerFilter', function() {

            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('visualise/download cql', function() {
        describe('_getCqlFilter', function() {

            var layer;
            var filterDescriptor;

            beforeEach(function() {
                layer = {
                    getDownloadFilter: function() {
                    }
                };

                filterDescriptor = {
                    name: 'test',
                    label: 'some label',
                    type: 'Boolean'
                }
            });

            it('calls getVisualisationCQL when options.downloadOnly is false', function() {
                filterDescriptor.downloadOnly = false;
                var filterPanel = filterGroupPanel._createFilterPanel(layer, filterDescriptor);
                spyOn(filterPanel, 'getVisualisationCQL');
                spyOn(filterPanel, 'hasValue').andReturn(true);

                filterGroupPanel._getCqlFilter({ downloadOnly: false});

                expect(filterPanel.getVisualisationCQL).toHaveBeenCalled();
            });

            it('calls getDownloadCQL when options.downloadOnly is true', function() {
                filterDescriptor.downloadOnly = true;
                var filterPanel = filterGroupPanel._createFilterPanel(layer, filterDescriptor);
                spyOn(filterPanel, 'getDownloadCQL');
                spyOn(filterPanel, 'hasValue').andReturn(true);

                filterGroupPanel._getCqlFilter({ downloadOnly: true});

                expect(filterPanel.getDownloadCQL).toHaveBeenCalled();
            });
        });
    });
});

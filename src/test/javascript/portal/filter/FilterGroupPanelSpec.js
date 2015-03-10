/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.FilterGroupPanel", function() {

    var filterGroupPanel;
    var layer;
    var cfg;
    var filterPanel;
    var filters;

    beforeEach(function() {
        layer = new OpenLayers.Layer.WMS();
        layer.server = { uri: "uri" };
        layer.getDownloadLayer = function() { return "downloadLayer"; };
        layer.isKnownToThePortal = function() { return true; };

        filterGroupPanel = new Portal.filter.FilterGroupPanel({
            layer: layer
        });
    });

    describe('_filtersLoaded', function() {

        beforeEach(function() {
            layer = {
                server: {
                    uri: {}
                },
                filters: [{
                    getType: function() {
                        return Boolean;
                    }
                }]
            };

            cfg = {
                layer: layer
            };

            filterPanel = {
                needsFilterRange: function() {
                    return false;
                }
            };

            filterGroupPanel = new Portal.filter.FilterGroupPanel(cfg);

            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_filtersSort').andReturn(layer);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);

            filterGroupPanel._filtersLoaded(layer.filters);
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('sorts the filters according to sort order', function() {

            expect(filterGroupPanel._filtersSort).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalled();
        });
    });

    describe('filter sorting', function() {
        var expectedReturn;
        var filterConfigs;
        var testBooleanFilterA;
        var testDateFilter;
        var testDateRangeFilter;
        var testBooleanFilterE;
        var testBboxFilter;
        var testStringFilter;

        beforeEach(function() {
            layer = {
                server: {
                    uri: {}
                }
            };

            cfg = {
                layer: layer
            };

            filterConfigs = [
                {type: 'Boolean', label: 'A', name: 'A', visualised: true},
                {type: 'Date', label: 'B', name: 'B', visualised: true},
                {type: 'DateRange', label: 'Z', name: 'Z', visualised: true},
                {type: 'Boolean', label: 'E', name: 'E', visualised: true},
                {type: 'BoundingBox', label: 'C', name: 'C', visualised: true},
                {type: 'String', label: 'D', name: 'D', visualised: true}
            ];

            testBooleanFilterA = new Portal.filter.Filter(filterConfigs[0]);
            testDateFilter = new Portal.filter.Filter(filterConfigs[1]);
            testDateRangeFilter = new Portal.filter.Filter(filterConfigs[2]);
            testBooleanFilterE = new Portal.filter.Filter(filterConfigs[3]);
            testBboxFilter = new Portal.filter.Filter(filterConfigs[4]);
            testStringFilter = new Portal.filter.Filter(filterConfigs[5]);

            layer.filters = [
                testBooleanFilterA,
                testDateFilter,
                testDateRangeFilter,
                testBooleanFilterE,
                testBboxFilter,
                testStringFilter
            ];

            expectedReturn = [
                testBboxFilter,
                testDateFilter,
                testDateRangeFilter,
                testBooleanFilterA,
                testBooleanFilterE,
                testStringFilter
            ];

            filterGroupPanel = new Portal.filter.FilterGroupPanel(cfg);
        });

        it('sorts by specified order', function() {
            expect(filterGroupPanel._filtersSort(layer.filters)).toEqual(expectedReturn);
        });
    });

    describe('the clear all filters button', function() {

        beforeEach(function() {
            layer = {
                server: { uri: "uri" }
            };
            layer.isKnownToThePortal = function() { return true };
            filterGroupPanel._isLayerActive = function() {return true};

            filterGroupPanel = new Portal.filter.FilterGroupPanel({
                layer: layer
            });

            filters = ["Boolean"];

            filterPanel = {
                needsFilterRange: function() {
                    return false;
                }
            };

            spyOn(filterGroupPanel, '_clearFilters');
            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, 'addErrorMessage');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
            spyOn(filterGroupPanel, '_filtersSort').andReturn(layer);
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);
        });


        it('calls the _clearFilters method', function() {

            filterGroupPanel._filtersLoaded(filters);

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
            filterGroupPanel.clearFiltersButton.fireEvent('click');
            expect(filterGroupPanel._clearFilters).toHaveBeenCalled();
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('the _filtersLoaded function', function() {

        beforeEach(function() {
            layer = {
                server: { uri: "uri" }
            };
            filterGroupPanel._isLayerActive = function() {return true};

            filterGroupPanel = new Portal.filter.FilterGroupPanel({
                layer: layer
            });

            filterPanel = {
                needsFilterRange: function() {
                    return false;
                }
            };

            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, 'addErrorMessage');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
        });


        it('calls the addErrorMessage function when filters set but has no filters configured', function() {

            layer.filters = [];

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel.addErrorMessage).toHaveBeenCalled();
        });

        it('addErrorMessage function not called when filters are configured', function() {

            layer.filters = ["Boolean","Combo"];

            spyOn(filterGroupPanel, '_filtersSort').andReturn(layer);

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel.addErrorMessage).not.toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {

        var removeFilterSpy = jasmine.createSpy('handleRemoveFilter');

        var _mockFilterPanel = function(name) {

            return {
                handleRemoveFilter: removeFilterSpy
            }
        };

        it('clears all filters', function() {

            filterGroupPanel.filterPanels = [
                _mockFilterPanel('oxygen_sensor'),
                _mockFilterPanel('data_centre'),
                _mockFilterPanel('pi')
            ];

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

            filterGroupPanel._updateAndShow();
        });

        it('hides the loading message', function() {
            expect(filterGroupPanel.loadingMessage.hide).toHaveBeenCalled();
        });

        it('calls _updateLayerFilter', function() {

            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('visualise cql', function() {
        describe('_getVisualisationCQLFilters', function() {

            var filterDescriptorData;

            beforeEach(function() {

                filterDescriptorData =  {
                    name: 'test',
                    label: 'some label',
                    cql: "pardon my French",
                    type: 'Boolean',
                    visualised: true
                }

            });

            it('calls getVisualisationCQL when options.downloadOnly is false', function() {

                expect(filterGroupPanel._getVisualisationCQLFilters(filterDescriptorData)).toEqual('pardon my French');
            });

        });
    });
});

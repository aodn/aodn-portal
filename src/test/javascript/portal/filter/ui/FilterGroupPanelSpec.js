/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.FilterGroupPanel", function() {

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

        filterGroupPanel = new Portal.filter.ui.FilterGroupPanel({
            layer: layer
        });
    });

    describe('_filtersLoaded', function() {

        beforeEach(function() {
            layer = {
                server: {
                    uri: {}
                },
                filters: [
                    { /* some filter */ }
                ]
            };

            cfg = {
                layer: layer
            };

            filterPanel = {
                needsFilterRange: function() {
                    return false;
                }
            };

            filterGroupPanel = new Portal.filter.ui.FilterGroupPanel(cfg);

            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_sortPanels').andReturn([{}]);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);

            filterGroupPanel._filtersLoaded(layer.filters);
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('sorts the filters according to sort order', function() {

            expect(filterGroupPanel._sortPanels).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalled();
        });
    });

    describe('filter sorting', function() {

        it('sorts panels in expected order', function() {

            spyOn(Portal.filter.ui.BooleanFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.NumberFilterPanel.prototype, 'setLayerAndFilter');
            spyOn(Portal.filter.ui.GeometryFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.GeometryFilterPanel.prototype, 'setLayerAndFilter');
            spyOn(Portal.filter.ui.DateFilterPanel.prototype, '_createControls');

            var booleanPanelA = new Portal.filter.ui.BooleanFilterPanel({
                filter: { getLabel: function() { return 'A' } }
            });
            var booleanPanelB = new Portal.filter.ui.BooleanFilterPanel({
                filter: { getLabel: function() { return 'B' } }
            });
            var numberPanel =  new Portal.filter.ui.NumberFilterPanel();
            var geometryPanel = new Portal.filter.ui.GeometryFilterPanel({
                layer: { map: getMockMap() }
            });
            var datePanel = new Portal.filter.ui.DateFilterPanel();
            var comboPanel = new Portal.filter.ui.ComboFilterPanel();

            var panels = [
                booleanPanelB,
                comboPanel,
                datePanel,
                booleanPanelA,
                geometryPanel,
                numberPanel
            ];

            var expectedPanelOrder = [
                geometryPanel,
                datePanel,
                booleanPanelA,
                booleanPanelB,
                numberPanel,
                comboPanel
            ];

            filterGroupPanel = new Portal.filter.ui.FilterGroupPanel(cfg);

            expect(filterGroupPanel._sortPanels(panels)).toEqual(expectedPanelOrder);
        });
    });

    describe('the clear all filters button', function() {

        beforeEach(function() {
            layer = {
                server: { uri: "uri" }
            };
            layer.isKnownToThePortal = function() { return true };
            filterGroupPanel._isLayerActive = function() {return true};

            filterGroupPanel = new Portal.filter.ui.FilterGroupPanel({
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
            spyOn(filterGroupPanel, '_addErrorMessage');
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
            spyOn(filterGroupPanel, '_sortPanels').andReturn([{}]);
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

            filterGroupPanel = new Portal.filter.ui.FilterGroupPanel({
                layer: layer
            });

            filterPanel = {
                needsFilterRange: function() {
                    return false;
                }
            };

            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, '_addErrorMessage');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
        });

        it('calls the _addErrorMessage function when filters set but has no filters configured', function() {

            layer.filters = [];

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel._addErrorMessage).toHaveBeenCalled();
        });

        it('_addErrorMessage function not called when filters are configured', function() {

            layer.filters = ["Boolean", "Combo"];

            spyOn(filterGroupPanel, '_sortPanels').andReturn([{},{}]);

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel._addErrorMessage).not.toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {

        var removeFilterSpy = jasmine.createSpy('handleRemoveFilter');

        var _mockFilterPanel = function() {

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

    describe('_organiseFilterPanels', function() {

        var filterPanels;
        var numPanels;
        var numDifferentTypes = 3;
        var numHeadings = numDifferentTypes - 1; // Number filters won't have a heading
        var numVerticalSpacers = numDifferentTypes - numHeadings; // No spacer for item after heading

        beforeEach(function() {
            spyOn(Portal.filter.ui.NumberFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.DateFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.BooleanFilterPanel.prototype, '_createControls');

            filterPanels = [
                new Portal.filter.ui.DateFilterPanel(),
                new Portal.filter.ui.ComboFilterPanel(),
                new Portal.filter.ui.ComboFilterPanel(),
                new Portal.filter.ui.NumberFilterPanel(),
                new Portal.filter.ui.NumberFilterPanel()
            ];

            numPanels = filterPanels.length;

            spyOn(filterGroupPanel, '_createFilterGroupHeading').andCallThrough();
            spyOn(filterGroupPanel, '_createVerticalSpacer');
            spyOn(filterGroupPanel, 'add');

            filterGroupPanel._organiseFilterPanels(filterPanels);
        });

        it('creates groups as required', function() {

            expect(filterGroupPanel._createFilterGroupHeading.callCount).toBe(numHeadings);
            expect(filterGroupPanel._createVerticalSpacer.callCount).toBe(numVerticalSpacers);
            expect(filterGroupPanel.add.callCount).toBe(numPanels + numVerticalSpacers + numHeadings);
        });
    });
});

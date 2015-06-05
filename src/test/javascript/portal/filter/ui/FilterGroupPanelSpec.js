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
        layer.map = getMockMap();

        filterGroupPanel = new Portal.filter.ui.FilterGroupPanel({
            layer: layer
        });
    });

    describe('_filtersLoaded', function() {

        beforeEach(function() {
            layer = {
                server: {
                    uri: {}
                }
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
            spyOn(filterGroupPanel, '_sortFilters').andReturn([{}]);
            spyOn(filterGroupPanel, '_isLayerActive').andReturn(true);
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);

        });

        it('no filter panel created as filters are empty', function() {
            filterGroupPanel._filtersLoaded(layer.filters);
            expect(filterGroupPanel._createFilterPanel).not.toHaveBeenCalled();
        });

        it('sorts the filters according to sort order', function() {
            var filters = {};
            filterGroupPanel._filtersLoaded(filters);
            expect(filterGroupPanel._sortFilters).toHaveBeenCalled();
        });
    });

    describe('filter sorting', function() {

        it('sorts panels in expected order', function() {

            layer = {
                filters: [
                    {
                        constructor: Portal.filter.BooleanFilter,
                        isVisualised: function() { return true },
                        hasValue: function() { return true },
                        getLabel: function() { return "kappa" },
                        getHumanReadableForm: function() { return 'four' }
                    },
                    {
                        constructor: Portal.filter.BooleanFilter,
                        isVisualised: function() { return false },
                        hasValue: function() { return true },
                        getLabel: function() { return "gamma" },
                        getHumanReadableForm: function() { return 'two' }
                    },
                    {
                        constructor: Portal.filter.StringFilter,
                        isVisualised: function() { return true },
                        hasValue: function() { return false },
                        getLabel: function() { return "beta" },
                        getHumanReadableForm: function() { return 'three' }
                    },
                    {
                        constructor: Portal.filter.StringFilter,
                        isVisualised: function() { return true },
                        hasValue: function() { return true },
                        getLabel: function() { return "omega" },
                        getHumanReadableForm: function() { return 'five' }
                    },
                    {
                        constructor: Portal.filter.GeometryFilter,
                        isVisualised: function() { return true },
                        hasValue: function() { return true },
                        getLabel: function() { return "alpha" },
                        getHumanReadableForm: function() { return 'one' }
                    }
                ]
            };

            var expectedFilterOrder = [
                layer.filters[4],
                layer.filters[1],
                layer.filters[0],
                layer.filters[2],
                layer.filters[3]
            ];

            filterGroupPanel = new Portal.filter.ui.FilterGroupPanel(cfg);
            filterGroupPanel._sortFilters(layer.filters);

            expect(layer.filters).toEqual(expectedFilterOrder);
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
            spyOn(filterGroupPanel, '_sortFilters').andReturn([{}]);
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

            spyOn(filterGroupPanel, '_sortFilters').andReturn([{},{}]);

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel._addErrorMessage).not.toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {
        var removeFilterSpy;

        beforeEach(function() {
            removeFilterSpy = jasmine.createSpy('handleRemoveFilter');
        });

        var _mockFilterPanel = function(filterType, removeSpy) {

            return {
                handleRemoveFilter: removeSpy ? removeSpy : noOp,
                filter: {
                    type: filterType
                }
            }
        };

        it('clears all non-global filters', function() {

            filterGroupPanel.filterPanels = [
                _mockFilterPanel('datetime', removeFilterSpy),
                _mockFilterPanel('boolean', removeFilterSpy),
                _mockFilterPanel('string', removeFilterSpy)
            ];

            spyOn(filterGroupPanel, '_updateLayerFilters');

            filterGroupPanel._clearFilters();

            expect(removeFilterSpy.callCount).toBe(3);
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });


        it('does not clear the global spatial extent', function() {
            filterGroupPanel.filterPanels = [
                _mockFilterPanel('geometrypropertytype'),
                _mockFilterPanel('datetime'),
                _mockFilterPanel('boolean'),
                _mockFilterPanel('string')
            ];

            var geomFilter = filterGroupPanel.filterPanels[0];

            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(geomFilter, 'handleRemoveFilter');

            filterGroupPanel._clearFilters();

            expect(geomFilter.handleRemoveFilter).not.toHaveBeenCalled();
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
        var numHeadings = 2; // Only Date has a non default typeLabel "Date + default = 2"
        var numVerticalSpacers = 1;

        beforeEach(function() {
            spyOn(Portal.filter.ui.NumberFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.DateFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.BooleanFilterPanel.prototype, '_createControls');

            filterPanels = [
                new Portal.filter.ui.DateFilterPanel(),
                // first default heading will appear
                new Portal.filter.ui.ComboFilterPanel(),
                new Portal.filter.ui.ComboFilterPanel(),
                // spacer will appear
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

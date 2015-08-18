/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.FilterGroupPanel", function() {

    var filterGroupPanel;
    var layer;
    var filterPanel;
    var filters;

    beforeEach(function() {
        layer = new OpenLayers.Layer.WMS();
        layer.isKnownToThePortal = returns(true);
        layer.map = getMockMap();

        filterGroupPanel = new Portal.filter.ui.FilterGroupPanel({
            dataCollection: {
                getLayerState: returns({
                    getSelectedLayer: returns(layer)
                }),
                getFiltersRequestParams: noOp
            }
        });
    });

    describe('_filtersLoaded', function() {

        beforeEach(function() {
            layer = {
                filters: [
                    { /* some filter */ }
                ]
            };

            filterPanel = {
                needsFilterRange: returns(false)
            };

            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_sortFilters');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);

            filterGroupPanel._filtersLoaded(layer.filters);
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('sorts the filters according to sort order', function() {

            expect(filterGroupPanel._sortFilters).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalled();
        });
    });

    describe('filter sorting', function() {

        it('sorts panels in expected order', function() {

            layer = {
                filters: [
                    {
                        constructor: Portal.filter.BooleanFilter,
                        isVisualised: returns(true),
                        hasValue: returns(true),
                        getLabel: returns("kappa"),
                        getHumanReadableForm: returns('four')
                    },
                    {
                        constructor: Portal.filter.BooleanFilter,
                        isVisualised: returns(false),
                        hasValue: returns(true),
                        getLabel: returns("gamma"),
                        getHumanReadableForm: returns('two')
                    },
                    {
                        constructor: Portal.filter.StringFilter,
                        isVisualised: returns(true),
                        hasValue: returns(false),
                        getLabel: returns("beta"),
                        getHumanReadableForm: returns('three')
                    },
                    {
                        constructor: Portal.filter.StringFilter,
                        isVisualised: returns(true),
                        hasValue: returns(true),
                        getLabel: returns("omega"),
                        getHumanReadableForm: returns('five')
                    },
                    {
                        constructor: Portal.filter.GeometryFilter,
                        isVisualised: returns(true),
                        hasValue: returns(true),
                        getLabel: returns("alpha"),
                        getHumanReadableForm: returns('one')
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

            Portal.filter.ui.FilterGroupPanel.prototype._sortFilters(layer.filters);

            expect(layer.filters).toEqual(expectedFilterOrder);
        });
    });

    describe('the clear all filters button', function() {

        beforeEach(function() {
            filters = ["Boolean"];

            filterPanel = {
                needsFilterRange: returns(false)
            };

            spyOn(filterGroupPanel, '_clearFilters');
            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, '_addErrorMessage');
            spyOn(filterGroupPanel, '_sortFilters');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);
        });

        it('calls the _clearFilters method', function() {

            filterGroupPanel._filtersLoaded(filters);

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
            filterGroupPanel.resetLink.fireEvent('click');
            expect(filterGroupPanel._clearFilters).toHaveBeenCalled();
            expect(filterGroupPanel._updateLayerFilters).toHaveBeenCalled();
        });
    });

    describe('the _filtersLoaded function', function() {

        beforeEach(function() {
            filterPanel = {
                needsFilterRange: returns(false)
            };

            spyOn(filterGroupPanel, '_updateLayerFilters');
            spyOn(filterGroupPanel, '_addErrorMessage');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);
        });

        it('calls the _addErrorMessage function when filters set but has no filters configured', function() {

            layer.filters = [];

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel._addErrorMessage).toHaveBeenCalled();
        });

        it('_addErrorMessage function not called when filters are configured', function() {

            layer.filters = ["Boolean", "Combo"];

            spyOn(filterGroupPanel, '_sortFilters');

            filterGroupPanel._filtersLoaded(layer.filters);

            expect(filterGroupPanel._addErrorMessage).not.toHaveBeenCalled();
        });
    });

    describe('_clearFilters method', function() {
        var removeFilterSpy;
        var mockFilterPanel;

        beforeEach(function() {
            removeFilterSpy = jasmine.createSpy('handleRemoveFilter');

            mockFilterPanel = {
                handleRemoveFilter: removeFilterSpy
            };
        });

        it('clears all non-global filters', function() {

            filterGroupPanel.filterPanels = [
                mockFilterPanel,
                mockFilterPanel,
                mockFilterPanel
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
        var numHeadings = 2; // Only Date has a non default typeLabel "Date + default = 2"
        var numVerticalSpacers = 1;

        beforeEach(function() {
            spyOn(Portal.filter.ui.BooleanFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.ComboFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.DateFilterPanel.prototype, '_createControls');
            spyOn(Portal.filter.ui.NumberFilterPanel.prototype, '_createControls');

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

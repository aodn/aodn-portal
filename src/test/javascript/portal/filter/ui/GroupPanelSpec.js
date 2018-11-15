describe("Portal.filter.ui.GroupPanel", function() {

    var filterGroupPanel;
    var filterPanel;
    var filters;
    var dataCollection;

    beforeEach(function() {
        dataCollection = {
            getFilters: function() {
                return filters;
            },
            on: noOp
        };

        filterGroupPanel = new Portal.filter.ui.GroupPanel({
            dataCollection:dataCollection,
            _attachEvents: noOp,
            _filtersLoaded: noOp
        });
    });

    afterEach(function() {
        filters = undefined;
    });

    describe('the clear all filters button', function() {

        beforeEach(function() {
            filters = ["Boolean"];

            filterPanel = {
                needsFilterRange: returns(false)
            };

            spyOn(filterGroupPanel, '_clearFilters');
            spyOn(filterGroupPanel, 'showErrorMessage');
        });

        it('calls the handleRemoveFilter method', function() {

            filterGroupPanel._filtersLoaded(filters);
            filterGroupPanel._updateAndShow();
            filterGroupPanel.resetLink.fireEvent('click');
            expect(filterGroupPanel._clearFilters).toHaveBeenCalled();
        });
    });

    describe('filter sorting', function() {

        it('sorts panels in expected order', function() {

            filters = [
                {
                    constructor: Portal.filter.BooleanFilter,
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getLabel: returns("kappa"),
                    getHumanReadableForm: returns('four')
                },
                {
                    constructor: Portal.filter.DateFilter,
                    isVisualised: returns(false),
                    hasValue: returns(true),
                    getLabel: returns("gamma"),
                    getHumanReadableForm: returns('three')
                },
                {
                    constructor: Portal.filter.AlaSpeciesStringArrayFilter,
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getLabel: returns("Occurances"),
                    getHumanReadableForm: returns('two')
                },
                {
                    constructor: Portal.filter.MultiStringFilter,
                    isVisualised: returns(true),
                    hasValue: returns(false),
                    getLabel: returns("beta"),
                    getHumanReadableForm: returns('five')
                },
                {
                    constructor: Portal.filter.MultiStringFilter,
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getLabel: returns("omega"),
                    getHumanReadableForm: returns('six')
                },
                {
                    constructor: Portal.filter.GeometryFilter,
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getLabel: returns("alpha"),
                    getHumanReadableForm: returns('one')
                }
            ];

            var expectedFilterOrder = [
                filters[5],
                filters[2],
                filters[1],
                filters[0],
                filters[3],
                filters[4]
            ];

            Portal.filter.ui.FilterGroupPanel.prototype._sortFilters(filters);

            expect(filters).toEqual(expectedFilterOrder);
        });
    });

    describe('handleRemoveFilter method', function() {
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

            filterGroupPanel._clearFilters();

            expect(removeFilterSpy.callCount).toBe(3);
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

    describe('_updateAndShow', function() {

        beforeEach(function() {

            spyOn(filterGroupPanel.loadingMessage, 'hide');

            filterGroupPanel._updateAndShow();
        });

        it('hides the loading message', function() {
            expect(filterGroupPanel.loadingMessage.hide).toHaveBeenCalled();
        });
    });
});

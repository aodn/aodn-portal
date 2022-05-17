describe("Portal.search.FacetFilterPanel", function() {

    var searcher;
    var filterPanel;
    var testContainer;
    var mockSearchResponse = Portal.search.SearchSpecHelper.mockSearchResponse;
    var mockDrilldownPanel;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();

        filterPanel = new Portal.search.FacetFilterPanel({
            searcher: searcher,
            collapsedByDefault: false,
            facetName: 'Measured Parameter'
        });

        testContainer = new Portal.test.TestContainer({
            items: [filterPanel]
        });

        mockSearchResponse(searcher, {
            tagName: 'response',
            children: [{
                tagName: 'summary',
                count: 10,
                children: [{
                    tagName: 'dimension',
                    value: 'Measured Parameter',
                    count: 10,
                    children: [{
                        text: 'Salinity',
                        value: "Salinity",
                        count: 6
                    }, {
                        text: 'Pressure',
                        value: "Pressure",
                        count: 5
                    }, {
                        text: 'Temperature',
                        value: "Temperature",
                        count: 2
                    }]
                }]
            }]
        });

        spyOn(searcher, 'search').andCallFake(function() {
            searcher.fireEvent('searchcomplete');
        });
    });

    afterEach(function() {
        testContainer.destroy();
    });

    describe('drilldownChange', function() {
        it('calls search with selected drilldown', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            expect(searcher.search).toHaveBeenCalled();
            expect(searcher.filterCount()).toEqual(1);
            expect(searcher.hasDrilldown(['Measured Parameter', 'Salinity'])).toEqual(true);
        });

        it('calls search with all selected drilldowns', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel._onAdd();
            filterPanel.setSelectedDrilldown(1, ['Measured Parameter', 'Pressure']);
            expect(searcher.search).toHaveBeenCalled();
            expect(searcher.filterCount()).toEqual(2);
            expect(searcher.hasDrilldown(['Measured Parameter', 'Salinity'])).toEqual(true);
            expect(searcher.hasDrilldown(['Measured Parameter', 'Pressure'])).toEqual(true);
        });

        it('removes drilldown panel if cleared and other drilldown panels exist', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel._onAdd();
            filterPanel.clearDrilldown(0);
            var drilldownPanels = filterPanel._getDrilldownPanels();
            expect(drilldownPanels.length).toEqual(1);
            expect(drilldownPanels[0].hasNoDrilldown()).toEqual(true);
        });

        it('leaves drilldown panel if cleared and no other drilldown panels exist', function() {
            filterPanel._onAdd();
            filterPanel.clearDrilldown(0);
            var drilldownPanels = filterPanel._getDrilldownPanels();
            expect(drilldownPanels.length).toEqual(1);
            expect(drilldownPanels[0].hasNoDrilldown()).toEqual(true);
        });
    });

    describe('_addDrilldownFilters', function() {
        beforeEach(function() {
            mockDrilldownPanel = {
                hasDrilldown: returns(false),
                getDrilldownPath: returns('a shrubbery')
            };

            spyOn(filterPanel, '_getDrilldownPanels').andReturn(mockDrilldownPanel);
            spyOn(searcher, 'addDrilldownFilter');
        });

        it('does not add a filter to the catalogue searcher if the panel has no drilldown', function() {
            filterPanel._addDrilldownFilters();
            expect(searcher.addDrilldownFilter).not.toHaveBeenCalled();
        });

        it('adds a filter if the panel has a drilldown', function() {
            mockDrilldownPanel.hasDrilldown = returns(true);

            filterPanel._addDrilldownFilters();
            expect(searcher.addDrilldownFilter).toHaveBeenCalled();
        });
    });

    describe('removeAnyFilters', function() {
        it('removes drilldown filters from searcher', function() {
            spyOn(searcher, 'removeDrilldownFilters');
            filterPanel.removeAnyFilters();
            expect(searcher.removeDrilldownFilters).toHaveBeenCalled();
        });
    });

    describe('_resetPanelDefaults', function() {

        it('collapses the selection panel if collapsed by default', function() {
            filterPanel.collapsedByDefault = true;
            spyOn(filterPanel, 'collapse');
            filterPanel._resetPanelDefaults();
            expect(filterPanel.collapse).toHaveBeenCalled();
        });

        it('expands the selection panel if expanded by default', function() {
            filterPanel.collapsedByDefault = false;
            spyOn(filterPanel, 'expand');
            filterPanel._resetPanelDefaults();
            expect(filterPanel.expand).toHaveBeenCalled();
        });
    });

    describe('add button', function() {
        it('is disabled when initially displayed', function() {
            expect(filterPanel.tools.plus.disabled).toEqual(true);
        });

        it('is enabled when a drilldown is added', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            expect(filterPanel.tools.plus.disabled).toEqual(false);
        });

        it('is disabled when filters are cleared', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel.removeAnyFilters();
            expect(filterPanel.tools.plus.disabled).toEqual(true);
        });

        it('adds drilldown panel when clicked', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel._onAdd();
            expect(filterPanel._getDrilldownPanels().length).toEqual(2);
        });

        it('is disabled when drilldown panel is added', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel._onAdd();
            expect(filterPanel.tools.plus.disabled).toEqual(true);
        });

        it('is disabled when drilldown panel is removed and empty drilldown remains', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel._onAdd();
            filterPanel.clearDrilldown(0);
            expect(filterPanel.tools.plus.disabled).toEqual(true);
        });

        it('is enabled when drilldown panel is removed and no empty drilldown remains', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Salinity']);
            filterPanel._onAdd();
            filterPanel.setSelectedDrilldown(1, ['Measured Parameter', 'Pressure']);
            filterPanel.clearDrilldown(0);
            expect(filterPanel.tools.plus.disabled).toEqual(false);
        });

        it('is disabled when no drilldowns would be available', function() {
            filterPanel.setSelectedDrilldown(0, ['Measured Parameter', 'Temperature']);
            filterPanel._onAdd();
            filterPanel.setSelectedDrilldown(1, ['Measured Parameter', 'Pressure']);
            filterPanel._onAdd();
            filterPanel.setSelectedDrilldown(2, ['Measured Parameter', 'Salinity']);
            expect(filterPanel.tools.plus.disabled).toEqual(true);
        });
    });

});

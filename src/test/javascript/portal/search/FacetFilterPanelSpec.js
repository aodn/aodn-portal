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
            facetName: 'parameterCategories'
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
                    value: 'parameterCategories',
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
    });

});

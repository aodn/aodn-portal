/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.FacetFilterPanel", function() {

    var searcher;
    var filterPanel;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();

        filterPanel = new Portal.search.FacetFilterPanel({
            searcher: searcher,
            collapsedByDefault: false,
            el: {
                hasFxBlock: function() {return true;}
            },
            facetName: 'Parameter'
        });
    });

    describe('drilldownChange', function() {
        it('calls search with selected drilldown', function() {
            var drilldownPanel = filterPanel.items.first();
            var selectedDrilldownPath = 'facet/category/subcategory';
            spyOn(drilldownPanel, 'getDrilldownPath').andReturn(selectedDrilldownPath);
            spyOn(searcher, 'addDrilldownFilter');
            spyOn(searcher, 'search');
            drilldownPanel.fireEvent('drilldownchange');
            expect(searcher.addDrilldownFilter).toHaveBeenCalledWith(selectedDrilldownPath);
            expect(searcher.search).toHaveBeenCalled();
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
            expect(filterPanel.collapse).toHaveBeenCalled();;
        });

        it('expands the selection panel if expanded by default', function() {
            filterPanel.collapsedByDefault = false;
            spyOn(filterPanel, 'expand');
            filterPanel._resetPanelDefaults();
            expect(filterPanel.expand).toHaveBeenCalled();;
        });
    })
});

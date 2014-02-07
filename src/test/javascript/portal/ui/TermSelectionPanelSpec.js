
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.TermSelectionPanel", function() {

    var catalogSearcher;

    beforeEach(function() {
        catalogSearcher = new Portal.service.CatalogSearcher();
        catalogSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
    });

    it('has default separator', function() {
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: catalogSearcher
        });

        expect(selectPanel.separator).toEqual("|");
    });

    it('can override default separator', function() {
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: catalogSearcher,
            separator: "<"
        });

        expect(selectPanel.separator).toEqual("<");
    });

    it('does layout after expand', function() {
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: catalogSearcher
        });

        spyOn(selectPanel, 'doLayout');
        selectPanel._onCollapsedChange();
        expect(selectPanel.doLayout).toHaveBeenCalled();
    });

    it('disables empty panel', function() {
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: catalogSearcher
        });

        spyOn(selectPanel, 'setDisabled');
        selectPanel._loadStore('');
        expect(selectPanel.setDisabled).toHaveBeenCalledWith(true);
    });

    it('sets subtitle when filter removed but others remain', function() {
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: catalogSearcher
        });
        selectPanel.selectionStore.setFilterValue('test sub title');

        spyOn(selectPanel, 'setSelectedSubTitle');
        selectPanel._onFilterRemoved('');
        expect(selectPanel.setSelectedSubTitle).toHaveBeenCalledWith('test sub title');
    });

    it('removes all filters when removeFilters called', function() {
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: catalogSearcher,
            hierarchical: true
        });
        selectPanel.selectionStore.setFilterValue('filter1|filter2');

        expect(selectPanel.selectionStore.getCount()).toEqual(2);

        selectPanel.removeAnyFilters();
        expect(selectPanel.selectionStore.getCount()).toEqual(0);
    });
});

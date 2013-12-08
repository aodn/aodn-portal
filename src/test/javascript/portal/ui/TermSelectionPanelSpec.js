
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.TermSelectionPanel", function()
{
    it('has default separator', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher
        });

        expect(selectPanel.separator).toEqual("|");
    });

    it('can override default separator', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher,
            separator: "<"
        });

        expect(selectPanel.separator).toEqual("<");
    });

    it('does layout after expand', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher
        });

        spyOn(selectPanel, 'doLayout');
        selectPanel._onCollapsedChange();
        expect(selectPanel.doLayout).toHaveBeenCalled();
    });

    it('expands by default if parameter or platform filter', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher,
            collapsed: false
        });

        expect(selectPanel.collapsed).toEqual(false);
    });

    it('disables empty panel', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher
        });

        spyOn(selectPanel, 'setDisabled');
        selectPanel._loadStore('');
        expect(selectPanel.setDisabled).toHaveBeenCalledWith(true);
    });

    it('sets subtitle when filter removed but others remain', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher
        });
        selectPanel.selectionStore.setFilterValue('test sub title');

        spyOn(selectPanel, 'setSelectedSubTitle');
        selectPanel._onFilterRemoved('');
        expect(selectPanel.setSelectedSubTitle).toHaveBeenCalledWith('test sub title');
    });

    it('removes all filters when removeFilters called', function() {
        var mockSearcher = new Portal.service.CatalogSearcher();
        mockSearcher.addEvents( 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved' );
        var selectPanel = new Portal.ui.TermSelectionPanel({
            searcher: mockSearcher,
            hierarchical: true
        });
        selectPanel.selectionStore.setFilterValue('filter1|filter2');

        expect(selectPanel.selectionStore.getCount()).toEqual(2);

        selectPanel.removeAnyFilters();
        expect(selectPanel.selectionStore.getCount()).toEqual(0);
	
    });

});

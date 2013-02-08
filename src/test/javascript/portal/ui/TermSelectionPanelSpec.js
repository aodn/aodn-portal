
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


});
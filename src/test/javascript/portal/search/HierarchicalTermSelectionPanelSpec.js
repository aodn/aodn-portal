/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.HierarchicalTermSelectionPanel", function() {

    var searcher;
    var selectionPanel;

    beforeEach(function() {
        spyOn(Portal.search.HierarchicalTermSelectionPanel.prototype, '_onSearchComplete');

        searcher = new Portal.service.CatalogSearcher();

        selectionPanel = new Portal.search.HierarchicalTermSelectionPanel({
            searcher: searcher
        });
    });

    describe('search events', function() {

        it('searchcomplete triggers setRootNode', function() {
            searcher.fireEvent('searchcomplete');
            expect(selectionPanel._onSearchComplete).toHaveBeenCalled();
        });

    });
});

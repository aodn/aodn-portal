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
        searcher = new Portal.service.CatalogSearcher();

        selectionPanel = new Portal.search.HierarchicalTermSelectionPanel({
            searcher: searcher
        });
    });

    describe('initialisation', function() {
        it('initialises with empty node', function() {

            spyOn(Portal.search.HierarchicalTermSelectionPanel.prototype, 'setRootNode');

            selectionPanel = new Portal.search.HierarchicalTermSelectionPanel({
                searcher: searcher
            });

            expect(selectionPanel.setRootNode).toHaveBeenCalled();
        });
    });

    describe('search events', function() {
        it('search complete triggers setRootNode', function() {
            spyOn(selectionPanel, '_onSearchComplete');

            searcher.fireEvent('hiersearchcomplete');
            expect(selectionPanel._onSearchComplete).toHaveBeenCalled();
        });
    });

    describe('on search complete', function() {
        it('sets root node', function() {
            spyOn(selectionPanel, 'setRootNode');

            selectionPanel._onSearchComplete();
            expect(selectionPanel.setRootNode).toHaveBeenCalled();
        });
    });
});

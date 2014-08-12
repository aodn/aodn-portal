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
        it('initialises with summary node from searcher', function() {
            var summaryNode = {};
            spyOn(searcher, 'getSummaryNode').andReturn(summaryNode);
            spyOn(Portal.search.HierarchicalTermSelectionPanel.prototype, 'setRootNode');

            selectionPanel = new Portal.search.HierarchicalTermSelectionPanel({
                searcher: searcher
            });

            expect(selectionPanel.setRootNode).toHaveBeenCalledWith(summaryNode);
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
            var summaryNode = {};
            spyOn(selectionPanel, 'setRootNode');

            selectionPanel._onSearchComplete({}, 0, summaryNode);

            expect(selectionPanel.setRootNode).toHaveBeenCalledWith(summaryNode);
        });
    });
});

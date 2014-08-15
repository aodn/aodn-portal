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

    describe('events', function() {

        var nameHierarchy = "some/drilldown/facet";

        beforeEach(function() {
            var clickedNode = {
                toNameHierarchy: function() {
                    return nameHierarchy;
                }
            };

            spyOn(searcher, 'addDrilldownFilter');
            spyOn(searcher, 'search');

            selectionPanel.fireEvent('click', clickedNode);
        });

        it('adds drilldown filter to search on click', function() {
            expect(searcher.addDrilldownFilter).toHaveBeenCalledWith(nameHierarchy);
        });

        it('searches on click', function() {
            expect(searcher.search).toHaveBeenCalled();
        });
    });

    describe('setRootNode', function() {
        it('merges state from existing root node', function() {

            var buildTestTree = function() {

                var rootNode = new Ext.tree.TreeNode({ tagName: 'response' });
                var summaryNode = new Ext.tree.TreeNode({ tagName: 'summary' });

                var platformDimensionNode = new Ext.tree.TreeNode({
                    tagName: 'dimension',
                    name: 'Platform'
                });

                var parameterDimensionNode = new Ext.tree.TreeNode({
                    tagName: 'dimension',
                    name: 'Parameter'
                });

                rootNode.appendChild(summaryNode);
                summaryNode.appendChild([platformDimensionNode, parameterDimensionNode]);

                return rootNode;
            };

            var oldTree = buildTestTree();
            var newTree = buildTestTree();

            // Add it to a panel, with a mocked selection model, so that we can run
            // our tests.
            var treePanel = new Portal.search.HierarchicalTermSelectionPanel({
                searcher: searcher,
                root: oldTree,
                selModel: {
                    select: function(node) {
                        // console.log('selecting', node);
                        node.selected = true;
                    },
                    unselect: function(node) {
                        // console.log('unselecting', node);
                        node.selected = false;
                    },
                    isSelected: function(node) {
                        return node.selected;
                    }
                }
            });

            // Setup selected/unselected nodes.
            oldTree.findChild('name', 'Platform', true).select();
            oldTree.findChild('name', 'Parameter', true).unselect();

            // Replace root node.
            treePanel.setRootNode(newTree);

            expect(newTree.findChild('name', 'Platform', true).isSelected()).toBeTruthy();
            expect(newTree.findChild('name', 'Parameter', true).isSelected()).toBeFalsy();
        });
    });
});

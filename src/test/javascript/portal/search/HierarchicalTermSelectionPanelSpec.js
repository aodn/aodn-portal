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

        var valueHierarchy = "some/drilldown/facet";

        beforeEach(function() {
            var clickedNode = {
                toValueHierarchy: function() {
                    return valueHierarchy;
                },
                isSelected: function() {
                    return true;
                }
            };

            spyOn(searcher, 'addDrilldownFilter');
            spyOn(searcher, 'search');

            var selModel = selectionPanel.getSelectionModel();
            selModel.fireEvent('selectionchange', selModel, clickedNode);
        });

        it('adds drilldown filter to search on selection change', function() {
            expect(searcher.addDrilldownFilter).toHaveBeenCalledWith(valueHierarchy);
        });

        it('searches on selection change', function() {
            expect(searcher.search).toHaveBeenCalled();
        });
    });

    describe('setRootNode', function() {

        it('merges state from existing root node', function() {

            Ext.namespace('Ext.tree');
            Ext.tree.TreeNode.prototype.expand = function() {
                this.expanded = true;
            }
            Ext.tree.TreeNode.prototype.collapse = function() {
                this.expanded = false;
            }

            var buildTestTree = function() {

                var rootNode = new Ext.tree.TreeNode({ tagName: 'response' });
                var summaryNode = new Ext.tree.TreeNode({ tagName: 'summary' });

                var platformDimensionNode = new Ext.tree.TreeNode({
                    tagName: 'dimension',
                    value: 'Platform'
                });

                var parameterDimensionNode = new Ext.tree.TreeNode({
                    tagName: 'dimension',
                    value: 'Parameter'
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
                        node.selected = true;
                    },
                    unselect: function(node) {
                        node.selected = false;
                    },
                    isSelected: function(node) {
                        return node.selected;
                    },
                    on: noOp,
                    un: noOp
                }
            });

            // Setup selected/unselected nodes.
            oldTree.findChild('value', 'Platform', true).select();
            oldTree.findChild('value', 'Parameter', true).unselect();

            oldTree.findChild('value', 'Platform', true).collapse();
            oldTree.findChild('value', 'Parameter', true).expand();

            // Replace root node.
            treePanel.setRootNode(newTree);

            expect(newTree.findChild('value', 'Platform', true).isSelected()).toBeTruthy();
            expect(newTree.findChild('value', 'Parameter', true).isSelected()).toBeFalsy();
            expect(newTree.findChild('value', 'Platform', true).isExpanded()).toBeFalsy();
            expect(newTree.findChild('value', 'Parameter', true).isExpanded()).toBeTruthy();
        });
    });
});

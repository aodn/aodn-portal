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

    describe('search events', function() {
        it('search complete triggers setRootNode', function() {
            spyOn(selectionPanel, '_onSearchComplete');

            searcher.fireEvent('hiersearchcomplete');
            expect(selectionPanel._onSearchComplete).toHaveBeenCalled();
        });
    });

    describe('on search complete', function() {
        it('sets root node', function() {
            var dimensionNode = {};
            spyOn(selectionPanel.tree, 'setRootNode');
            searcher.getDimensionNodeByValue = function() {
                return dimensionNode;
            };

            selectionPanel._onSearchComplete();

            expect(selectionPanel.tree.setRootNode).toHaveBeenCalledWith(dimensionNode);
        });
    });

    describe('events', function() {

        var valueHierarchy = "some/drilldown/facet";

        beforeEach(function() {
            var clickedNode = {
                toValueHierarchy: function() {
                    return valueHierarchy;
                },
                hasChildNodes: function() {
                    return false;
                },
                expand: function() {
                    return true;
                },
                isSelected: function() {
                    return true;
                },
                attributes: {
                    value: "test"
                }
            };

            spyOn(searcher, 'addDrilldownFilter');
            spyOn(searcher, 'search');

            var selModel = selectionPanel.tree.getSelectionModel();
            selModel.fireEvent('selectionchange', selModel, clickedNode);
        });

        it('adds drilldown filter to search on selection change', function() {
            expect(searcher.addDrilldownFilter).toHaveBeenCalledWith(valueHierarchy);
        });

        it('searches on selection change', function() {
            expect(searcher.search).toHaveBeenCalled();
        });
    });

    describe('removeAnyFilters', function() {

        beforeEach(function() {
            selectionPanel.treeShowHide = function(){ return true;}
        });

        it('removes drilldown filters from searcher', function() {
            spyOn(searcher, 'removeDrilldownFilters');
            selectionPanel.removeAnyFilters();
            expect(searcher.removeDrilldownFilters).toHaveBeenCalled();
        });

    });

});

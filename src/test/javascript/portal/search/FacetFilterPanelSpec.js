/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.FacetFilterPanel", function() {

    var searcher;
    var selectionPanel;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();

        selectionPanel = new Portal.search.FacetFilterPanel({
            searcher: searcher,
            collapsedByDefault: false,
            el: {
                hasFxBlock: function() {return true;}
            },
            facetName: 'Parameter'
        });
    });

    describe('search events', function() {
        it('search complete triggers setRootNode', function() {
            spyOn(selectionPanel, '_onSearchComplete');

            searcher.fireEvent('searchcomplete');
            expect(selectionPanel._onSearchComplete).toHaveBeenCalled();
        });
    });

    describe('onSelectionChange', function() {

        var nodeSelected = {
            attributes: {
                value: 'Oxygen'
            },
            toValueHierarchy: function() {return true;}
        };

        it('triggers track usage', function() {
            spyOn(window, 'trackUsage');

            selectionPanel._onSelectionChange('selectionchange', nodeSelected);
            expect(window.trackUsage).toHaveBeenCalledWith(OpenLayers.i18n('facetTrackingCategory'), 'Parameter', 'Oxygen');
        });
    });

    describe('on search complete', function() {
        it('sets root node', function() {
            var dimensionNode = {
                eachNodeRecursive: function() {return true;}
            };
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
            selectionPanel.resetPanelDefaults = function(){ return true; }
        });

        it('removes drilldown filters from searcher', function() {
            spyOn(searcher, 'removeDrilldownFilters');
            selectionPanel.removeAnyFilters();
            expect(searcher.removeDrilldownFilters).toHaveBeenCalled();
        });
    });

    describe('resetPanelDefaults', function() {

        it('collapses the selection panel if collapsed by default', function() {
            spyOn(selectionPanel.tree, 'collapse');
            selectionPanel.collapsedByDefault = true;
            selectionPanel.resetPanelDefaults();
            expect(selectionPanel.tree.collapse).toHaveBeenCalled();
        });

        it('expands the selection panel if expanded by default', function() {
            spyOn(selectionPanel.tree, 'expand');
            selectionPanel.collapsedByDefault = false;
            selectionPanel.resetPanelDefaults();
            expect(selectionPanel.tree.expand).toHaveBeenCalled();
        });
    })
});

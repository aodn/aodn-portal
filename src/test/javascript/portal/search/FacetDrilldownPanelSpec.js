describe("Portal.search.FacetDrilldownPanel", function() {

    var searcher;
    var drilldownPanel;
    var testContainer;
    var mockSearchResponse = Portal.search.SearchSpecHelper.mockSearchResponse;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();

        drilldownPanel = new Portal.search.FacetDrilldownPanel({
            searcher: searcher,
            facetName: 'Measured Parameter'
        });
    });

    describe('onSelectionChange', function() {

        var nodeSelected = new Ext.tree.TreeNode();
        nodeSelected.attributes.value = 'Oxygen';

        it('triggers track usage', function() {
            spyOn(window, 'trackUsage');

            drilldownPanel._onSelectionChange('selectionchange', nodeSelected);
            expect(window.trackUsage).toHaveBeenCalledWith(OpenLayers.i18n('facetTrackingCategory'), 'Measured Parameter', 'Oxygen');
        });

        it('fires drilldownchange event', function() {
            spyOn(drilldownPanel, 'fireEvent');
            drilldownPanel._onSelectionChange('selectionchange', nodeSelected);
            expect(drilldownPanel.fireEvent).toHaveBeenCalledWith('drilldownchange', drilldownPanel);
        });

        it('sets drilldown path', function() {
            drilldownPanel._onSelectionChange('selectionchange', nodeSelected);
            expect(drilldownPanel.getDrilldownPath()).toEqual('Oxygen');
        });
    });

    describe('on search complete', function() {
        it('sets root node', function() {
            var facetNode = new Ext.tree.TreeNode('facet');
            spyOn(drilldownPanel, 'setRootNode');
            spyOn(searcher, 'hasFacetNode').andReturn(true);
            spyOn(searcher, 'getFacetNode').andReturn(facetNode);

            drilldownPanel._onSearchComplete();

            expect(drilldownPanel.setRootNode).toHaveBeenCalledWith(facetNode);
        });

        it('hides previously selected drilldowns', function() {
            searcher.addDrilldownFilter('Measured%20Parameter/Salinity');

            mockSearchResponse(searcher, {
                tagName: 'response',
                children: [{
                    tagName: 'summary',
                    count: 10,
                    children: [{
                        tagName: 'dimension',
                        value: 'Measured Parameter',
                        count: 10,
                        children: [{
                            value: 'Salinity',
                            count: 6,
                            leaf: true
                        }, {
                            value: 'Pressure',
                            count: 5,
                            leaf: true
                        }, {
                            value: 'Temperature',
                            count: 2,
                            leaf: true
                        }]
                    }]
                }]
            });

            var salinityNode = drilldownPanel.root.findChild('value', 'Salinity', true);

            expect(salinityNode.hidden).toEqual(true);
        });
    });
});

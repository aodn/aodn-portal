/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.service.CatalogSearcher', function() {

    var searcher;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher({
            baseParams: undefined
        });
    });

    describe('events', function() {
        var response;
        var options;

        beforeEach(function() {
            spyOn(searcher, 'fireEvent');
            response = {
                responseXML: {}
            };
            options = {
                page: {}
            };
        });

        it('fires searchstart on search', function() {
            searcher.search();
            expect(searcher.fireEvent).toHaveBeenCalledWith('searchstart');
        });

        it('fires searchcomplete on successful search', function() {
            var summaryNode = {};
            spyOn(searcher, 'getSummaryNode').andReturn(summaryNode);
            searcher._onSuccessfulSearch(response, options);
            expect(searcher.fireEvent).toHaveBeenCalledWith(
                'searchcomplete', response.responseXML, options.page
            );
        });
    });

    describe('search', function() {

        beforeEach(function() {
            Ext.namespace('Portal.app.appConfig.featureToggles');
            Portal.app.appConfig.featureToggles.hierarchicalFacets = true;
        });

        describe('query', function() {
            it('adds drilldown value to drilldown parameter', function() {
                searcher.addDrilldownFilter("Platform/Mooring");

                var drilldownParam = searcher._getParams()[searcher.DRILLDOWN_PARAMETER_NAME];
                expect(drilldownParam).toEqual('Platform/Mooring');
                expect(Ext.urlEncode(searcher._getParams())).toBe('facet.q=Platform%2FMooring');
            });

            it('adds multiple drilldown values to drilldown parameter', function() {
                searcher.addDrilldownFilter("Platform/Mooring");
                searcher.addDrilldownFilter("Platform/Ship/Aurora Australis");

                var drilldownParam = searcher._getParams()[searcher.DRILLDOWN_PARAMETER_NAME];
                expect(drilldownParam).toEqual(['Platform/Mooring', 'Platform/Ship/Aurora Australis']);
                expect(Ext.urlEncode(searcher._getParams())).toBe('facet.q=Platform%2FMooring&facet.q=Platform%2FShip%2FAurora%20Australis');
            });

            it('adds non drilldown value to its own parameter', function() {
                searcher.addFilter("geometry", "some_geometry", false);

                expect(searcher._getParams()['geometry']).toEqual("some_geometry");
                expect(Ext.urlEncode(searcher._getParams())).toBe('geometry=some_geometry');
            });
        });

        it('configures loader', function() {
            var url = 'http://search/url';

            spyOn(searcher, '_getRequestUrl').andReturn(url);
            spyOn(searcher, '_newSearchResponseLoader').andReturn({
                load: noOp
            });

            var proxy = function(url) {
                return "proxy: " + url;
            };

            spyOn(Ext.ux.Ajax, 'constructProxyUrl').andCallFake(proxy);

            searcher.search();

            var loaderConfig = searcher._newSearchResponseLoader.mostRecentCall.args[0];

            expect(searcher._newSearchResponseLoader).toHaveBeenCalled();
            expect(loaderConfig.url).toBe(proxy(url));
            expect(loaderConfig.listeners.load).toBe(searcher._onSuccessfulHierSearch);
            expect(loaderConfig.listeners.loadexception).toBe(searcher._logAndReturnErrors);
        });

        it('loads loader', function() {
            var loader = new Portal.ui.search.data.GeoNetworkSearchResponseLoader();
            var rootNode = new Ext.tree.TreeNode();

            spyOn(loader, 'load');
            spyOn(searcher, '_newSearchResponseLoader').andReturn(loader);
            spyOn(searcher, 'getSearchResultRootNode').andReturn(rootNode)

            searcher.search();

            expect(loader.load).toHaveBeenCalledWith(rootNode);
        });
    });

    it('finds summary node', function() {
        var rootNode = new Ext.tree.TreeNode({
            tagName: 'response'
        });

        var summaryNode = new Ext.tree.TreeNode({
            tagName: 'summary'
        })

        rootNode.appendChild(summaryNode);
        searcher.searchResultRootNode = rootNode;

        expect(searcher.getSummaryNode()).toBe(summaryNode);
    });
});

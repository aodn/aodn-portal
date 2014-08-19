/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.service.CatalogSearcher', function() {

    var searcher;

    beforeEach(function() {
        searcher = new Portal.service.CatalogSearcher();
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

            spyOn(loader, 'load');
            spyOn(searcher, '_newSearchResponseLoader').andReturn(loader);

            searcher.search();

            expect(loader.load).toHaveBeenCalled();
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

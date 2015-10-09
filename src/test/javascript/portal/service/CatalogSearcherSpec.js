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
            var page = {};
            searcher._onSuccessfulSearch(page, null, null, response);
            expect(searcher.fireEvent).toHaveBeenCalledWith(
                'searchcomplete', response.responseXML, page
            );
        });
    });

    describe('getDeepestFacets', function() {

        it('already deepest facets', function() {
            var facets = [ "facet1/facet2", "facet3/facet4" ];
            expect(searcher.getDeepestFacets(facets)).toEqual([ "facet1/facet2", "facet3/facet4" ]);
        });

        it('filter shallower facets', function() {
            var facets = [ "facet1/facet2", "facet1", "facet3", "facet3/facet4" ];
            expect(searcher.getDeepestFacets(facets)).toEqual([ "facet1/facet2", "facet3/facet4" ]);
        });

        it('filter shallower facets unsorted real values', function() {
            var facets = [
                "Measured%20parameter/Chemical",
                "Measured%20parameter/Chemical/Nitrate%20concentration/Concentration%20of%20nitrate%20%7BNO3%7D%20per%20unit%20mass%20of%20the%20water%20body",
                "Measured%20parameter/Chemical/Nitrate%20concentration",
                "Platform",
                "Platform/Ships/self-propelled%20boat",
                "Platform/Ships"
            ];
            expect(searcher.getDeepestFacets(facets)).toEqual([
                "Measured%20parameter/Chemical/Nitrate%20concentration/Concentration%20of%20nitrate%20%7BNO3%7D%20per%20unit%20mass%20of%20the%20water%20body",
                "Platform/Ships/self-propelled%20boat"
            ]);
        });
    });

    describe('extra search filters', function() {
        it('when health=good passed', function() {
            var url = "http://imos.aodn.org.au/aodn-portal/home?health=good";
            expect(searcher._getCollectionAvailabilityParams(url)).toEqual({ filters: 'collectionavailability'});
        });

        it('when health=bad passed', function() {
            var url = "http://imos.aodn.org.au/aodn-portal/home?health=bad";
            expect(searcher._getCollectionAvailabilityParams(url)).toEqual({ filters: '!collectionavailability'});
        });

        it('when nothing passed', function() {
            var url = "http://imos.aodn.org.au/aodn-portal/home";
            expect(searcher._getCollectionAvailabilityParams(url)).toEqual({});
        });

        it('when nothing passed and feature toggle is on/off', function() {
            var url = "http://imos.aodn.org.au/aodn-portal/home";

            Portal.app.appConfig.featureToggles.geonetworkLinkMonitor = true;
            expect(searcher._getCollectionAvailabilityParams(url)).toEqual({ filters: 'collectionavailability'});

            Portal.app.appConfig.featureToggles.geonetworkLinkMonitor = false;
            expect(searcher._getCollectionAvailabilityParams(url)).toEqual({});
        });

        it('when health=all passed', function() {
            var url = "http://imos.aodn.org.au/aodn-portal/home?health=all";
            expect(searcher._getCollectionAvailabilityParams(url)).toEqual({});
        });
    });

    describe('search', function() {
        beforeEach(function() {
            searcher._getCollectionAvailabilityParams = function() { return {}; }
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

            var page = {from: 1, to: 10};
            searcher._search(page);

            var loaderConfig = searcher._newSearchResponseLoader.mostRecentCall.args[0];

            expect(searcher._newSearchResponseLoader).toHaveBeenCalled();
            expect(loaderConfig.url).toBe(proxy(url));
            expect(loaderConfig.listeners.loadexception).toBe(searcher._logAndReturnErrors);

            // Can't really compare a function.bind() request, so compare the
            // string output of the two functions
            expect(''+loaderConfig.listeners.load).toEqual(''+searcher._onSuccessfulSearch.bind(searcher, page));
        });

        it('loads loader', function() {
            var loader = new Portal.ui.search.data.MetadataSearchResponseLoader();

            spyOn(loader, 'load');
            spyOn(searcher, '_newSearchResponseLoader').andReturn(loader);

            searcher.search();

            expect(loader.load).toHaveBeenCalled();
        });
    });
});

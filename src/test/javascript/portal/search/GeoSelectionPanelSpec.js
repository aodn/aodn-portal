/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.GeoSelectionPanel", function() {

    beforeEach(function() {
        Portal.app.config.initialBbox = '1, 2, 3, 4';  // So that mini-map doesn't get upset.
    });
    
    describe("onSearch", function() {

        var geoFilter;
        var searcher;
            
        beforeEach(function() {
            searcher = new Portal.service.CatalogSearcher();
            geoFilter = new Portal.search.GeoSelectionPanel({
                title: "Geo Filter",
                hierarchical: false,
                searcher: searcher
            });
        });
        
        it("doesn't do catalog search if no feature is specified", function() {

            spyOn(geoFilter.facetMap, 'hasCurrentFeature').andReturn(false);
            spyOn(searcher, 'search');
            
            geoFilter.onSearch();

            expect(searcher.search.callCount).toEqual(0);
        });

        it("calls search when polygon vector is set", function() {

            spyOn(geoFilter.facetMap, 'hasCurrentFeature').andReturn(true);
            spyOn(searcher, 'search');
            geoFilter.onSearch();
            expect(searcher.search.callCount).toEqual(1);
        });

        it("search parameters", function() {

            spyOn(geoFilter.facetMap, 'hasCurrentFeature').andReturn(true);
            spyOn(geoFilter.facetMap, 'getBoundingPolygonAsWKT').andCallFake(function() {
                return 'POLYGON((1 2,3 4,5 6,1 2))'
            });

            spyOn(searcher, 'search').andCallFake(function() {
                var boundingPolygonIndex = searcher.searchFilters.find('name', 'boundingPolygon');
                expect(boundingPolygonIndex).toNotBe(-1);
                expect(searcher.searchFilters.getAt(boundingPolygonIndex)).toNotBe(undefined);
                expect(searcher.searchFilters.getAt(boundingPolygonIndex).get('value')).toBe('POLYGON((1 2,3 4,5 6,1 2))');
            });

            geoFilter.onSearch();
        });
    });
});

/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.GeoSelectionPanel", function() {

    var geoFilter;
    var searcher;

    beforeEach(function() {
        Portal.app.config.initialBbox = '1, 2, 3, 4';  // So that mini-map doesn't get upset.
        searcher = new Portal.service.CatalogSearcher();
        geoFilter = new Portal.search.GeoSelectionPanel({
            title: "Geo Filter",
            hierarchical: false,
            searcher: searcher
        });
    });
    
    describe("onGo", function() {

        it("expects the geometry field to be called geometry", function() {
            expect(geoFilter.GEOMETRY_FIELD).toEqual('geometry');
        });

        
        it("does do a catalog search if no feature is specified", function() {

            spyOn(geoFilter.facetMap, 'hasCurrentFeature').andReturn(false);
            spyOn(searcher, 'search');
            
            geoFilter.onGo();

            expect(searcher.search).toHaveBeenCalled();
        });

        it("calls search when polygon vector is set", function() {

            spyOn(geoFilter.facetMap, 'hasCurrentFeature').andReturn(true);
            spyOn(searcher, 'search');
            geoFilter.onGo();
            expect(searcher.search.callCount).toEqual(1);
        });

        it("search parameters", function() {

            spyOn(geoFilter.facetMap, 'hasCurrentFeature').andReturn(true);
            spyOn(geoFilter.facetMap, 'getBoundingPolygonAsWKT').andCallFake(function() {
                return 'POLYGON((1 2,3 4,5 6,1 2))'
            });

            spyOn(searcher, 'search').andCallFake(function() {
                var boundingPolygonIndex = searcher.searchFilters.find('name', geoFilter.GEOMETRY_FIELD);
                expect(boundingPolygonIndex).toNotBe(-1);
                expect(searcher.searchFilters.getAt(boundingPolygonIndex)).toNotBe(undefined);
                expect(searcher.searchFilters.getAt(boundingPolygonIndex).get('value')).toBe('POLYGON((1 2,3 4,5 6,1 2))');
            });

            geoFilter.onGo();
        });
    });

    describe('removeAnyFilters', function() {
        it('it clears filters from the searcher', function() {
            spyOn(searcher, 'removeFilters');
            geoFilter.removeAnyFilters();
            expect(searcher.removeFilters).toHaveBeenCalled();
        });

        it('removes the geometry from facet map', function() {
            spyOn(geoFilter.facetMap, 'clearGeometry');
            geoFilter.removeAnyFilters();
            expect(geoFilter.facetMap.clearGeometry).toHaveBeenCalled();
        });

        it('collapses the geo facet', function() {
            spyOn(geoFilter, 'collapse');
            geoFilter.removeAnyFilters();
            expect(geoFilter.collapse).toHaveBeenCalled();
        });
    });
});

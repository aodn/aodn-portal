describe("Portal.filter.combiner.SpatialSubsetIntersectTester", function() {

    var ncWmsCollection;

    beforeEach(function() {

        ncWmsCollection = {
            getBounds:  returns(new OpenLayers.Bounds(175,0,179.9,10)),
            getFilters: returns([

                {
                    isVisualised: returns(false),
                    hasValue: returns(true),
                    getCql: returns('cql2'),
                    name: "ncwmsDateParamsFilter",
                    isNcwmsParams: true,
                    latitudeRangeStart: -30,
                    longitudeRangeStart: 10,
                    latitudeRangeEnd: -20,
                    longitudeRangeEnd: 20
                }
            ])
        }
    });

    describe('test ncWmsCollection', function() {

        it('wont pass testSpatialSubsetIntersect', function() {

            var tester = new Portal.filter.combiner.SpatialSubsetIntersectTester();
            expect(tester.testSpatialSubsetIntersect(ncWmsCollection)).toEqual(false);
        });

        it('will pass testSpatialSubsetIntersect', function() {

            ncWmsCollection.getBounds = returns(new OpenLayers.Bounds(15,-25,16,-24));

            var tester = new Portal.filter.combiner.SpatialSubsetIntersectTester();
            expect(tester.testSpatialSubsetIntersect(ncWmsCollection)).toEqual(true);
        });
    });
});

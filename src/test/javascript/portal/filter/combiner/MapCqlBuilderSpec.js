describe("Portal.filter.combiner.MapCqlBuilder", function() {

    var builder;

    beforeEach(function() {

        var filters = [
            {
                constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                isVisualised: returns(true),
                hasValue: returns(true),
                getCql: returns('cql1')
            },
            {
                isVisualised: returns(false), // Not visualised
                hasValue: returns(true),
                getCql: returns('cql2')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(false), // No value
                getCql: returns('cql3')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(true),
                getCql: returns('cql4')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(true),
                getCql: returns('cql5')
            }
        ];

        builder = new Portal.filter.combiner.MapCqlBuilder({
            filters: filters
        });
    });

    describe('buildCql', function() {

        it('returns correct CQL', function() {

            expect(builder.buildCql()).toBe('cql4 AND cql5');
        });
    });
});

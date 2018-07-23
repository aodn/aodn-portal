describe("Portal.filter.combiner.MapCqlBuilder", function() {

    var builder;

    beforeEach(function() {

        var filters = [
            {
                constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                isVisualised: returns(true),
                hasValue: returns(true),
                getFormattedFilterValue: returns('cql1')
            },
            {
                isVisualised: returns(false), // Not visualised
                hasValue: returns(true),
                getFormattedFilterValue: returns('cql2')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(false), // No value
                getFormattedFilterValue: returns('cql3')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(true),
                getFormattedFilterValue: returns('cql4')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(true),
                getFormattedFilterValue: returns('cql5')
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

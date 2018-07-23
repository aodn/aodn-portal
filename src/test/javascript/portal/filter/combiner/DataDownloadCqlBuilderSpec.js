describe("Portal.filter.combiner.DataDownloadCqlBuilder", function() {

    var builder;

    beforeEach(function() {

        var filters =[
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
            }
        ];

        builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
            filters: filters
        });
    });

    describe('buildCql', function() {

        it('returns correct CQL', function() {

            expect(builder.buildCql()).toBe('cql1 AND cql2 AND cql4');
        });
    });
});

describe("Portal.filter.combiner.HumanReadableFilterDescriber", function() {

    var describer;

    beforeEach(function() {

        var filters = [
            {
                constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                isVisualised: returns(true),
                hasValue: returns(true),
                getHumanReadableForm: returns('one')
            },
            {
                isVisualised: returns(false), // Not visualised
                hasValue: returns(true),
                getHumanReadableForm: returns('two')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(false), // No value
                getHumanReadableForm: returns('three')
            },
            {
                isVisualised: returns(true),
                hasValue: returns(true),
                getHumanReadableForm: returns('four')
            }
        ];

        describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            filters: filters
        });
    });

    describe('buildDescription', function() {

        it('returns description', function() {

            expect(describer.buildDescription('<br />')).toBe('one<br />two<br />four');
        });
    });
});

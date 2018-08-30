describe("Portal.filter.combiner.AlaParametersBuilder", function() {

    var builder;

    beforeEach(function() {
        builder = new Portal.filter.combiner.AlaParametersBuilder();
    });

    describe('buildParameterString', function() {

        it('returns a composite dateTime parameter in ALA format', function() {
            spyOn(builder, 'buildParameters').andReturn({
                Q: 'thisisanepiccombooflettersandnumbers',
                fromDate: '2015-10-06T00:00:00.000Z',
                toDate: '2018-07-31T23:59:59.999Z'

            });
            expect(builder.buildParameterString()).toEqual('&Q=thisisanepiccombooflettersandnumbers&fq=occurrence_date%3A%5B2015-10-06T00%3A00%3A00.000Z%20TO%202018-07-31T23%3A59%3A59.999Z%5D');
        });
    });

    describe('expandDateTimeParameters', function() {

        it('returns a composite dateTime parameter in ALA format', function() {
            spyOn(builder, 'buildParameters').andReturn({
                Q: 'thisisanepiccombooflettersandnumbers',
                fromDate: '2015-10-06T00:00:00.000Z',
                toDate: '2018-07-31T23:59:59.999Z'

            });
            var filters = builder.buildParameters();
            expect(builder.expandDateTimeParameters(filters)).toEqual({
                Q: 'thisisanepiccombooflettersandnumbers',
                fq: 'occurrence_date:[2015-10-06T00:00:00.000Z TO 2018-07-31T23:59:59.999Z]'
            });
        });
    });
});

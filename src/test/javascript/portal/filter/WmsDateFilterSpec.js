
describe("Portal.filter.WmsDateFilter", function() {

    var filter;
    var exampleToDate = '2006-06-06T01:00:00Z';

    beforeEach(function() {

        filter = new Portal.filter.WmsDateFilter({
            primaryFilter: true
        });

        filter._getToDate = returns(exampleToDate);

    });

    describe('_getEndOfToDate', function() {

        it('gives date with 24 hours added', function() {

            expect(filter._getEndOfToDate().toISOString()).toBe("2006-06-07T01:00:00.000Z");
        });
    });
});

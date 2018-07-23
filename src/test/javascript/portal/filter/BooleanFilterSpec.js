describe("Portal.filter.BooleanFilter", function() {

    var filter;

    beforeEach(function() {

        filter = new Portal.filter.BooleanFilter({
            name: 'column_name',
            label: 'The thing',
            value: true
        });
    });

    describe('getFormattedFilterValue', function() {

        it('returns correct cql', function() {

            expect(filter.getFormattedFilterValue()).toBe('column_name = true');
        });
    });

    describe('getHumanReadableForm', function() {

        it('returns correct description', function() {

            expect(filter.getHumanReadableForm()).toBe('The thing: true');
        });
    });
});

describe("Portal.filter.StringFilter", function() {

    var filter;

    beforeEach(function() {

        filter = new Portal.filter.StringFilter({
            name: 'column_name',
            label: 'Boat name',
            value: "L'astrolabe"
        });
    });

    describe('getCql', function() {

        it('returns correct cql', function() {

            expect(filter.getCql()).toBe("column_name LIKE 'L''astrolabe'");
        });
    });

    describe('getHumanReadableForm', function() {

        it('returns correct description', function() {

            expect(filter.getHumanReadableForm()).toBe("Boat name: L'astrolabe");
        });
    });
});

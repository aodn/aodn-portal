describe("Portal.utils.TimeUtil", function() {
    it('returns date formatted in iso8601 format at UTC', function() {
        var tu = new Portal.utils.TimeUtil();
        var testDate = new Date('2013/3/26');

        var formattedDate = tu.toUtcIso8601DateString(testDate);

        expect(formattedDate).toEqual('2013-03-26T00:00:00Z');
    });
});

describe("Portal.utils.Date", function() {
    it('gets UTC date from local date', function() {
        var localDate = new Date('2013/3/26');

        var utcDate = Portal.utils.Date.getUtcDateFromLocalDate(localDate);

        expect(utcDate).toEqual(moment('2013-03-26T00:00:00Z').toDate());
    });
});

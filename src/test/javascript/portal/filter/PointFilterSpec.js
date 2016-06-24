describe("Portal.filter.PointFilter", function() {

    describe('hasValue', function() {
        it('returns true when has a value ', function() {
            var filter = new Portal.filter.PointFilter({
                value: {
                    longitude: 32.645,
                    latitude: 21.212
                }
            });
            expect(filter.hasValue()).toBe(true);
        });

        it('returns false when has no value ', function() {
            var filter = new Portal.filter.PointFilter({
                value: {}
            });
            expect(filter.hasValue()).toBe(false);
        });
    });

});


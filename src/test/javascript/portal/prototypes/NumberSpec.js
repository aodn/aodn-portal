describe('Number', function() {

    describe('formats', function() {
        describe('toDecimalString', function() {
            it('returns an decimal for an integer', function() {
                expect((10).toDecimalString()).toEqual('10.0');
            });
            it('returns the decimal for a decimal', function() {
                expect((10.05).toDecimalString()).toEqual('10.05');
            });
        });
    });
});

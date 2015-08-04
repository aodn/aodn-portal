

describe('Moment', function() {

    describe('formats', function() {
        describe('toUtcDisplayFormat', function() {
            it('returns a moment formatted to a UTC like display string', function() {
                expect(moment.utc('2014-01-01T12:00:00.000').toUtcDisplayFormat()).toEqual('2014-01-01 12:00:00:000 UTC');
            });
        });
    });
});

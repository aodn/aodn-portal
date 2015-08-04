describe("Portal.utils.StopWatch", function() {
    it('calculates elapsed time in ms on stop', function() {
        var sw = new Portal.utils.StopWatch();

        sw._now = returns(moment('2020-01-01T00:00:00.000'));
        sw.start();

        sw._now = returns(moment('2020-01-01T00:00:12.000'));
        sw.stop();

        expect(sw.getElapsedMillis()).toEqual(12000);
    });
});

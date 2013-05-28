/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Timer", function() {

    var timer;

    describe("construction", function() {
        it("construct with strings", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-03-16T12:34:56'
            });

            expect(timer.getStartDateTime()).toBeSame(moment('2013-03-06T12:34:56'));
            expect(timer.getEndDateTime()).toBeSame(moment('2013-03-16T12:34:56'));
        });

        it("construct with moments", function() {
            timer = new OpenLayers.Timer({
                startDateTime: moment('2013-03-06T12:34:56'),
                endDateTime: '2013-03-16T12:34:56'
            });
            
            expect(timer.getStartDateTime()).toBeSame(moment('2013-03-06T12:34:56'));
            expect(timer.getEndDateTime()).toBeSame(moment('2013-03-16T12:34:56'));
        });

        it("default ticks", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-03-16T12:34:56'
            });

            expect(timer.getNumTicks()).toBe(10);
        });

        it("override ticks", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43',
                numTicks: 12
            });

            expect(timer.getNumTicks()).toBe(12);
        });

        it ("default tick interval", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43'
            });

            expect(timer.tickInterval.asMilliseconds()).toBe(500);
        });

        it("override tick interval", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43',
                tickInterval: 123
            });
            
            expect(timer.tickInterval.asMilliseconds()).toBe(123);
        });

        it("get duration", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T14:00:00'
            });

            expect(timer.getDuration().hours()).toBe(2);
        });
    });

    describe("tick index manipulation", function() {
        var numTicks = 10;
        beforeEach(function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00'
            });
        });

        it("curr tick index", function() {
            expect(timer.getCurrTickIndex()).toBe(0);
        });

        it("tick forward", function() {
            expect(timer.getCurrTickIndex()).toBe(0);
            timer.tickForward();
            expect(timer.getCurrTickIndex()).toBe(1);
        });

        // wrap
        it("tick forward wraps", function() {
            timer.currTickIndex = numTicks - 1;
            expect(timer.getCurrTickIndex()).toBe(numTicks - 1);
            timer.tickForward();
            expect(timer.getCurrTickIndex()).toBe(0);
            
        });

        // prev tick
        it("tick backward", function() {
            timer.currTickIndex = 1;
            expect(timer.getCurrTickIndex()).toBe(1);
            timer.tickBackward();
            expect(timer.getCurrTickIndex()).toBe(0);
            
        });

        it("tick backward wraps", function() {
            timer.currTickIndex = 0;
            expect(timer.getCurrTickIndex()).toBe(0);
            timer.tickBackward();
            expect(timer.getCurrTickIndex()).toBe(numTicks - 1);
        });
    });

    describe("tick date/time generation", function() {
        // choosing 5 makes it a bit easier to do the calcs.
        var numTicks = 5;
        
        beforeEach(function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00',
                numTicks: numTicks
            });
        });

        it("first date/time", function() {
            expect(timer.getTickDateTime(0)).toBeSame(moment('2013-03-06T12:00:00'));
        });
        
        it("end date/time", function() {
            expect(timer.getTickDateTime(numTicks - 1)).toBeSame(moment('2013-03-06T13:00:00'));
        });

        it("all tick date/times", function() {
            expect(timer.getTickDateTime(0)).toBeSame(moment('2013-03-06T12:00:00'));
            expect(timer.getTickDateTime(1)).toBeSame(moment('2013-03-06T12:15:00'));
            expect(timer.getTickDateTime(2)).toBeSame(moment('2013-03-06T12:30:00'));
            expect(timer.getTickDateTime(3)).toBeSame(moment('2013-03-06T12:45:00'));
            expect(timer.getTickDateTime(4)).toBeSame(moment('2013-03-06T13:00:00'));
        });
    });

    describe("timer observer", function() {

        beforeEach(function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00'
            });
        });

        it("on tick forward", function() {

            var tickObserverCalled = false;
            timer.on('tick', function(event) {
                tickObserverCalled = true;
            });

            timer.tickForward();
            expect(tickObserverCalled).toBe(true);
        });

        it("on tick backward", function() {

            var tickObserverCalled = false;
            timer.on('tick', function(event) {
                tickObserverCalled = true;
            });

            timer.tickBackward();
            expect(tickObserverCalled).toBe(true);
        });

        it("un tick", function() {

            var tickObserverCalled = false;
            timer.on('tick', function(event) {
                tickObserverCalled = true;
            });

            // Just check that we're being notified properly...
            timer.tickForward();
            expect(tickObserverCalled).toBe(true);

            // ... now "un-observe".
            tickObserverCalled = false;
            timer.on('tick', undefined);
            timer.tickForward();
            expect(tickObserverCalled).toBe(false);
        });
    });

    describe("tick events", function() {

        it("tick date/times", function() {

            var numTicksToListenFor = 4;

            // Use a local timer, otherwise this test and the next interfere with each other.
            var timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00',
                numTicks: 3
            });
            
            var numTicksSoFar = 0;
            var expectedDateTimes = [
                '2013-03-06T12:00:00', '2013-03-06T12:30:00', '2013-03-06T13:00:00', '2013-03-06T12:00:00'];

            // TODO: refactor this fragment (it's used below, the only thing that's different is the
            // expectation).
            timer.on('tick', function(tick) {
                var expectedUnixTime = moment(expectedDateTimes[numTicksSoFar]).valueOf();
                var actualUnixTime = tick.dateTime.valueOf();
                console.log("comparing actual/expected", actualUnixTime, expectedUnixTime);
                expect(actualUnixTime).toEqual(expectedUnixTime);
                
                numTicksSoFar++;

                if (numTicksSoFar == numTicksToListenFor) {
                    timer.stop();
                }
            });
            
            timer.start();
        });

        it("tick elapsed duration", function() {

            var numTicksToListenFor = 20;

            var timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00',
                numTicks: 3
            });

            var tickIntervalMs = timer.tickInterval.asMilliseconds();
            var numTicksSoFar = 0;
            var referenceDateTime = moment().subtract(tickIntervalMs);
            var tolerance = 1;
            
            timer.on('tick', function(tick) {

                var now = moment();
                var actualElapsedDateTime = now.diff(referenceDateTime);

                console.log("expected", tickIntervalMs, "actual", actualElapsedDateTime);
                
                expect(Math.abs(actualElapsedDateTime - tickIntervalMs) < tolerance * tickIntervalMs).toBeTruthy();

                referenceDateTime = now;
                numTicksSoFar++;

                if (numTicksSoFar == numTicksToListenFor) {
                    timer.stop();
                }
            });
            
            timer.start();
        });
    });
});

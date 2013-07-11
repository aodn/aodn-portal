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

        it('construct with arbitrary date/time array', function() {
            timer = new OpenLayers.Timer({
                tickDateTimes: [
                    '2013-01-01T00:00',
                    '2013-01-02T00:00',
                    '2013-01-03T00:00'
                ]
            });

            expect(timer.getStartDateTime()).toBeSame('2013-01-01T00:00');
            expect(timer.getEndDateTime()).toBeSame('2013-01-03T00:00');
            expect(timer.getNumTicks()).toBe(3);
        });

        it('construct with no date/time restrictions', function() {
            timer = new OpenLayers.Timer();
            
            expect(timer.getStartDateTime()).toBeUndefined();
            expect(timer.getEndDateTime()).toBeUndefined();
            expect(timer.getNumTicks()).toBeUndefined();
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

    describe('set tick date/times', function() {
        var firstTickDateTime;
        var lastTickDateTime;
        var tickDateTimes;
        
        beforeEach(function() {
            firstTickDateTime = moment('2013-03-06T12:00:00');
            lastTickDateTime = moment('2013-03-06T13:00:00');
            tickDateTimes = [
                firstTickDateTime,
                moment('2013-03-06T12:15:00'),
                moment('2013-03-06T12:30:00'),
                lastTickDateTime
            ];
            
            timer.setTickDateTimes(tickDateTimes);
        });

        describe('setTickDateTimes', function() {
            it('setTickDateTimes', function() {
                expect(timer.tickDateTimes).toBeSame(tickDateTimes);
            });

            it('getTickDateTimeMin value', function() {
                expect(timer.getTickDateTimeMin()).toBeSame(firstTickDateTime);
            });
            
            it('getTickDateTimeMin is copy', function() {
                expect(timer.getTickDateTimeMin()).not.toBe(firstTickDateTime);
            });

            it('getTickDateTimeMax value', function() {
                expect(timer.getTickDateTimeMax()).toBeSame(lastTickDateTime);
            });
            
            it('getTickDateTimeMax is copy', function() {
                expect(timer.getTickDateTimeMax()).not.toBe(lastTickDateTime);
            });
        });
    });
    
    describe("timer observer", function() {

        beforeEach(function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00'
            });
        });

        it('on tick context', function() {
            var expectedContext = {};
            var actualContext;

            timer.on('tick', function(event) {
                actualContext = this;
            }, expectedContext);
            timer.onTick(0);

            expect(actualContext).toBe(expectedContext);
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

        var startTime;
        var callbackTime;
        var onTickCallback;

        beforeEach(function() {
            jasmine.Clock.useMock();
            jasmine.Clock.reset();
            
            this.addMatchers({
                toHaveBeenCalledWithSame: function(expected) {
                    return (this.actual.argsForCall[this.actual.callCount - 1][0].index == expected.index)
                        && this.actual.argsForCall[this.actual.callCount - 1][0].dateTime.isSame(expected.dateTime);
                }
            });
            
            // Use a local timer, otherwise this test and the next interfere with each other.
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T12:30:00',
                numTicks: 2
            });

            startTime = jasmine.Clock.defaultFakeTimer.nowMillis;
            onTickCallback = jasmine.createSpy('onTickCallback').andCallFake(function() {
                callbackTime = jasmine.Clock.defaultFakeTimer.nowMillis;
            });

            timer.on('tick', onTickCallback, this);
        });

        it('tick date/times', function() {
            var expectedDateTimes = [
                '2013-03-06T12:00:00', '2013-03-06T12:30:00'];

            // 0ms elasped
            timer.on('tick', onTickCallback, this);
            expect(onTickCallback).not.toHaveBeenCalled();

            timer.start();
            expect(onTickCallback).toHaveBeenCalledWith({
                index: 0,
                dateTime: moment(expectedDateTimes[0])
            });
            
            jasmine.Clock.tick(499);
            // 499ms elapsed
            expect(onTickCallback.callCount).toEqual(1);
            
            jasmine.Clock.tick(1);
            // 500ms elapsed
            expect(onTickCallback).toHaveBeenCalledWithSame({
                index: 1,
                dateTime: moment(expectedDateTimes[1])
            });
            expect(onTickCallback.callCount).toEqual(2);

            jasmine.Clock.tick(499);
            // 999ms elapsed
            expect(onTickCallback.callCount).toEqual(2);

            jasmine.Clock.tick(1);
            // 1000ms elapsed
            expect(onTickCallback).toHaveBeenCalledWithSame({
                index: 0,
                dateTime: moment(expectedDateTimes[0])
            });
            expect(onTickCallback.callCount).toEqual(3);
        });

        it('tick elapsed duration', function() {
            timer.start();
            expect(callbackTime).toBe(startTime);

            jasmine.Clock.tick(500);
            expect(callbackTime).toBe(startTime + 500);
        });

        it('doubleFrequency causes interval to halve', function() {
            var origIntervalMs = timer.tickInterval.asMilliseconds();
            timer.doubleFrequency();
            expect(timer.tickInterval.asMilliseconds()).toBe(origIntervalMs / 2);
        });

        it('double frequency causes onTick call back to be called at twice the frequency', function() {
            // 0ms
            timer.start();
            expect(callbackTime).toBe(0);
            expect(onTickCallback.callCount).toBe(1);

            // 250ms
            jasmine.Clock.tick(250);
            expect(callbackTime).toBe(0);
            expect(onTickCallback.callCount).toBe(1);
            
            // 500ms
            jasmine.Clock.tick(250);
            expect(callbackTime).toBe(500);
            expect(onTickCallback.callCount).toBe(2);

            // double frequency.
            timer.doubleFrequency();

            // 749ms
            jasmine.Clock.tick(249);
            expect(callbackTime).toBe(500);
            expect(onTickCallback.callCount).toBe(2);

            // 750ms
            jasmine.Clock.tick(1);
            expect(callbackTime).toBe(750);
            expect(onTickCallback.callCount).toBe(3);

            // 999ms
            jasmine.Clock.tick(249);
            expect(callbackTime).toBe(750);
            expect(onTickCallback.callCount).toBe(3);

            // 1000ms
            jasmine.Clock.tick(1);
            expect(callbackTime).toBe(1000);
            expect(onTickCallback.callCount).toBe(4);
        });
        
        it('halveFrequency causes interval to double', function() {
            var origIntervalMs = timer.tickInterval.asMilliseconds();
            timer.halveFrequency();
            expect(timer.tickInterval.asMilliseconds()).toBe(origIntervalMs * 2);
        });

        it('halve frequency causes onTick call back to be called at half the frequency', function() {
            // 0ms
            timer.start();
            expect(callbackTime).toBe(0);
            expect(onTickCallback.callCount).toBe(1);
            
            // 500ms
            jasmine.Clock.tick(500);
            expect(callbackTime).toBe(500);
            expect(onTickCallback.callCount).toBe(2);

            // half frequency
            timer.halveFrequency();

            // 1000ms
            jasmine.Clock.tick(500);
            expect(callbackTime).toBe(500);
            expect(onTickCallback.callCount).toBe(2);
            
            // 1499ms
            jasmine.Clock.tick(499);
            expect(callbackTime).toBe(500);
            expect(onTickCallback.callCount).toBe(2);

            // 1500ms
            jasmine.Clock.tick(1);
            expect(callbackTime).toBe(1500);
            expect(onTickCallback.callCount).toBe(3);

            // 1501ms
            jasmine.Clock.tick(1);
            expect(callbackTime).toBe(1500);
            expect(onTickCallback.callCount).toBe(3);
        });
    });
});

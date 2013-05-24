/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Timer", function() {

    var timer;

    beforeEach(function() {
        this.addMatchers({
            toBeSame: function(expected) {
                return this.actual.isSame(expected);   // moment.js#isSame()
            }
        });
    });

    describe("construction", function() {
        it("construct with strings", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43'
            });
            
            expect(timer.startDateTime).toBeSame(moment('2013-03-06T12:34:56'));
            expect(timer.endDateTime).toBeSame(moment('2013-04-07T02:12:43'));
        });

        it("construct with moments", function() {
            timer = new OpenLayers.Timer({
                startDateTime: moment('2013-03-06T12:34:56'),
                endDateTime: ('2013-04-07T02:12:43')
            });
            
            expect(timer.startDateTime).toBeSame(moment('2013-03-06T12:34:56'));
            expect(timer.endDateTime).toBeSame(moment('2013-04-07T02:12:43'));
        });

        it("default ticks", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43'
            });

            expect(timer.numTicks).toBe(10);
        });

        it("override ticks", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43',
                numTicks: 12
            });

            expect(timer.numTicks).toBe(12);
        });

        it("get duration", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T14:00:00'
            });

            expect(timer.getDuration().hours()).toBe(2);
        });

        it("get tick interval", function() {
            timer = new OpenLayers.Timer({
                startDateTime: '2013-03-06T12:00:00',
                endDateTime: '2013-03-06T13:00:00',
                numTicks: 5
            });

            expect(timer.getTickInterval().minutes()).toBe(15);
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
});

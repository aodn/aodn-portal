/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Control.Time", function() {

    var map;
    var timeControl;
    var extent = [
        '2001-01-01T00:00',
        '2001-01-02T00:00',
        '2001-01-03T00:00',
        '2001-01-04T00:00',
        '2001-01-05T00:00'
    ];
    
    var ncwmsLayer;

    beforeEach(function() {

        map = new OpenLayers.TemporalMap();
        timeControl = new OpenLayers.Control.Time({
            map: map
        });
        OpenLayers.Layer.NcWMS.prototype._getTimeControl = function() { return timeControl; }

        spyOn(timeControl.timer, 'start');
        spyOn(timeControl.timer, 'stop');

        ncwmsLayer = new OpenLayers.Layer.NcWMS();

        // Process a temporal extent async
        ncwmsLayer.rawTemporalExtent = extent;
        ncwmsLayer.temporalExtent = null;
        ncwmsLayer._processTemporalExtent();
        waitsFor(function() {
            return ncwmsLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);
    });

    describe('map', function() {
        it('initialisation', function() {
            expect(timeControl.map).not.toBeNull();
        });

        it('onTick', function() {
            spyOn(timeControl.map, 'toTime');
            timeControl.onTick({
                index: 1,
                dateTime: moment.utc('2000-12-12T01:01:01Z')
            });

            expect(map.toTime).toHaveBeenCalledWith(moment.utc('2000-12-12T01:01:01Z'));
        });
    });

    describe('timer', function() {

        beforeEach(function() {
            timeControl = new OpenLayers.Control.Time({
                map: map,
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-03-16T12:34:56'
            });
        });

        it('initialisation', function() {
            expect(timeControl.timer).not.toBeNull();
            expect(timeControl.timer.observers['tick']).toBeTruthy();
            expect(timeControl.timer.observers['tick'].context).toBe(timeControl);
            expect(timeControl.timer.observers['tick'].callback).toBe(timeControl.onTick);
        });

        it('start/end date/time specified', function() {
            expect(timeControl.timer.getStartDateTime()).toBeSameAsUtc('2013-03-06T12:34:56');
            expect(timeControl.timer.getEndDateTime()).toBeSameAsUtc('2013-03-16T12:34:56');
        });

        it('getStep', function() {
            expect(timeControl.getStep()).toBe(0);
        });

        it('getDateTimeForStep', function() {
            expect(timeControl.getDateTimeForStep(0)).toBeSameAsUtc('2013-03-06T12:34:56');
            expect(timeControl.getDateTimeForStep(9)).toBeSameAsUtc('2013-03-16T12:34:56');
            expect(timeControl.getDateTimeForStep(10)).toBe(undefined);
        });
    });

    describe('play/stop', function() {

        it('on play, timer is started', function() {
            timeControl.play();
            expect(timeControl.timer.start).toHaveBeenCalled();
        });

        it('on stop, timer is stopped', function() {
            timeControl.state = timeControl.STATES.PLAYING;
            timeControl.stop();
            expect(timeControl.timer.stop).toHaveBeenCalled();
        });

        describe('various play/stop sequences testing that calls in to Timer are made only when necessary', function() {
            it('play, play, timer start called only once', function() {
                timeControl.play();
                timeControl.play();
                expect(timeControl.timer.start.callCount).toEqual(1);
            });

            it('stop', function() {
                timeControl.stop();
                expect(timeControl.timer.stop).not.toHaveBeenCalled();
            });

            it('play, stop, stop', function() {
                timeControl.play();
                timeControl.stop();
                expect(timeControl.timer.stop.callCount).toEqual(1);
                timeControl.stop();
                expect(timeControl.timer.stop.callCount).toEqual(1);
            });

            it('play, stop, play', function() {
                timeControl.play();
                expect(timeControl.timer.start.callCount).toEqual(1);
                expect(timeControl.timer.stop.callCount).toEqual(0);

                timeControl.stop();
                expect(timeControl.timer.start.callCount).toEqual(1);
                expect(timeControl.timer.stop.callCount).toEqual(1);

                timeControl.play();
                expect(timeControl.timer.start.callCount).toEqual(2);
                expect(timeControl.timer.stop.callCount).toEqual(1);
            });
        });
    });

    describe('speedUp/slowDown', function() {

        it('initial relative speed', function() {
            expect(timeControl.getRelativeSpeed()).toBe(1);
        });

        it('speed up causes timer double frequency to be called', function() {
            spyOn(timeControl.timer, 'doubleFrequency');
            timeControl.speedUp();
            expect(timeControl.timer.doubleFrequency).toHaveBeenCalled();
        });

        it('speed up causes relative speed to double', function() {
            timeControl.speedUp();
            expect(timeControl.getRelativeSpeed()).toBe(2);
            timeControl.speedUp();
            expect(timeControl.getRelativeSpeed()).toBe(4);
        });

        it('speed up limit of 32x', function() {
            timeControl.relativeSpeed = 16;

            expect(timeControl.speedUp()).toBeTruthy();
            expect(timeControl.getRelativeSpeed()).toBe(32);
            expect(timeControl.isAtFastestSpeed()).toBeTruthy();

            expect(timeControl.speedUp()).toBeFalsy();
            expect(timeControl.getRelativeSpeed()).toBe(32);
        });

        it('slow down causes timer halve frequency to be called', function() {
            spyOn(timeControl.timer, 'halveFrequency');
            timeControl.slowDown();
            expect(timeControl.timer.halveFrequency).toHaveBeenCalled();
        });

        it('slow down limit of 1/32x', function() {
            timeControl.relativeSpeed = 1/16;
            expect(timeControl.isAtSlowestSpeed()).toBeFalsy();

            expect(timeControl.slowDown()).toBeTruthy();
            expect(timeControl.getRelativeSpeed()).toBe(1/32);
            expect(timeControl.isAtSlowestSpeed()).toBeTruthy();

            expect(timeControl.slowDown()).toBeFalsy();
            expect(timeControl.getRelativeSpeed()).toBe(1/32);
        });

        it('slow down causes relative speed to half', function() {
            timeControl.slowDown();
            expect(timeControl.getRelativeSpeed()).toBe(0.5);
            timeControl.slowDown();
            expect(timeControl.getRelativeSpeed()).toBe(0.25);
        });
    });

    describe('configure with layer', function() {
        it('bin search date', function() {

            var extentTest = [moment.utc('2000-01-01T00:00')];
            for (var i = 0; i <= 11; i++) {
                extentTest.push(extentTest[extentTest.length - 1].clone().add('years', 1));
            }

            var index = 0;
            index = timeControl._findIndexOfDate(extentTest, moment.utc("2000-01-01T00:00"));
            expect(index).toBe(0);

            index = timeControl._findIndexOfDate(extentTest, moment.utc("2006-01-01T00:00"));
            expect(index).toBe(6);

            // does not exist
            index = timeControl._findIndexOfDate(extentTest, moment.utc("2000-01-02T00:00"));
            expect(index).toBe(-1);
        });

        it("timer extent is 'n' most recent date/times from layer", function() {
            timeControl.configureForLayer(ncwmsLayer, 3);
            expect(timeControl.timer.getNumTicks()).toBe(3);
            expect(timeControl.timer.getStartDateTime()).toBeSameAsUtc('2001-01-03T00:00');
            expect(timeControl.timer.getEndDateTime()).toBeSameAsUtc('2001-01-05T00:00');

            timeControl.configureForLayer(ncwmsLayer, 2);
            expect(timeControl.timer.getNumTicks()).toBe(2);
            expect(timeControl.timer.getStartDateTime()).toBeSameAsUtc('2001-01-04T00:00');
            expect(timeControl.timer.getEndDateTime()).toBeSameAsUtc('2001-01-05T00:00');
        });

        it('dummy tickEvent sent', function() {
            spyOn(timeControl, 'onTick');
            timeControl.configureForLayer(ncwmsLayer, 3);
            expect(timeControl.onTick).toHaveBeenCalledWith({
                index: 0,
                dateTime: moment.utc('2001-01-03T00:00')
            });
        });

        it('returns animated extent', function() {
            timeControl.configureForLayer(ncwmsLayer, 2);
            expect(timeControl.getExtent()).toBeSameAsUtc([
                '2001-01-04T00:00',
                '2001-01-05T00:00'
            ]);
        });

        it('start/end date/times specified', function() {
            timeControl.configureForLayer(ncwmsLayer, [
                moment.utc('2001-01-01T00:00'),
                moment.utc('2001-01-03T00:00')
            ]);
            expect(timeControl.getExtent()).toBeSameAsUtc([
                '2001-01-01T00:00',
                '2001-01-02T00:00',
                '2001-01-03T00:00'
            ]);

        });

        it('do nothing if layer without extent is given', function() {
            spyOn(timeControl.timer, 'setTickDateTimes');
            spyOn(timeControl.events, 'triggerEvent');
            timeControl.configureForLayer({}, 10);
            expect(timeControl.timer.setTickDateTimes).not.toHaveBeenCalled();
            expect(timeControl.events.triggerEvent).not.toHaveBeenCalled();
        });
    });

    describe('events', function() {
        describe('speedchanged', function() {
            var speedchangedSpy;

            beforeEach(function() {
                speedchangedSpy = jasmine.createSpy('speedChanged');
                timeControl.events.on({
                    'speedchanged': speedchangedSpy,
                    scope: this
                });
            });

            it('speedchanged fired on speedUp', function() {
                timeControl.speedUp();
                expect(speedchangedSpy).toHaveBeenCalled();
            });

            it('speedchanged fired on slowDown', function() {
                timeControl.slowDown();
                expect(speedchangedSpy).toHaveBeenCalled();
            });
        });

        describe('temporalextentchanged', function() {
            var temporalextentchangedSpy = jasmine.createSpy('temporalextentchanged');

            it('temporalextentchanged fired on configureForLayer', function() {
                timeControl.events.on({
                    'temporalextentchanged': temporalextentchangedSpy,
                    scope: this
                });

                timeControl.configureForLayer(ncwmsLayer, 3);
                expect(temporalextentchangedSpy).toHaveBeenCalled();
                expect(temporalextentchangedSpy.calls[0].args[0].layer.min).toBeSame(ncwmsLayer.getTemporalExtentMin());
                expect(temporalextentchangedSpy.calls[0].args[0].layer.max).toBeSame(ncwmsLayer.getTemporalExtentMax());
                expect(temporalextentchangedSpy.calls[0].args[0].timer.min).toBeSame(
                    timeControl.timer.getTickDateTimeMin());
                expect(temporalextentchangedSpy.calls[0].args[0].timer.max).toBeSame(
                    timeControl.timer.getTickDateTimeMax());
            });
        });
    });
});

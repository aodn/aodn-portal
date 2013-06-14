/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Control.Time", function() {

    var map;
    var timeControl;

    beforeEach(function() {

        map = new OpenLayers.TemporalMap();
        timeControl = new OpenLayers.Control.Time({
            map: map
        });

        spyOn(timeControl.timer, 'start');
        spyOn(timeControl.timer, 'stop');

        // TODO: refactor custom toBeSame matcher to somewhere common to all specs.
        this.addMatchers({
            toBeSame: function(expected) {
                return this.actual.isSame(expected);   // moment.js#isSame()
            }
        });
    });

    describe('map', function() {
        it('initialisation', function() {
            expect(timeControl.map).not.toBeNull();
        });

        it('onTick', function() {
            spyOn(timeControl.map, 'toTime');
            timeControl.onTick({
                index: 1,
                dateTime: moment('2000-12-12T01:01:01Z')
            });

            expect(map.toTime).toHaveBeenCalledWith(moment('2000-12-12T01:01:01Z'));
        });
    });

    describe('timer', function() {

        it('initialisation', function() {
            expect(timeControl.timer).not.toBeNull();
        });

        it('start/end date/time specified', function() {
            timeControl = new OpenLayers.Control.Time({
                map: map,
                startDateTime: '2013-03-06T12:34:56',
                endDateTime: '2013-04-07T02:12:43'
            });

            expect(timeControl.timer.startDateTime).toBeSame('2013-03-06T12:34:56');
            expect(timeControl.timer.endDateTime).toBeSame('2013-04-07T02:12:43');

        });
    });

    describe('play/stop', function() {

        it('on play, timer is started', function() {
            timeControl.play();
            expect(timeControl.timer.start).toHaveBeenCalled();
        });

        it('on play, onTick is registered observer for timer\'s ticks', function() {
            expect(timeControl.timer.observers['tick']).toBeFalsy();
            timeControl.play();
            expect(timeControl.timer.observers['tick']).toBeTruthy();
            expect(timeControl.timer.observers['tick']).toBe(timeControl.onTick);
        });

        it('on stop, timer is stopped', function() {
            timeControl.stop();
            expect(timeControl.timer.stop).toHaveBeenCalled();
        });

        it('on stop, onTick is not registered observer for timer\'s ticks', function() {
            timeControl.play();   // Observer will now be registered.
            timeControl.stop();
            expect(timeControl.timer.observers['tick']).toBeFalsy();
        });
    });
});

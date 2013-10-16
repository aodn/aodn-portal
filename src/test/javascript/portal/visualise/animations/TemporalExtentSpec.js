/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.visualise.animations.TemporalExtent", function() {

    var temporalExtent;

    beforeEach(function () {
        temporalExtent = new Portal.visualise.animations.TemporalExtent();
    });

    describe('empty', function() {
        it('is empty', function() {
            expect(temporalExtent.empty()).toBeTruthy();
        });

        it('is not empty', function() {
            temporalExtent.add(moment().utc());
            expect(temporalExtent.empty()).toBeFalsy();
        });
    });

    describe('not empty', function() {
        it('is empty', function() {
            expect(temporalExtent.notEmpty()).toBeFalsy();
        });

        it('is not empty', function() {
            temporalExtent.add(moment().utc());
            expect(temporalExtent.notEmpty()).toBeTruthy();
        });
    });

    describe('add', function() {
        it('adds a moment element', function() {
            var d = moment().utc();
            temporalExtent.add(d);
            expect(temporalExtent.max().utc().toDate()).toEqual(d.toDate());
        });

        it('adds a date element', function() {
            var d = moment().utc().toDate();
            temporalExtent.add(d);
            expect(temporalExtent.max().utc().toDate()).toEqual(d);
        });

        it('adds a string element', function() {
            var s = '2001-01-12T21:48:00.000Z';
            temporalExtent.add(s);
            expect(temporalExtent.max().utc().toDate()).toEqual(new Date('2001-01-12T21:48:00.000Z'));
        });
    });

    describe('min', function() {
        it('returns undefined when empty', function() {
            expect(temporalExtent.min()).toBeUndefined();
        });

        it('returns the first element', function() {
            var expected = moment.utc();
            temporalExtent.add(expected);

            var m = expected.clone().add('days', 1);
            temporalExtent.add(m);

            expect(temporalExtent.min().toDate()).toEqual(expected.toDate());
        });
    });

    describe('max', function() {
        it('returns undefined when empty', function() {
            expect(temporalExtent.max()).toBeUndefined();
        });

        it('returns the last element', function() {
            var m = moment.utc();
            temporalExtent.add(m);
            var expected = m.clone().add('days', 1);
            temporalExtent.add(expected);
            expect(temporalExtent.max().toDate()).toEqual(expected.toDate());
        });
    });

    describe('zero if negative', function() {
        it('returns zero if the parameter is negative', function() {
            expect(temporalExtent._zeroIfNegative(-1)).toEqual(0);
        });

        it('returns the value if the parameter is not negative', function() {
            expect(temporalExtent._zeroIfNegative(0)).toEqual(0);
        });

        it('returns the value if the parameter is positive', function() {
            expect(temporalExtent._zeroIfNegative(3)).toEqual(3);
        });
    });

    describe('when negative', function() {
        it('returns the provided default value if the parameter is negative', function() {
            expect(temporalExtent._whenNegative(-1, 0)).toEqual(0);
        });

        it('returns the value if the parameter is not negative', function() {
            expect(temporalExtent._whenNegative(0, 3)).toEqual(0);
        });

        it('returns the value if the parameter is positive', function() {
            expect(temporalExtent._whenNegative(3, 5)).toEqual(3);
        });
    });

    describe('sub extents', function() {
        var expected = [];

        beforeEach(function() {
            var m = moment.utc('2013-01-01T00:00:00.000Z');

            // Loop creates moments from 2013-01-01T00:00:00.000 to 2013-01-03T01:00:00.000
            for (var i = 1; i <= 50; i++) {
                expected.push(m.clone());
                temporalExtent.add(m);
                m.add('hours', 1);
            }
        });

        describe('subExtentForDate', function() {
            it('gets a sub extent for a given date', function() {
                var subExtent = temporalExtent.subExtentForDate(moment.utc('2013-01-01T00:00:00.000Z'));
                expect(subExtent.length()).toBe(24);
            });

            it('gets a sub extent for a given date with a non zero hour', function() {
                var subExtent = temporalExtent.subExtentForDate(moment.utc('2013-01-01T12:00:00.000Z'));
                expect(subExtent.length()).toBe(24);
            });

            it('gets a sub extent for a given date within a second of midnight the next day', function() {
                var subExtent = temporalExtent.subExtentForDate(moment.utc('2013-01-01T23:59:59.000Z'));
                expect(subExtent.length()).toBe(24);
            });

            it('keeps the moments in utc', function() {
                var subExtent = temporalExtent.subExtentForDate(moment.utc('2013-01-01T00:00:00.000Z'));
                for (var i = 0; i < 23; i++) {
                    expect(subExtent.extent[i].toDate()).toEqual(expected[i].toDate());
                }
            });
        });

        describe('equal to or after', function() {
            it('is equal to', function() {
                expect(temporalExtent._equalToOrAfter(moment.utc('2013-01-01T00:00:00.000Z'), moment.utc('2013-01-01T00:00:00.000Z'))).toEqual(true);
            });

            it('is after', function() {
                expect(temporalExtent._equalToOrAfter(moment.utc('2013-01-01T00:00:00.001Z'), moment.utc('2013-01-01T00:00:00.000Z'))).toEqual(true);
            });
        });

        describe('equal to or before', function() {
            it('is equal to', function() {
                expect(temporalExtent._equalToOrBefore(moment.utc('2013-01-01T00:00:00.000Z'), moment.utc('2013-01-01T00:00:00.000Z'))).toEqual(true);
            });

            it('is before', function() {
                expect(temporalExtent._equalToOrBefore(moment.utc('2013-01-01T00:00:00.000Z'), moment.utc('2013-01-01T00:00:00.001Z'))).toEqual(true);
            });
        });

        describe('_findIndexOrNearestAfter', function() {
            it('finds the index of the date equal to or after the search date', function() {
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T00:00:00.000Z'), 0)).toEqual(0);
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T00:30:00.000Z'), 0)).toEqual(1);
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T00:30:00.000Z'), 5)).toEqual(1);
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T00:30:00.000Z'), 49)).toEqual(1);
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T12:00:00.000Z'), 0)).toEqual(12);
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T12:00:00.000Z'), 12)).toEqual(12);
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2013-01-01T12:00:00.000Z'), 49)).toEqual(12);
            });

            it('returns the last index when the there is no date after the target in the extent', function() {
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2014-01-01T00:00:00.000Z'), 0)).toEqual(49);
            });

            it('returns the first index when the there is no date before the target in the extent', function() {
                expect(temporalExtent._findIndexOrNearestAfter(moment.utc('2012-01-01T00:00:00.000Z'), 0)).toEqual(0);
            });
        });

        describe('_findIndexOrNearestBefore', function() {
            it('finds the index of the date nearest to but before the search date', function() {
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2013-01-01T00:00:00.000Z'), 0)).toEqual(0);
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2013-01-01T00:30:00.000Z'), 0)).toEqual(0);
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2013-01-01T00:30:00.000Z'), 1)).toEqual(0);
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2013-01-01T01:30:00.000Z'), 5)).toEqual(1);
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2013-01-01T01:30:00.000Z'), 0)).toEqual(1);
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2013-01-01T01:30:00.000Z'), 49)).toEqual(1);
            });

            it('returns the first index when the there is no date before the target in the extent', function() {
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2012-01-01T00:00:00.000Z'), 49)).toEqual(0);
            });

            it('returns the last index when the there is no date after the target in the extent', function() {
                expect(temporalExtent._findIndexOrNearestBefore(moment.utc('2014-01-01T00:00:00.000Z'), 0)).toEqual(49);
            });
        });

        describe('subExtent', function() {
            it('gets a sub extent from one date to another', function() {
                var subExtent = temporalExtent.subExtent(moment.utc('2013-01-01T22:00:00.000Z'), moment.utc('2013-01-02T02:00:00.000Z'));
                expect(subExtent.length()).toBe(4);
            });

            it('gets a sub extent from one date to the end when no end date is provided', function() {
                var subExtent = temporalExtent.subExtent(moment.utc('2013-01-03T00:00:00.000Z'));
                expect(subExtent.length()).toBe(2);
            });

            it('gets a sub extent from start date to the end when no end date is provided and start date is the min', function() {
                var subExtent = temporalExtent.subExtent(moment.utc('2013-01-01T00:00:00.000Z'));
                expect(subExtent.length()).toBe(50);
            });

            it('gets the entire extent when the start and end date exceed the extent boundaries', function() {
                var subExtent = temporalExtent.subExtent(moment.utc('2012-01-01T22:00:00.000Z'), moment.utc('2014-01-02T02:00:00.000Z'));
                expect(subExtent.length()).toBe(50);
            });
        });
    });

    describe('navigation', function() {
        var current;

        beforeEach(function() {
            current = moment.utc('2013-01-01T12:00:00.000Z');
            var m = moment.utc('2013-01-01T00:00:00.000Z');

            // Loop creates moments from 2013-01-01T00:00:00.000 to 2013-01-03T01:00:00.000
            for (var i = 1; i <= 50; i++) {
                temporalExtent.add(m);
                m.add('hours', 1);
            }
        });

        describe('_findFirstIndexAfter', function() {
            it('finds the first index after the search date', function() {
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T00:00:00.000Z'), 0)).toEqual(1);
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T00:30:00.000Z'), 0)).toEqual(1);
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T00:30:00.000Z'), 5)).toEqual(1);
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T00:30:00.000Z'), 49)).toEqual(1);
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T12:00:00.000Z'), 0)).toEqual(13);
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T12:00:00.000Z'), 12)).toEqual(13);
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T12:00:00.000Z'), 49)).toEqual(13);
            });

            it('returns minus one when the there is no date after the target in the extent', function() {
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2014-01-01T00:00:00.000Z'), 0)).toEqual(-1);
            });

            it('returns the first index when the there is no date before the target in the extent', function() {
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2012-01-01T00:00:00.000Z'), 0)).toEqual(0);
            });

            it('returns the second index when the target is equal to the extent min starting at first index', function() {
                expect(temporalExtent._findFirstIndexAfter(moment.utc('2013-01-01T00:00:00.000Z'), 0)).toEqual(1);
            });
        });

        describe('_findFirstIndexBefore', function() {
            it('finds the first index before the search date', function() {
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-01T01:00:00.000Z'), 0)).toEqual(0);
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-01T00:30:00.000Z'), 0)).toEqual(0);
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-01T00:30:00.000Z'), 1)).toEqual(0);
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-01T01:30:00.000Z'), 5)).toEqual(1);
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-01T08:00:00.000Z'), 5)).toEqual(7);
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-01T01:00:00.000Z'), 49)).toEqual(0);
            });

            it('returns minus one when the there is no date before the target in the extent', function() {
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2012-01-01T00:00:00.000Z'), 49)).toEqual(-1);
            });

            it('returns the last index when the there is no date after the target in the extent', function() {
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2014-01-01T00:00:00.000Z'), 0)).toEqual(49);
            });

            it('returns the penultimate index when the target is equal to the extent max starting at last index', function() {
                expect(temporalExtent._findFirstIndexBefore(moment.utc('2013-01-03T01:00:00.000Z'), 49)).toEqual(48);
            });
        });

        describe('next', function() {
            it('gets the next time slice', function() {
                var expected = moment.utc('2013-01-01T13:00:00.000Z');
                var next = temporalExtent.next(current);
                expect(next.toDate()).toEqual(expected.toDate());
            });

            it('returns undefined if current time is after extent', function() {
                var next = temporalExtent.next(moment.utc('2014-01-01T13:00:00.000Z'));
                expect(next).toBeUndefined();
            });

            it('returns undefined if a current is equal to extent max', function() {
                var next = temporalExtent.next(moment.utc('2013-01-03T01:00:00.000Z'));
                expect(next).toBeUndefined();
            });

            it('returns the first time slice if the current date is before the extent minimum', function() {
                var expected = moment.utc('2013-01-01T00:00:00.000Z');
                var next = temporalExtent.next(moment.utc('2011-01-01T00:00:00.000Z'));
                expect(next.toDate()).toEqual(expected.toDate());
            });
        });

        describe('previous', function() {
            it('gets the previous time slice', function() {
                var expected = moment.utc('2013-01-01T11:00:00.000Z');
                var previous = temporalExtent.previous(current);
                expect(previous.toDate()).toEqual(expected.toDate());
            });

            it('returns undefined if current time is before extent', function() {
                var previous = temporalExtent.previous(moment.utc('2011-01-01T13:00:00.000Z'));
                expect(previous).toBeUndefined();
            });

            it('returns undefined if current time is equal to extent min', function() {
                var previous = temporalExtent.previous(moment.utc('2013-01-01T00:00:00.000Z'));
                expect(previous).toBeUndefined();
            });

            it('returns the last time slice if the current date is after the extent maximum', function() {
                var expected = moment.utc('2013-01-03T01:00:00.000Z');
                var previous = temporalExtent.previous(moment.utc('2015-01-01T00:00:00.000Z'));
                expect(previous.toDate()).toEqual(expected.toDate());
            });
        });
    });
});

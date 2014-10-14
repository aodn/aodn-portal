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

    describe('serialization', function() {
        it('stringify/destringify', function() {
            var date = new moment.utc("2014-09-08", Portal.visualise.animations.TemporalExtent.DATE_FORMAT);

            var dateStringified = temporalExtent._stringifyDate(date);
            expect(dateStringified).toEqual("2014-09-08");

            var dateDestringified = temporalExtent._destringifyDate(dateStringified);
            expect(dateDestringified.toDate()).toEqual(date.toDate());
        });
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

    describe('getDay', function() {
        it('return null when empty', function() {
            expect(temporalExtent.getDay('2014-01-01')).toEqual(null);
        });

        it('return array when defined', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-20T00:00:00.000Z')
            ]);

            expect(temporalExtent.getDay(moment.utc('2013-01-20T00:00:00.000Z'))).toEqual([]);
        });
    });

    describe('_getFirstDay', function() {
        it('when empty', function() {
            expect(temporalExtent._getFirstDay()).toBeUndefined();
        });

        it('when no dates but only days', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-20T00:00:00.000Z'),
                moment.utc('2013-01-01T00:00:00.000Z'),
                moment.utc('2013-01-30T00:00:00.000Z')
            ]);

            var expected = moment.utc('2013-01-01T00:00:00.000Z');
            expect(temporalExtent._getFirstDay().toDate()).toEqual(expected.toDate());
        });
    });

    describe('_getLastDay', function() {
        it('when empty', function() {
            expect(temporalExtent._getLastDay()).toBeUndefined();
        });

        it('when no dates but only days', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-20T00:00:00.000Z'),
                moment.utc('2013-01-01T00:00:00.000Z'),
                moment.utc('2013-01-30T00:00:00.000Z')
            ]);

            var expected = moment.utc('2013-01-30T00:00:00.000Z');
            expect(temporalExtent._getLastDay().toDate()).toEqual(expected.toDate());
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
                    expect(subExtent.getDay('2013-01-01')[i].toDate()).toEqual(expected[i].toDate());
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

    describe('missing days', function() {
        describe('when parsing an extent', function() {
            it('correctly generates missing days', function() {
                temporalExtent.addDays([
                    moment.utc('2013-01-01T00:00:00.000Z'),
                    moment.utc('2013-01-10T00:00:00.000Z'),
                    moment.utc('2013-01-20T00:00:00.000Z'),
                    moment.utc('2013-01-30T00:00:00.000Z')
                ]);

                expect(temporalExtent.getMissingDays().length).toEqual(26);
                expect(temporalExtent.getMissingDays()[0] instanceof Date).toBeTruthy();
            });
        });
    });

    describe('days', function() {
        it('correctly generates distinct existing days', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-01T00:00:00.000Z'),
                moment.utc('2013-01-10T00:10:00.000Z'),
                moment.utc('2013-01-20T12:00:00.000Z'),
                moment.utc('2013-01-20T15:30:00.000Z'),
                moment.utc('2013-01-30T00:00:00.000Z'),
                moment.utc('2013-01-30T13:00:00.000Z')
            ]);

            expect(temporalExtent.getDays().length).toEqual(4);
            expect(temporalExtent.getDays()[0].toISOString()).toEqual("2013-01-01T00:00:00.000Z");
            expect(temporalExtent.getDays()[1].toISOString()).toEqual("2013-01-10T00:00:00.000Z");
            expect(temporalExtent.getDays()[2].toISOString()).toEqual("2013-01-20T00:00:00.000Z");
            expect(temporalExtent.getDays()[3].toISOString()).toEqual("2013-01-30T00:00:00.000Z");
        });
    });
});

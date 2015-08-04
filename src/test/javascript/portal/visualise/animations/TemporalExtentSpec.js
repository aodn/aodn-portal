

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
        it('returns null when empty', function() {
            expect(temporalExtent.min()).toBeUndefined();
        });

        it('returns the first element', function() {
            var expected = moment.utc('2000-01-01T00:00:00.000');
            temporalExtent.parse(['2000-01-01T00:00:00.000/2000-01-01T01:00:00.000/PT30M']);
            expect(temporalExtent.min().toDate()).toEqual(expected.toDate());
        });
    });

    describe('max', function() {
        it('returns undefined when empty', function() {
            expect(temporalExtent.max()).toBeUndefined();
        });

        it('returns the last element', function() {
            var expected = moment.utc('2000-01-01T01:00:00.000');
            temporalExtent.parse(['2000-01-01T00:00:00.000/2000-01-01T01:00:00.000/PT30M']);
            expect(temporalExtent.max().toDate()).toEqual(expected.toDate());
        });
    });

    describe('_createDay', function() {
        var aMomentInTime = moment.utc('2000-01-01T01:00:00.000');
        var calledWith = null;

        beforeEach(function() {
            spyOn(temporalExtent, '_setFirstDay').andCallFake(function(date) { calledWith = date; });
            spyOn(temporalExtent, '_setLastDay').andCallFake(function(date) { calledWith = date; });
            temporalExtent._createDay(aMomentInTime);
        });

        it('calls _setFirstDay', function() {
            expect(temporalExtent._setFirstDay).toHaveBeenCalled();
            expect(aMomentInTime).toBeSame(calledWith);
        });

        it('calls _setLastDay', function() {
            expect(temporalExtent._setLastDay).toHaveBeenCalled();
            expect(aMomentInTime).toBeSame(calledWith);
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

    describe('getFirstDay', function() {
        it('when empty', function() {
            expect(temporalExtent.getFirstDay()).toEqual(null);
        });

        it('when no dates but only days', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-20T00:00:00.000Z'),
                moment.utc('2013-01-01T00:00:00.000Z'),
                moment.utc('2013-01-30T00:00:00.000Z')
            ]);

            var expected = moment.utc('2013-01-01T00:00:00.000Z');
            expect(temporalExtent.getFirstDay().toDate()).toEqual(expected.toDate());
        });
    });

    describe('getLastDay', function() {
        it('when empty', function() {
            expect(temporalExtent.getLastDay()).toBeUndefined();
        });

        it('when no dates but only days', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-20T00:00:00.000Z'),
                moment.utc('2013-01-01T00:00:00.000Z'),
                moment.utc('2013-01-30T00:00:00.000Z')
            ]);

            var expected = moment.utc('2013-01-30T00:00:00.000Z');
            expect(temporalExtent.getLastDay().toDate()).toEqual(expected.toDate());
        });
    });

    describe('previousValidDate', function() {
        it('returns undefined when empty', function() {
            expect(temporalExtent.previousValidDate(moment.utc())).toBeUndefined();
        });

        it('returns previous available date', function() {
            temporalExtent.parse([
                '2013-01-01T00:00:00.000Z',
                '2013-01-20T00:00:00.000Z',
                '2013-02-20T00:00:00.000Z',
                '2013-03-30T00:00:00.000Z'
            ]);

            // Before first date
            var expected = moment.utc('2013-01-01T00:00:00.000Z');
            expect(temporalExtent.previousValidDate(moment.utc('2013-01-01T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2012-11-30T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // Between first and second dates
            expected = moment.utc('2013-01-01T00:00:00.000Z');
            expect(temporalExtent.previousValidDate(moment.utc('2013-01-20T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-01-19T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-01-02T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // Between second and third dates
            expected = moment.utc('2013-01-20T00:00:00.000Z');
            expect(temporalExtent.previousValidDate(moment.utc('2013-01-21T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-01-22T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-02-19T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-02-20T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // Between third and fourth dates
            expected = moment.utc('2013-02-20T00:00:00.000Z');
            expect(temporalExtent.previousValidDate(moment.utc('2013-02-21T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-03-03T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-03-30T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // After fourth date
            expected = moment.utc('2013-03-30T00:00:00.000Z');
            expect(temporalExtent.previousValidDate(moment.utc('2013-03-31T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2013-04-01T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.previousValidDate(moment.utc('2038-01-01T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
        });
    });

    describe('nextValidDate', function() {
        it('returns undefined when empty', function() {
            expect(temporalExtent.nextValidDate(moment.utc())).toBeUndefined();
        });

        it('returns next available date', function() {
            temporalExtent.parse([
                '2013-01-01T00:00:00.000Z',
                '2013-01-20T00:00:00.000Z',
                '2013-02-20T00:00:00.000Z',
                '2013-03-30T00:00:00.000Z'
            ]);

            // Before first date
            var expected = moment.utc('2013-01-01T00:00:00.000Z');
            expect(temporalExtent.nextValidDate(moment.utc('2012-12-31T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2012-11-30T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // Between first and second dates
            expected = moment.utc('2013-01-20T00:00:00.000Z');
            expect(temporalExtent.nextValidDate(moment.utc('2013-01-01T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-01-02T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-01-19T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // Between second and third dates
            expected = moment.utc('2013-02-20T00:00:00.000Z');
            expect(temporalExtent.nextValidDate(moment.utc('2013-01-20T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-01-21T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-02-18T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-02-19T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // Between third and fourth dates
            expected = moment.utc('2013-03-30T00:00:00.000Z');
            expect(temporalExtent.nextValidDate(moment.utc('2013-02-20T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-03-03T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-03-29T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());

            // After fourth date
            expected = moment.utc('2013-03-30T00:00:00.000Z');
            expect(temporalExtent.nextValidDate(moment.utc('2013-03-30T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-03-31T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2013-04-01T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
            expect(temporalExtent.nextValidDate(moment.utc('2038-01-01T00:00:00.000Z')).valueOf()).toEqual(expected.valueOf());
        });
    });

    describe('getExtentAsArray', function() {
        it('returns empty array when no dates defined', function() {
            expect(temporalExtent.getExtentAsArray()).toEqual([]);
        });

        it('returns empty array when only dates defined', function() {
            temporalExtent.addDays([
                moment.utc('2013-01-20T00:00:00.000Z'),
                moment.utc('2013-01-01T00:00:00.000Z'),
                moment.utc('2013-01-30T00:00:00.000Z')
            ]);

            expect(temporalExtent.getExtentAsArray()).toEqual([]);
        });

        it('returns all defined dates in array', function() {
            temporalExtent.parse(['2000-01-01T23:00:00.000/2000-01-02T01:00:00.000/PT30M']);
            var flatArrayOfDates = temporalExtent.getExtentAsArray();
            expect(flatArrayOfDates[0].toISOString()).toBe('2000-01-01T23:00:00.000Z');
            expect(flatArrayOfDates[1].toISOString()).toBe('2000-01-01T23:30:00.000Z');
            expect(flatArrayOfDates[2].toISOString()).toBe('2000-01-02T00:00:00.000Z');
            expect(flatArrayOfDates[3].toISOString()).toBe('2000-01-02T00:30:00.000Z');
            expect(flatArrayOfDates[4].toISOString()).toBe('2000-01-02T01:00:00.000Z');
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

            it('returns first time of next day if crossing the day boundary', function() {
                var next = temporalExtent.next(moment.utc('2013-01-01T23:00:00.000Z'));
                expect(next.toISOString()).toEqual("2013-01-02T00:00:00.000Z");
            });

            it('returns undefined if crossing the day boundary but times not fetched for next day', function() {
                temporalExtent._createDay(moment.utc('2013-01-04T00:00:00.000Z'));
                temporalExtent.add(moment.utc('2013-01-05T00:00:00.000Z'));
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

            it('returns last time of previous day if crossing the day boundary', function() {
                var previous = temporalExtent.previous(moment.utc('2013-01-02T00:00:00.000Z'));
                expect(previous.toISOString()).toEqual("2013-01-01T23:00:00.000Z");
            });

            it('returns undefined if crossing the day boundary but times not fetched for previous day', function() {
                temporalExtent._createDay(moment.utc('2013-01-04T00:00:00.000Z'));
                temporalExtent.add(moment.utc('2013-01-05T00:00:00.000Z'));
                var previous = temporalExtent.previous(moment.utc('2013-01-05T00:00:00.000Z'));
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

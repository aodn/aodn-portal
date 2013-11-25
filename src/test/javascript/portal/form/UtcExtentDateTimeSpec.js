/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.form.UtcExtentDateTime", function() {

    var utcDateTime;
    var temporalExtent;

    beforeEach(function() {
        temporalExtent = new Portal.visualise.animations.TemporalExtent();
        utcDateTime = new Portal.form.UtcExtentDateTime({
            dateFormat: 'Y-m-d',
            timeFormat: 'H:i \\U\\TC'
        });

        temporalExtent.parse(["2001-01-01T00:00:00.000Z/2001-01-12T00:00:00.000Z/PT30M", "2001-01-20T01:00:00.000Z"]);
        utcDateTime.setExtent(temporalExtent);
    });

    describe('setting the extent', function() {
        it('sets the date field min value to the date values of the extent min', function() {
            var expected = temporalExtent.min().startOf('day').toDate();
            expect(utcDateTime.df.minValue.getFullYear()).toEqual(expected.getFullYear());
            expect(utcDateTime.df.minValue.getMonth()).toEqual(expected.getMonth());
            expect(utcDateTime.df.minValue.getDate()).toEqual(expected.getDate());
        });

        it('sets the date field time values to zero', function() {
            expect(utcDateTime.df.minValue.getHours()).toEqual(0);
            expect(utcDateTime.df.minValue.getMinutes()).toEqual(0);
            expect(utcDateTime.df.minValue.getSeconds()).toEqual(0);
            expect(utcDateTime.df.minValue.getMilliseconds()).toEqual(0);
        });

        it('sets the time field min value to the first utc time value for the date', function() {
            var expected = temporalExtent.min().toDate();
            expect(utcDateTime.tf.minValue.getHours()).toEqual(expected.getUTCHours());
            expect(utcDateTime.tf.minValue.getMinutes()).toEqual(expected.getUTCMinutes());
            expect(utcDateTime.tf.minValue.getSeconds()).toEqual(expected.getUTCSeconds());
            expect(utcDateTime.tf.minValue.getMilliseconds()).toEqual(expected.getUTCMilliseconds());
        });

        it('sets the time field max value to the last utc time value for the date', function() {
            var extentForDate = temporalExtent.subExtentForDate(temporalExtent.min());
            var expected = extentForDate.max().toDate();
            expect(utcDateTime.tf.maxValue.getHours()).toEqual(expected.getUTCHours());
            expect(utcDateTime.tf.maxValue.getMinutes()).toEqual(expected.getUTCMinutes());
            expect(utcDateTime.tf.maxValue.getSeconds()).toEqual(expected.getUTCSeconds());
            expect(utcDateTime.tf.maxValue.getMilliseconds()).toEqual(expected.getUTCMilliseconds());
        });
    });

    describe('setting the value', function() {
        it('sets the date field value to the date', function() {
            utcDateTime.setValue(temporalExtent.max());

            var expected = temporalExtent.max().toDate();
            expect(utcDateTime.df.maxValue.getFullYear()).toEqual(expected.getFullYear());
            expect(utcDateTime.df.maxValue.getMonth()).toEqual(expected.getMonth());
            expect(utcDateTime.df.maxValue.getDate()).toEqual(20);
        });

        it('sets the time field value to the earliest time for the date', function() {
            utcDateTime.setValue(temporalExtent.min());

            var expected = temporalExtent.min().toDate();
            expect(utcDateTime.tf.minValue.getHours()).toEqual(expected.getUTCHours());
            expect(utcDateTime.tf.minValue.getMinutes()).toEqual(expected.getUTCMinutes());
            expect(utcDateTime.tf.minValue.getSeconds()).toEqual(expected.getUTCSeconds());
            expect(utcDateTime.tf.minValue.getMilliseconds()).toEqual(expected.getUTCMilliseconds());
        });

        it('sets the time field value to the max time for the date', function() {
            var subExtent = temporalExtent.subExtentForDate(temporalExtent.extent[30]);
            utcDateTime.setValue(subExtent.min(), true);

            var expected = subExtent.max().format('HH:mm UTC');
            expect(utcDateTime.tf.getValue()).toEqual(expected);
        });
    });

    describe('getting the value', function() {
        it('the value as integers should be utc', function() {
            utcDateTime.setValue(temporalExtent.max());

            var expected = temporalExtent.max().toDate();
            expect(utcDateTime.getValue().getFullYear()).toEqual(expected.getFullYear());
            expect(utcDateTime.getValue().getMonth()).toEqual(expected.getMonth());
            expect(utcDateTime.getValue().getDate()).toEqual(expected.getDate());
            expect(utcDateTime.getValue().getDate()).toEqual(20);
            expect(utcDateTime.getValue().getHours()).toEqual(expected.getHours());
            expect(utcDateTime.getValue().getMinutes()).toEqual(expected.getMinutes());
            expect(utcDateTime.getValue().getSeconds()).toEqual(expected.getSeconds());
            expect(utcDateTime.getValue().getMilliseconds()).toEqual(expected.getMilliseconds());
        });
    });

    describe('reset', function() {
        it('it calls the date field reset', function() {
            spyOn(utcDateTime.df, 'reset');
            utcDateTime.reset();
            expect(utcDateTime.df.reset).toHaveBeenCalled();
        });

        it('it calls the time field reset', function() {
            spyOn(utcDateTime.tf, 'reset');
            utcDateTime.reset();
            expect(utcDateTime.tf.reset).toHaveBeenCalled();
        });
    });

});

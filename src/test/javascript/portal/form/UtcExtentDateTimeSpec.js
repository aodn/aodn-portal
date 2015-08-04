

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
            var subExtent = temporalExtent.subExtentForDate(temporalExtent.max());
            utcDateTime.setValue(subExtent.min(), true);

            var expected = subExtent.max().format(OpenLayers.i18n('timeDisplayFormat'));
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

    describe('getUtcDateFromLocalValues', function() {

        var validDate = new Date();
        beforeEach(function() {
            spyOn(utcDateTime.dateValue, 'getTime').andReturn(validDate);
        });

        it('empty string passed, return last valid time', function() {
            expect(utcDateTime.getUtcDateFromLocalValues("").toString()).toEqual(validDate.toString());
        });

        it('valid date passed, return given date as UTC', function() {
            var anotherValidDate = new Date(0);
            // getTimezoneOffset() returns offset in minutes, convert to milli
            var timeOffsetMilli = anotherValidDate.getTimezoneOffset() * 60 * 1000;
            var expectedUTCTime = anotherValidDate.getUTCTime() - timeOffsetMilli;

            var UTCTime = utcDateTime.getUtcDateFromLocalValues(anotherValidDate).getUTCTime();

            expect(UTCTime).toEqual(expectedUTCTime);
        });
    });

    describe('onBlur', function() {

        var matchTime;

        beforeEach(function() {
            matchTime = {getTime: function(){return '13:00'}};
            spyOn(utcDateTime, '_matchTime').andReturn(matchTime);
            spyOn(utcDateTime, '_fireEventsForChange');
        });

        it('no change events when times are not "dirty"', function() {

            spyOn(utcDateTime.dateValue, 'getTime').andReturn('13:00');

            utcDateTime.onBlur(utcDateTime.df);
            expect(utcDateTime._fireEventsForChange).not.toHaveBeenCalled();
        });

        it('change events fired when times are "dirty"', function() {

            spyOn(utcDateTime.dateValue, 'getTime').andReturn('14:00');

            utcDateTime.onBlur(utcDateTime.df);
            expect(utcDateTime._fireEventsForChange).toHaveBeenCalledWith(matchTime);
        });
    });
});

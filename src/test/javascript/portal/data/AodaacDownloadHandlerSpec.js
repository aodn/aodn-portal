/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.AodaacDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.AodaacDownloadHandler({
            name: 131 // An AODAAC Product ID
        });
    });

    describe('getDownloadOptions', function() {

        it('has one valid option', function() {

            var options = handler.getDownloadOptions();

            expect(options.length).toBe(1);

            var option = options[0];

            expect(option.textKey).toBeNonEmptyString();
            expect(typeof option.handler).toBe('function');
            expect(option.handlerParams.asyncDownload).toBe(true);
            expect(option.handlerParams.collectEmailAddress).toBe(true);
        });

        it('has no options when missing required information', function() {

            handler.onlineResource.name = "";

            var options = handler.getDownloadOptions();

            expect(options.length).toBe(0);
        });
    });

    describe('the click handler', function() {

        var clickHandler;
        var testCollection;
        var testHandlerParams;
        var url;

        beforeEach(function() {

            clickHandler = handler._getClickHandler();

            testCollection = {
                ncwmsParams: {
                    dateRangeStart: moment('2000-01-01T01:01:01'),
                    dateRangeEnd: moment('2014-12-23T23:59:59'),
                    latitudeRangeStart: -42,
                    latitudeRangeEnd: -20,
                    longitudeRangeStart: 160,
                    longitudeRangeEnd: 170
                }
            };
            testHandlerParams = {
                emailAddress: 'bob@example.com'
            };

            url = clickHandler(testCollection, testHandlerParams);
        });

        it('builds the correct URL', function() {

            expect(url).toStartWith('aodaac/createJob?');
            expect(url).toHaveParameterWithValue('dateRangeStart', '2000-01-01T01:01:01.000Z');
            expect(url).toHaveParameterWithValue('dateRangeEnd', '2014-12-23T23:59:59.000Z');
            expect(url).toHaveParameterWithValue('latitudeRangeStart','-42');
            expect(url).toHaveParameterWithValue('latitudeRangeEnd', '-20');
            expect(url).toHaveParameterWithValue('longitudeRangeStart', '160');
            expect(url).toHaveParameterWithValue('longitudeRangeEnd', '170');
            expect(url).toHaveParameterWithValue('productId', '131');
            expect(url).toHaveParameterWithValue('outputFormat', 'nc');
            expect(url).toHaveParameterWithValue('notificationEmailAddress', 'bob@example.com');
        });

        it('builds the correct URL if no area is specified', function() {

            testCollection.ncwmsParams.latitudeRangeStart = undefined;
            testCollection.ncwmsParams.latitudeRangeEnd = undefined;
            testCollection.ncwmsParams.longitudeRangeStart = undefined;
            testCollection.ncwmsParams.longitudeRangeEnd = undefined;

            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toHaveParameterWithValue('latitudeRangeStart','-90');
            expect(url).toHaveParameterWithValue('latitudeRangeEnd', '90');
            expect(url).toHaveParameterWithValue('longitudeRangeStart', '0');
            expect(url).toHaveParameterWithValue('longitudeRangeEnd', '180');
        });
    });
});



describe('Portal.cart.GogoduckDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.GogoduckDownloadHandler({
            href: 'geoserver_url',
            name: 'layer_name'
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

        it('has no options when missing required href information', function() {

            handler.onlineResource.href = "";
            var options = handler.getDownloadOptions();
            expect(options.length).toBe(0);
        });

        it('has no options when missing required name information', function() {

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
        var expectedUrlStart;
        var json;

        beforeEach(function() {

            clickHandler = handler._getUrlGeneratorFunction();
            expectedUrlStart = handler.getAsyncDownloadUrl('gogoduck');

            testCollection = {
                getFilters: returns([
                    {
                        isNcwmsParams: true,
                        dateRangeStart: moment.utc('2000-01-01T01:01:01'),
                        dateRangeEnd: moment.utc('2014-12-23T23:59:59'),
                        latitudeRangeStart: -42,
                        latitudeRangeEnd: -20,
                        longitudeRangeStart: 160,
                        longitudeRangeEnd: 170
                    },
                    {
                        type: Portal.filter.DateFilter,
                        comment: 'Should be safely ignored for URL building'
                    }
                ])
            };
            testHandlerParams = {
                emailAddress: 'bob@example.com'
            };

            url = clickHandler(testCollection, testHandlerParams);

            json = jsonFromUrl(url, expectedUrlStart);
        });

        it('builds the correct URL', function() {

            expect(url).toStartWith(expectedUrlStart);

            expect(json.layerName).toBe('layer_name');
            expect(json.emailAddress).toBe('bob@example.com');
            expect(json.geoserver).toBe('geoserver_url');

            var temporalExtent = json.subsetDescriptor.temporalExtent;

            expect(temporalExtent.start).toBe('2000-01-01T01:01:01.000Z');
            expect(temporalExtent.end).toBe('2014-12-23T23:59:59.000Z');

            var spatialExtent = json.subsetDescriptor.spatialExtent;

            expect(spatialExtent.north).toBe(-20);
            expect(spatialExtent.south).toBe(-42);
            expect(spatialExtent.east).toBe(170);
            expect(spatialExtent.west).toBe(160);
        });

        it('builds the correct URL if no area is specified', function() {
            testCollection.getFilters = returns([{
                isNcwmsParams: true,
                dateRangeStart: moment.utc('2000-01-01T01:01:01'),
                dateRangeEnd: moment.utc('2014-12-23T23:59:59')
            }]);

            url = clickHandler(testCollection, testHandlerParams);
            json = jsonFromUrl(url, expectedUrlStart);

            var spatialExtent = json.subsetDescriptor.spatialExtent;

            expect(spatialExtent.north).toBe(90);
            expect(spatialExtent.south).toBe(-90);
            expect(spatialExtent.east).toBe(180);
            expect(spatialExtent.west).toBe(-180);
        });

        it('builds the correct URL is no dates are specified', function() {
            testCollection.getFilters = returns([{
                isNcwmsParams: true,
                latitudeRangeStart: -42,
                latitudeRangeEnd: -20,
                longitudeRangeStart: 160,
                longitudeRangeEnd: 170
            }]);

            url = clickHandler(testCollection, testHandlerParams);
            json = jsonFromUrl(url, expectedUrlStart);

            var temporalExtent = json.subsetDescriptor.temporalExtent;
            expect(temporalExtent.start).toBe('1900-01-01T00:00:00.000Z');
            expect(temporalExtent.end).toBe(handler._formatDate(handler.DEFAULT_DATE_END).toString());
        });
    });
});

describe('Portal.cart.PointCSVDownloadHandler', function () {
    var handler;
    var timeSeriesInTimeRangeFilters;
    var timeSeriesAtPointFilter;
    var noTemporalFilter;

    beforeEach(function() {
        handler = new Portal.cart.PointCSVDownloadHandler({
            href: 'geoserver_url',
            name: 'layer_name'
        });

        var temporalFilter = {
            isNcwmsParams: true,
            name: OpenLayers.i18n('ncwmsDateParamsFilter'),
            dateRangeStart: moment.utc('2000-01-01T01:01:01'),
            dateRangeEnd: moment.utc('2014-12-23T23:59:59')
        };

        noTemporalFilter = {
            isNcwmsParams: true,
            name: OpenLayers.i18n('ncwmsDateParamsFilter')
        };

        timeSeriesAtPointFilter = new Portal.filter.PointFilter({
            name: 'timeSeriesAtPoint',
            value: {
                latitude: -24.523,
                longitude: 114.8735
            }
        });

        timeSeriesInTimeRangeFilters = [temporalFilter, timeSeriesAtPointFilter];
    });

    describe('getDownloadOptions', function() {
        it('has one valid option', function() {
            var options = handler.getDownloadOptions(timeSeriesInTimeRangeFilters);

            expect(options.length).toBe(1);

            var option = options[0];

            expect(option.textKey).toEqual('downloadAsPointTimeSeriesCsvLabel');
            expect(typeof option.handler).toBe('function');
            expect(option.handlerParams.asyncDownload).toBe(true);
            expect(option.handlerParams.collectEmailAddress).toBe(true);
        });

        it('has no options when missing required href information', function() {
            handler.onlineResource.href = "";
            var options = handler.getDownloadOptions(timeSeriesInTimeRangeFilters);
            expect(options.length).toBe(0);
        });

        it('has no options when missing required name information', function() {
            handler.onlineResource.name = "";
            var options = handler.getDownloadOptions(timeSeriesInTimeRangeFilters);
            expect(options.length).toBe(0);
        });
    });

    describe('the click handler', function() {

        var clickHandler;
        var testCollection;
        var testHandlerParams;
        var url;

        beforeEach(function() {

            clickHandler = handler._getUrlGeneratorFunction();

            testCollection = {
                getFilters: returns(timeSeriesInTimeRangeFilters)
            };
            testHandlerParams = {
                emailAddress: 'bob@example.com'
            };
        });

        it('builds the correct URL', function() {
            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toStartWith(handler.getAsyncDownloadUrl('wps'));
            expect(url).toHaveParameterWithValue('server', 'geoserver_url');
            expect(url).toHaveParameterWithValue('email.to', 'bob@example.com');
            expect(url).toHaveParameterWithValue('jobType', 'GoGoDuck');
            expect(url).toHaveParameterWithValue('jobParameters.layer', 'layer_name');
            expect(url).toHaveParameterWithValue(
                'jobParameters.subset',
                'TIME,2000-01-01T01:01:01.000Z,2014-12-23T23:59:59.000Z;' +
                'LATITUDE,-24.523,-24.523;' +
                'LONGITUDE,114.8735,114.8735'
            );
        });

        it('builds the correct URL if no dates are specified', function() {
            testCollection.getFilters = returns([timeSeriesAtPointFilter, noTemporalFilter]);

            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toHaveParameterWithValue(
                'jobParameters.subset',
                'TIME,1900-01-01T00:00:00.000Z,' + handler._formatDate(handler.DEFAULT_DATE_END).toString() + ';' +
                'LATITUDE,-24.523,-24.523;' +
                'LONGITUDE,114.8735,114.8735'
            );
        });
    });
});

describe('Portal.cart.GogoduckDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        Portal.app.appConfig.gogoduck = {
            filenamePrepend: "minted"
        };

        handler = new Portal.cart.GogoduckDownloadHandler({
            href: 'geoserver_url',
            name: 'layer_name'
        });
    });

    describe('getDownloadOptions', function() {

        it('has one valid option', function() {

            var options = handler.getDownloadOptions([]);

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

        beforeEach(function() {

            clickHandler = handler._getUrlGeneratorFunction();

            testCollection = {
                getFilters: returns([
                    {
                        isNcwmsParams: true,
                        name: OpenLayers.i18n("ncwmsDateParamsFilter"),
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
                'LATITUDE,-42.0,-20.0;' +
                'LONGITUDE,160.0,170.0'
            );

            var jsonUrl = jsonFromUrl(url);
            expect(jsonUrl['jobParameters.filename']).toStartWith( 'minted');

        });

        it('builds the correct URL if no area is specified', function() {
            testCollection.getFilters = returns([{
                isNcwmsParams: true,
                name: OpenLayers.i18n("ncwmsDateParamsFilter"),
                dateRangeStart: moment.utc('2000-01-01T01:01:01'),
                dateRangeEnd: moment.utc('2014-12-23T23:59:59')
            }]);

            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toHaveParameterWithValue(
                'jobParameters.subset',
                'TIME,2000-01-01T01:01:01.000Z,2014-12-23T23:59:59.000Z;' +
                'LATITUDE,-90.0,90.0;' +
                'LONGITUDE,-180.0,180.0'
            );
        });

        it('builds the correct URL is no dates are specified', function() {
            testCollection.getFilters = returns([{
                isNcwmsParams: true,
                name: OpenLayers.i18n("ncwmsDateParamsFilter"),
                latitudeRangeStart: 20,
                latitudeRangeEnd: 42,
                longitudeRangeStart: -170,
                longitudeRangeEnd: -160
            }]);

            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toHaveParameterWithValue(
                'jobParameters.subset',
                'TIME,1900-01-01T00:00:00.000Z,' + handler._formatDate(handler.DEFAULT_DATE_END).toString() + ';' +
                'LATITUDE,20.0,42.0;' +
                'LONGITUDE,-170.0,-160.0'
            );
        });

        it('builds the correct URL with no temporal extent', function() {

            testCollection = {
                getFilters: returns([
                    {
                        isNcwmsParams: true,
                        name: OpenLayers.i18n("ncwmsDateParamsFilter"),
                        latitudeRangeStart: 20,
                        latitudeRangeEnd: 42,
                        longitudeRangeStart: -170,
                        longitudeRangeEnd: -160
                    }
                ]),
                layerAdapter: {
                    layerSelectionModel: {
                        selectedLayer: {
                            temporalExtent: {
                                extent: {}
                            }
                        }
                    }
                }
            };

            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toHaveParameterWithValue(
                'jobParameters.subset',
                'LATITUDE,20.0,42.0;' +
                'LONGITUDE,-170.0,-160.0'
            );

        });
    });
});

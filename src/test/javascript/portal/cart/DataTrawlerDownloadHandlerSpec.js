describe('Portal.cart.DataTrawlerDownloadHandler', function () {
    var handler;

    beforeEach(function() {
        handler = new Portal.cart.DataTrawlerDownloadHandler({
            href: 'dt_endpoint_url',
            name: 'ctd'
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
                getTitle: returns('ala_title'),
                getFilters: returns([
                    {
                        label: 'Bounding Box',
                        type: 'geometrypropertytype',
                        visualised: true,
                        name: 'position',
                        hasValue: returns(true),
                        getFormattedFilterValue: returns({
                            wkt: 'POLYGON((108.2373046875 -27.73046875,108.2373046875 -23.951171875,116.8505859375 -23.951171875,116.8505859375 -27.73046875,108.2373046875 -27.73046875))'
                        }),
                        value: {
                            bounds: {
                                left: 108.2373046875,
                                right: 116.8505859375,
                                bottom: -27.73046875,
                                top: -23.951171875
                            }
                        }
                    },
                    {
                        label: 'Time Range',
                        type: 'datetime',
                        visualised: true,
                        hasValue: returns(true),
                        name: 'dateTime',
                        getFormattedFilterValue: returns({
                            fromDate: '2017-05-02T00:00:00.000Z',
                            toDate: '2018-08-30T23:59:59.999Z'
                        }),
                        dateRangeStart: moment.utc('2017-05-02T00:00:00'),
                        dateRangeEnd: moment.utc('2018-08-30T23:59:59')
                    }
                ])
            };
            testHandlerParams = {
                emailAddress: 'bob@example.com'
            };
        });

        it('builds the correct URL', function() {
            url = clickHandler(testCollection, testHandlerParams);

            expect(url).toStartWith(handler.getAsyncDownloadUrl('datatrawler'));
            expect(urlParamPresent(url, 'server', encodeURIComponent('dt_endpoint_url'))).toBeTruthy();
            expect(urlParamPresent(url, 'data_type', encodeURIComponent('ctd'))).toBeTruthy();
            expect(urlParamPresent(url, 'email_address', 'bob@example.com')).toBeTruthy();
            expect(urlParamPresent(url, 'date_format', encodeURIComponent('dd-mmm-yyyy HH24:mm:ss'))).toBeTruthy();
        });
    });

    describe('_formatFilterRequest', function() {

    });

    function urlParamPresent(urlToTest, key, value) {
        var formattedUrl = decodeURIComponent("&" + urlToTest.replace(/\?/g, '&') + "&");
        var searchValue = String.format("{0}={1}", key, value);
        return formattedUrl.indexOf(searchValue) >= 0;
    }
});

describe('Portal.cart.AlaDownloadHandler', function () {
    var handler;

    beforeEach(function() {
        handler = new Portal.cart.AlaDownloadHandler({
            href: 'ala_endpoint_url',
            name: 'ala_layer_name'
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
                        getCql: returns({
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
                        label: 'Filter by species/taxon',
                        type: 'alastringarray',
                        visualised: true,
                        hasValue: returns(true),
                        getCql: returns({
                            Q: 'urn:lsid:biodiversity.org.au:afd.taxon:91923901-bfe6-4cf5-b9a1-310284f5c90b'
                        }),
                        name: 'Q',
                        value: {
                            guid: 'urn:lsid:biodiversity.org.au:afd.taxon:91923901-bfe6-4cf5-b9a1-310284f5c90b'
                        }
                    },
                    {
                        label: 'Time Range',
                        type: 'datetime',
                        visualised: true,
                        hasValue: returns(true),
                        name: 'dateTime',
                        getCql: returns({
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

            expect(url).toStartWith(handler.getAsyncDownloadUrl('ala'));
            expect(urlParamPresent(url, 'server', encodeURIComponent('ala_endpoint_url'))).toBeTruthy();
            expect(urlParamPresent(url, 'file', encodeURIComponent('ala_title'))).toBeTruthy();
            expect(urlParamPresent(url, 'email', 'bob@example.com')).toBeTruthy();
            expect(urlParamPresent(url, 'wkt', encodeURIComponent('POLYGON((108.2373046875 -27.73046875,108.2373046875 -23.951171875,116.8505859375 -23.951171875,116.8505859375 -27.73046875,108.2373046875 -27.73046875))'))).toBeTruthy();
        });
    });

    function urlParamPresent(urlToTest, key, value) {
        var formattedUrl = decodeURIComponent("&" + urlToTest.replace(/\?/g, '&') + "&");
        var searchValue = String.format("{0}={1}", key, value);
        return formattedUrl.indexOf(searchValue) >= 0;
    }
});

describe('Portal.cart.WpsDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.WpsDownloadHandler({
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
            expectedUrlStart = handler.getAsyncDownloadUrl('wps');

            testCollection = {

                getFilters: returns([
                    {
                        constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                        isVisualised: returns(true),
                        hasValue: returns(true),
                        getCql: returns("Geometry Cql")
                    },
                    {
                        isVisualised: returns(false), // Not visualised
                        hasValue: returns(true)
                    },
                    {
                        visualised: true,
                        isVisualised: returns(true),
                        hasValue: returns(true),
                        getCql: returns("Salinity Cql")
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

            expect(json.typeName).toBe('layer_name');
            expect(json.emailAddress).toBe('bob@example.com');
            expect(json.url).toBe('geoserver_url');
            expect(json.cqlFilter).toBe('Geometry Cql AND Salinity Cql');
        });
    });

});

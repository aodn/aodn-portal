
describe('Portal.cart.AsyncDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.AsyncDownloadHandler({
            href: 'geoserver_url',
            name: 'layer_name'
        });
    });

    describe('serviceResponseHandler', function() {
        it('invalid json', function() {
            var json = "HERE BE INAVLID JSON";
            expect(handler.serviceResponseHandler(json)).toEqual({ userMsg : OpenLayers.i18n("unexpectedDownloadResponse"), status : 404 });
        });

        it('no url', function() {
            var json = "{}";
            expect(handler.serviceResponseHandler(json)).toEqual({ userMsg : OpenLayers.i18n("unexpectedDownloadResponse"), status : 404 });
        });

        it('valid url', function() {
            var obj = {
                responseText: JSON.stringify({
                    url: "http://asyncdownloads.aodn.org.au"
                })
            };
            var expected = {
                responseText : '{"url":"http://asyncdownloads.aodn.org.au"}',
                userMsg : "<a class='external' target='_blank' href='http://asyncdownloads.aodn.org.au'>Follow the progress of your job</a><br /><br />"
            };

            expect(handler.serviceResponseHandler(obj)).toMatch(expected);
        });
    });
});

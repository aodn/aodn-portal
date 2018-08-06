
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
            expect(handler.serviceResponseHandler(json)).toEqual("");
        });

        it('no url', function() {
            var json = "{}";
            expect(handler.serviceResponseHandler(json)).toEqual("");
        });

        it('valid url', function() {
            var json = '{ "url": "http://asyncdownloads.aodn.org.au" }';
            expect(handler.serviceResponseHandler(json)).toMatch("href='http://asyncdownloads.aodn.org.au'");
        });
    });
});


describe('Portal.cart.GaDownloadHandler', function () {

    var handler;

    beforeEach(function() {

        handler = new Portal.cart.GaDownloadHandler({
            href: 'ga_url',
            name: 'layer_name'
        });
    });

    describe('serviceResponseHandler', function() {
/*        it('invalid json', function() {
            var json = "HERE BE INAVLID JSON";
            expect(handler.serviceResponseHandler(json)).toEqual({ userMsg : OpenLayers.i18n("unexpectedDownloadResponse"), status : "munt" });
        });
*/
        it('no url', function() {
            var json = "{}";
            expect(handler.serviceResponseHandler(json)).toEqual({ userMsg : OpenLayers.i18n("unexpectedDownloadResponse"), status : 404 });
        });


        it('not valid', function() {
            var typicalStatus = 200;
            var obj = {
                status: typicalStatus,
                responseText: "some giberish"
            };
            expect(handler.parseResponse(obj).status).not.toEqual(typicalStatus);
        });

        it('not valid', function() {
            var obj = {
                status: 404,
                responseText: JSON.stringify({
                    url: "http://asyncdownloads.aodn.org.au"
                })
            };
            expect(handler.parseResponse(obj)).toEqual(obj);
        });


        it('valid current response', function() {
            var obj = {
                status: 200,
                responseText: JSON.stringify({
                    status: "OK",
                    reason: "Its not an error cause i say"
                })
            };
            var expected = {
                status: 200,
                responseText: '{"status":"OK","reason":"Its not an error cause i say"}'
            };

            expect(handler.parseResponse(obj)).toEqual(expected);
        });

        it('not valid', function() {
            var obj = {
                status: 200,
                responseText: JSON.stringify({
                    status: "error",
                    reason: "Its an error even though i send you 200"
                })
            };
            var expected = {
                status: 404,
                responseText: '{"status":"error","reason":"Its an error even though i send you 200"}',
                userMsg : '<p>Unable to create subsetting job. Please re-check the parameters you provided and try again.</p> <p><b>Download Server Message:</b>  &#39;<i>Its an error even though i send you 200</i>&#39;</p>'
            };

            expect(handler.parseResponse(obj)).toEqual(expected);
        });
    });
});

describe("Portal.util.Proxy", function() {

    it('proxy requests enabled', function() {
        var url = "http://geoserver-123.aodn.org.au/geoserver/wms?LAYER=cake";
        var proxiedUrl = Portal.utils.Proxy.proxy(url);
        expect(proxiedUrl).toBe("proxy?url=http%3A%2F%2Fgeoserver-123.aodn.org.au%2Fgeoserver%2Fwms%3FLAYER%3Dcake");
    });
});

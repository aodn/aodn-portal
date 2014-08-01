/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.util.Proxy", function() {

    it('proxy requests disabled', function() {
        Portal.app.appConfig.proxyWmsRequests = false;

        var url = "http://geoserver-123.aodn.org.au/geoserver/wms?LAYER=cake";
        var proxiedUrl = Portal.utils.Proxy.proxy(url);
        expect(proxiedUrl).toBe("http://geoserver-123.aodn.org.au/geoserver/wms?LAYER=cake");
    });

    it('proxy requests enabled', function() {
        Portal.app.appConfig.proxyWmsRequests = true;

        var url = "http://geoserver-123.aodn.org.au/geoserver/wms?LAYER=cake";
        var proxiedUrl = Portal.utils.Proxy.proxy(url);
        expect(proxiedUrl).toBe("proxy?url=http%3A%2F%2Fgeoserver-123.aodn.org.au%2Fgeoserver%2Fwms%3FLAYER%3Dcake");
    });
});

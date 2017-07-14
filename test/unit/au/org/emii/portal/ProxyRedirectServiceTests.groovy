package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class ProxyRedirectServiceTests extends GrailsUnitTestCase {

    def proxyRedirectService

    @Override
    void setUp() {
        super.setUp();

        proxyRedirectService = new ProxyRedirectService()

        proxyRedirectService.grailsApplication = [
            config: [
                proxyRedirects: [
                    [
                        uri        : 'http://mywms-server.aodn.org.au/geoserver',
                        redirectUri: 'http://geowebcache.localnet/service'
                    ]
                ]
            ]
        ]
    }

    void testNotRedirectedWithoutCql() {

        String url = 'http://mywms-server.aodn.org.au/geoserver'
        String newUrl = proxyRedirectService.getRedirectedUrl(url)
        assertEquals url, newUrl
    }

    void testNotRedirectedWrongServer() {

        String url = 'http://another-mywms-server.aodn.org.au/geoserver'  +
            'LAYERS=imos%3Aargo_profile_map&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&' +
            'EXCEPTIONS=application%2Fvnd.ogc.se_xml&SERVICE=WMS&REQUEST=GetMap&STYLES=&' +
            'QUERYABLE=true&SRS=EPSG%3A4326&' +
            'CQL_FILTER=juld%20%3C%3D%20\'2017-05-02T23%3A59%3A59.999Z\'&' +
            'BBOX=135,-45,157.5,-22.5&WIDTH=256&HEIGHT=256'

        String newUrl = proxyRedirectService.getRedirectedUrl(url)
        assertEquals url, newUrl
    }

    void testRedirectedWithCql() {

        String url = 'http://mywms-server.aodn.org.au/geoserver/wms?' +
            'LAYERS=imos%3Aargo_profile_map&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&' +
            'EXCEPTIONS=application%2Fvnd.ogc.se_xml&SERVICE=WMS&REQUEST=GetMap&STYLES=&' +
            'QUERYABLE=true&SRS=EPSG%3A4326&' +
            'CQL_FILTER=juld%20%3C%3D%20\'2017-05-02T23%3A59%3A59.999Z\'&' +
            'BBOX=135,-45,157.5,-22.5&WIDTH=256&HEIGHT=256'
        String newUrl = proxyRedirectService.getRedirectedUrl(url)
        assert newUrl.contains('http://geowebcache.localnet/service');
    }
}


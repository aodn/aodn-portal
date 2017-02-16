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
                        uri: 'http://mywms-server.aodn.org.au/geoserver',
                        redirectUri: 'http://geowebcache.localnet/service'
                    ]
                ]
            ]
        ]
    }

    void testRedirected() {

        String url = 'http://mywms-server.aodn.org.au/geoserver'
        String newUrl = proxyRedirectService.getRedirectedUrl(url)
        assertEquals 'http://geowebcache.localnet/service', newUrl 
    }

    void testNotRedirected() {

        String url = 'http://another-mywms-server.aodn.org.au/geoserver'
        String newUrl = proxyRedirectService.getRedirectedUrl(url)
        assertEquals url, newUrl 
    }
}


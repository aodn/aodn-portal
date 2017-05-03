package au.org.emii.portal


class ProxyRedirectService {

    def grailsApplication

    def getRedirectedUrl = { String url ->

        def proxyRedirects = grailsApplication.config.proxyRedirects

        proxyRedirects.each {
            if (!url.contains('CQL_FILTER')) {
                url = url.replace(it.uri, it.redirectUri)
            }
        }

        url
    }
}

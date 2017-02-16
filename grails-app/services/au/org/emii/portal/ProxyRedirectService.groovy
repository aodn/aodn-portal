package au.org.emii.portal


class ProxyRedirectService {

    def grailsApplication

    def getRedirectedUrl = { String url ->

        def proxyRedirects = grailsApplication.config.proxyRedirects

        proxyRedirects.each {
            url = url.replace(it.uri, it.redirectUri)
        }

        url
    }
}

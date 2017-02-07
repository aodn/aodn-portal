package au.org.emii.portal

class SitemapController {

    def sitemapService

    def index = {
        render (contentType: "text/plain", text: sitemapService.getUuidsAsTxt())
    }
}

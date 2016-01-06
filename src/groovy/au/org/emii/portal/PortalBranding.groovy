package au.org.emii.portal

class PortalBranding {

    def grailsApplication

    def fetchUrl(url) {
        try {
            return new URL(url).text
        }
        catch (Exception e) {
            return null
        }
    }

    def returnBrandedUrlIfValid(urlSuffix, alternativeValue, returnUrlContent = false) {
        def url = "${grailsApplication.config.portal.brandingBase}/${urlSuffix}"
        def returnValue = alternativeValue

        if (grailsApplication.config.portal.brandingBase) {
            def contentOfUrl = fetchUrl(url)

            if (null != contentOfUrl) {
                if (returnUrlContent) {
                    returnValue = contentOfUrl
                }
                else {
                    returnValue = url
                }
            }
        }

        return returnValue
    }

    def getLandingPage() {
        return returnBrandedUrlIfValid(
            "landing.html",
            null
        )
    }

    def getLogoImage() {
        return returnBrandedUrlIfValid(
            "logo.png",
            grailsApplication.config.portal.logo
        )
    }

    def getSecondaryLogoImage() {
        return returnBrandedUrlIfValid(
            "secondaryLogo.png",
            grailsApplication.config.portal.secondaryLogo
        )
    }

    def getSiteHeader() {
        return returnBrandedUrlIfValid(
            "siteHeader",
            grailsApplication.config.portal.siteHeader,
            true
        )
    }

    def getFooterContent() {
        return returnBrandedUrlIfValid(
            "footerContent.html",
            grailsApplication.config.portal.footerContent,
            true
        )
    }

    def getCss() {
        return returnBrandedUrlIfValid(
            "overrides.css",
            "",
            true
        )
    }

    def getMotdUrl() {
        if (grailsApplication.config.portal.brandingBase) {
            return "${grailsApplication.config.portal.brandingBase}/motd"
        }
        else {
            return grailsApplication.config.portal.motdUrl
        }
    }
}

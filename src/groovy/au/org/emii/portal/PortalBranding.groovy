/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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

    def returnBrandedUrlIfValid(url, alternativeValue, returnUrlContent = false) {
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
            "${grailsApplication.config.portal.brandingBase}/landing.html",
            null
        )
    }

    def getLogoImage() {
        return returnBrandedUrlIfValid(
            "${grailsApplication.config.portal.brandingBase}/logo.png",
            grailsApplication.config.portal.logo
        )
    }

    def getSiteHeader() {
        return returnBrandedUrlIfValid(
            "${grailsApplication.config.portal.brandingBase}/siteHeader",
            grailsApplication.config.portal.siteHeader,
            true
        )
    }

    def getExternalLinksHtml() {
        return returnBrandedUrlIfValid(
            "${grailsApplication.config.portal.brandingBase}/externalLinks.html",
            grailsApplication.config.portal.footer.externalLinksHtml,
            true
        )
    }
}

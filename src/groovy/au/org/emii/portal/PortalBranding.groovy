/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class PortalBranding {

    def grailsApplication

    def isUrlValid(url) {
        try {
            new URL(url).text
            return true
        }
        catch (Exception e) {
            return false
        }
    }

    def getSiteHeader() {
        def siteHeader = grailsApplication.config.portal.siteHeader

        def siteHeaderUrl = "${grailsApplication.config.portal.brandingBase}/siteHeader"

        if (grailsApplication.config.portal.brandingBase) {
            if (isUrlValid(siteHeaderUrl)) {
                siteHeader = new URL(siteHeaderUrl).text
            }
        }

        return siteHeader
    }

    def getLandingPage() {
        def landingPage = 'landing'

        def brandedLandingPage = "${grailsApplication.config.portal.brandingBase}/landing.html"

        if (grailsApplication.config.portal.brandingBase) {
            if (isUrlValid(brandedLandingPage)) {
                landingPage = brandedLandingPage
            }
        }

        return landingPage
    }

    def getLogoImage() {
        def logoImage = "images/${grailsApplication.config.portal.instance.name}_logo.png"

        def brandedLogoImage = "${grailsApplication.config.portal.brandingBase}/logo.png"

        if (grailsApplication.config.portal.brandingBase) {
            if (isUrlValid(brandedLogoImage)) {
                logoImage = brandedLogoImage
            }
        }

        return logoImage
    }

    def getExternalLinksHtml() {
        def externalLinksHtml = grailsApplication.config.portal.footer.externalLinksHtml

        def brandedExternalLinksHtml = "${grailsApplication.config.portal.brandingBase}/externalLinks.html"

        if (grailsApplication.config.portal.brandingBase) {
            if (isUrlValid(brandedExternalLinksHtml)) {
                externalLinksHtml = new URL(brandedExternalLinksHtml).text
            }
        }

        return externalLinksHtml
    }
}

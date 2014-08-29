/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class PortalBranding {

    def grailsApplication

    def getLandingPage() {
        def landingPage = 'landing'
        if (grailsApplication.config.portal.brandingBase) {
                landingPage = "${grailsApplication.config.portal.brandingBase}/landing.html"
        }

        return landingPage
    }

    def getLogoImage() {
        def logoImage = "images/${grailsApplication.config.portal.instance.name}_logo.png"
        if (grailsApplication.config.portal.brandingBase) {
            logoImage = "${grailsApplication.config.portal.brandingBase}/logo.png"
        }

        return logoImage
    }

    def getExternalLinksHtml() {
        def externalLinksHtml = grailsApplication.config.portal.footer.externalLinksHtml
        if (grailsApplication.config.portal.brandingBase) {
            def externalLinksUrl = "${grailsApplication.config.portal.brandingBase}/externalLinks.html"
            externalLinksHtml = new URL(externalLinksUrl).text
        }

        return externalLinksHtml
    }
}

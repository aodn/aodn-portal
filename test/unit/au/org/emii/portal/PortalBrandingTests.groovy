package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class PortalBrandingTests extends GrailsUnitTestCase {

    def portalBranding

    protected void setUp() {
        super.setUp()
        portalBranding = new PortalBranding()

        portalBranding.metaClass.fetchUrl = { url ->
            if ("isBranded/validBrandedUrl" == url) {
                println url
                return "some url content"
            }
            else {
                return null
            }
        }

        portalBranding.grailsApplication = new ConfigObject()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testBrandedUrlAccessibleReturnContent() {
        portalBranding.grailsApplication.config.portal.brandingBase = "isBranded"
        assertEquals(
            "some url content",
            portalBranding.returnBrandedUrlIfValid("validBrandedUrl", "nonBrandedValue", true)
        )
    }

    void testBrandedUrlAccessibleWhenBranded() {
        portalBranding.grailsApplication.config.portal.brandingBase = "isBranded"
        assertEquals(
            "isBranded/validBrandedUrl",
            portalBranding.returnBrandedUrlIfValid("validBrandedUrl", "nonBrandedValue", false)
        )
    }

    void testBrandedUrlInaccessibleWhenBranded() {
        portalBranding.grailsApplication.config.portal.brandingBase = "isBranded"
        assertEquals(
            "nonBrandedValue",
            portalBranding.returnBrandedUrlIfValid("invalidBrandedUrl", "nonBrandedValue", false)
        )
    }

    void testBrandedUrlAccessibleWhenNotBranded() {
        assertEquals(
            "nonBrandedValue",
            portalBranding.returnBrandedUrlIfValid("validBrandedUrl", "nonBrandedValue", false)
        )
    }

    void testBrandedUrlInaccessibleWhenNotBranded() {
        assertEquals(
            "nonBrandedValue",
            portalBranding.returnBrandedUrlIfValid("invalidBrandedUrl", "nonBrandedValue", false)
        )
    }
}

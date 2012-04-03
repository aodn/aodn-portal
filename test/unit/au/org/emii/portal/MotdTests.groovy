package au.org.emii.portal

import grails.test.*

class MotdTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testToString() {
		def testMotd = new Motd(motdTitle : "title")
		assertEquals "title", testMotd.toString()
    }
}

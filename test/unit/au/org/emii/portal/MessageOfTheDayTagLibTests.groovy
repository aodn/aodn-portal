package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class MessageOfTheDayTagLibTests extends GrailsUnitTestCase {

    def messageOfTheDayTagLib

    protected void setUp() {
        super.setUp()

        messageOfTheDayTagLib = new MessageOfTheDayTagLib()
        messageOfTheDayTagLib.grailsApplication = new ConfigObject()
    }

    void testMotdMapEmpty() {
        def motd

        motd = messageOfTheDayTagLib.toMotdMap("")
        assertEquals null, motd

        motd = messageOfTheDayTagLib.toMotdMap(null)
        assertEquals null, motd
    }

    void testMotdMapValid() {
        def motdRaw = "this is a title\nthis is the message\nand another line"
        def motd = messageOfTheDayTagLib.toMotdMap(motdRaw)
        assertEquals "this is a title", motd.title
        assertEquals "this is the message\nand another line", motd.msg
    }

    void testMotdMapOneLiner() {
        def motdRaw = "this is the message\n"
        def motd = messageOfTheDayTagLib.toMotdMap(motdRaw)
        assertEquals motdRaw, motd.msg
    }
}

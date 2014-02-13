package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class ConfigTests extends GrailsUnitTestCase {

    def today = new Date()
    def yesterday = today - 1
    def dayBeforeYesterday = yesterday - 1
    def tomorrow = today + 1
    def dayAfterTomorrow = tomorrow + 1

    def motd = [:] as Motd
    Config config

    @Override
    void setUp() {
        super.setUp()

        config = new Config(enableMOTD: true, motd: motd, motdStart: yesterday, motdEnd: tomorrow)
    }

    void testShowMotd() {

        assertTrue config.hasCurrentMotd()
    }

    void testShowMotdNoMotd() {

        config.motd = null

        assertFalse config.hasCurrentMotd()
    }

    void testShowMotdNotEnabled() {

        config.enableMOTD = false

        assertFalse config.hasCurrentMotd()
    }

    void testShowMotdTimeRangeInPast() {

        config.motdStart = dayBeforeYesterday
        config.motdEnd = yesterday

        assertFalse config.hasCurrentMotd()
    }

    void testShowMotdTimeRangeInFuture() {

        config.motdStart = tomorrow
        config.motdEnd = dayAfterTomorrow

        assertFalse config.hasCurrentMotd()
    }
}

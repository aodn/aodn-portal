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

        assertTrue config.showMotd()
    }

    void testShowMotdNoMotd() {

        config.motd = null

        assertFalse config.showMotd()
    }

    void testShowMotdNotEnabled() {

        config.enableMOTD = false

        assertFalse config.showMotd()
    }

    void testShowMotdTimeRangeInPast() {

        config.motdStart = dayBeforeYesterday
        config.motdEnd = yesterday

        assertFalse config.showMotd()
    }

    void testShowMotdTimeRangeInFuture() {

        config.motdStart = tomorrow
        config.motdEnd = dayAfterTomorrow

        assertFalse config.showMotd()
    }
}

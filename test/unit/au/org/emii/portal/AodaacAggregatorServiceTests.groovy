/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class AodaacAggregatorServiceTests extends GrailsUnitTestCase {

    def aodaacAggregatorService

    protected void setUp() {

        super.setUp()

        aodaacAggregatorService = new AodaacAggregatorService()
    }
}

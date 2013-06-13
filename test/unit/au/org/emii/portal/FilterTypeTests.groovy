
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

import static au.org.emii.portal.FilterType.typeFromString

class FilterTypeTests extends GrailsUnitTestCase {

	protected void setUp() {

		super.setUp()
	}

	protected void tearDown() {

		super.tearDown()
	}

	void testTypeFromString() {

		FilterType.stringTypeMapping = [ "monkey": FilterType.Number ]

		assertEquals FilterType.BoundingBox, typeFromString( "geoMEtryMonkey" )
		assertEquals FilterType.BoundingBox, typeFromString( "multilineMonkey" )
		assertEquals FilterType.Number, typeFromString( "MONKEY" )
		assertEquals null, typeFromString( "orangutan" )
	}
}

/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

import static au.org.emii.portal.FilterType.BoundingBox
import static au.org.emii.portal.FilterType.typeFromString

class FilterTypeTests extends GrailsUnitTestCase {

    protected void setUp() {

        super.setUp()
    }

    protected void tearDown() {

        super.tearDown()
    }

    void testTypeFromString() {

        def testCases = [
            ["String", FilterType.String],
            ["DATE", FilterType.Date],
            ["datetime", FilterType.Date],
            ["douBLe", FilterType.Number],
            ["float", FilterType.Number],
            ["integer", FilterType.Number],
            ["INT", FilterType.Number],
            ["long", FilterType.Number],
            ["SHORT", FilterType.Number],
            ["Decimal", FilterType.Number],
            ["BOOLEAN", FilterType.Boolean],
            ["PointPropertyType", BoundingBox],
            ["geometrypropertytype", BoundingBox],
            ["multilinepropertytype", BoundingBox],
            ["surfacepropertytype", BoundingBox],
            ["otherThing", null]
        ]

        testCases.each{ testCase ->

            def input = testCase[0]
            def expected = testCase[1]

            assertEquals "$input -> $expected", expected, typeFromString(input)
        }
    }
}

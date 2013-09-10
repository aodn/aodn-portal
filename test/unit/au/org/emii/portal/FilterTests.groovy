
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class FilterTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testToJsonStringFilter(){
        def server1 = new Server(id: 1)
        def layer1 = new Layer(id: 3, server: server1)

        def filter1 = new Filter(name: "vesselName", type: FilterType.String, label: "Vessel Name", possibleValues: ["ship3", "ship2", "ship1"], layer: layer1, enabled: true)

        def expected = [:]
        expected["label"] = "Vessel Name"
        expected["type"] = FilterType.String
	    expected["name"] = "vesselName"
	    expected["layerId"] = 3
        expected["enabled"] = true
	    expected["possibleValues"] = ["ship1", "ship2", "ship3"]

        assertEquals expected.toString(), filter1.toLayerData().toString()
    }

	void testToJsonNumberFilter(){
		def server1 = new Server(id: 1)
		def layer1 = new Layer(id: 1, server: server1)

		def filter1 = new Filter(name: "voyage_number", type: FilterType.Number, label: "Voyage Number", possibleValues: ["1", "2"], layer: layer1)

		def expected = [:]
		expected["label"] = "Voyage Number"
		expected["type"] = FilterType.Number
		expected["name"] = "voyage_number"
		expected["layerId"] = 1
		expected["enabled"] = false
		expected["possibleValues"] = []

		assertEquals expected.toString(), filter1.toLayerData().toString()
	}
}

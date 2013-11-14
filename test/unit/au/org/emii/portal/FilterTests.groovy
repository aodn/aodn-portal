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

        def filter1 = new Filter(name: "vesselName",  wmsStartDateName: "start_date", wmsEndDateName: "end_date", type: FilterType.String, label: "Vessel Name", possibleValues: ["ship3", "ship2", "ship1"], layer: layer1, enabled: true, downloadOnly: true)

        def expected = [:]
        expected["label"] = "Vessel Name"
        expected["type"] = FilterType.String
        expected["name"] = "vesselName"
        expected["wmsStartDateName"] = "start_date"
        expected["wmsEndDateName"] = "end_date"
        expected["layerId"] = 3
        expected["enabled"] = true
        expected["possibleValues"] = ["ship1", "ship2", "ship3"]
        expected["downloadOnly"] = true

        assertEquals expected.toString(), filter1.toLayerData().toString()
    }

    void testToJsonNumberFilter(){
        def server1 = new Server(id: 1)
        def layer1 = new Layer(id: 1, server: server1)

        def filter1 = new Filter(name: "voyage_number",  wmsStartDateName: "start_date", wmsEndDateName: "end_date",  type: FilterType.Number, label: "Voyage Number", possibleValues: ["1", "2"], layer: layer1, downloadOnly: false)

        def expected = [:]
        expected["label"] = "Voyage Number"
        expected["type"] = FilterType.Number
        expected["name"] = "voyage_number"
        expected["wmsStartDateName"] = "start_date"
        expected["wmsEndDateName"] = "end_date"
        expected["layerId"] = 1
        expected["enabled"] = false
        expected["possibleValues"] = []
        expected["downloadOnly"] = false

        assertEquals expected.toString(), filter1.toLayerData().toString()
    }
}

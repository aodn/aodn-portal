
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class FilterControllerTests extends ControllerUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testDelete() {
        def server1 = new Server()
        server1.id = 1

        def layer1 = new Layer()
        layer1.id = 3
        layer1.server = server1

        def filter1 = new Filter(name: "vesselName", type: FilterType.String, label: "Vessel Name", possibleValues: ["ship1", "ship2", "ship3"], layer: layer1)
        def filter2 = new Filter(name: "sensorType", type:  FilterType.String, label: "Sensor Type", possibleValues: ["ship1", "ship2", "ship3"], layer:  layer1)

        layer1.filters = [filter1, filter2]

        mockDomain(Server, [server1])
        mockDomain(Layer, [layer1])
        mockDomain(Filter, [filter1, filter2])

        println "Before delete"
        println layer1.filters

        filter1.delete(failOnError: true)

        println "After delete"
        println layer1.filters

        assertEquals 1, layer1.filters.size()
        assertEquals 1, Filter.list().size()
    }
}

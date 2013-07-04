
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class FilterControllerIntegrationTests extends ControllerUnitTestCase{

	def filterController

    protected void setUp() {

        super.setUp()

	    filterController = new FilterController()
    }

    def testFindLayerWith() {

	    // Code needs to handle invalid state (More than 1 layer with activeInLastScan = true) - https://github.com/aodn/aodn-portal/issues/236

	    Server server = Server.build(uri: "http://someserver.com/path", owners: []).save()
	    Layer activeLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername1", cql: null, activeInLastScan: true).save()
	    Layer inactiveLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername2", cql: null, activeInLastScan: false).save()
	    Layer.build(parent: null, server: server, namespace: "imos", name: "layername1", cql: null, activeInLastScan: true).save() // Create invalid db state

	    assertEquals activeLayer, filterController._findLayerWith(server.uri, activeLayer.name)
	    assertEquals null, filterController._findLayerWith(server.uri, inactiveLayer.name)
    }
}


/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.*

class LayerIntegrationTests extends DummySetup {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
		
        super.tearDown()
    }

	// Test for #1746.
    void testDeleteSnapshottedLayer() {
		//		JsonMarshallingRegistrar.registerJsonMarshallers()
		setupConfig()
		
		Server server = Server.build()
		server.save(failOnError: true)
		
		Layer layer = Layer.build(server: server)
		layer.metaClass.deleteDefaultLayersInConfig = {}
		
		layer.save(failOnError: true)

		Snapshot snapshot = Snapshot.build(minX: 0.0, minY: 0.0, maxX: 1.0, maxY: 1.0)
		SnapshotLayer snapshotLayer = SnapshotLayer.build(layer: layer, snapshot: snapshot)
		
		snapshot.save(failOnError: true)
		snapshotLayer.save(failOnError: true)
		
		try
		{
			layer.delete(failOnError: true, flush: true)
		}
		catch (Exception e)
		{
			fail("Unexpected error: " + e.message)
		}
    }
}

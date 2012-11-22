
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.*

class LayerControllerIntegrationTests extends GroovyTestCase 
{
	def layerController
	
    protected void setUp() 
	{
        super.setUp()
		
		layerController = new LayerController()
    }

    protected void tearDown() 
	{
        super.tearDown()
    }

	// #1761
    void testNoDuplicatesInLayerAsJson() 
	{
		// Create
		Server server = Server.build(uri: "http://someserver.com/path", owners:  [])
		server.save()
		
		Layer activeLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: true)
		activeLayer.save()
		
		Layer inactiveLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: false)
		inactiveLayer.save()
		
		try
		{
			layerController.params.serverUri = "http://someserver.com/path"
			layerController.params.name = "imos:layername"
			layerController.findLayerAsJson()
			
			assertEquals(200, layerController.response.status)
		}
		catch (Exception e)
		{
			fail("Unexpected failure: " + e.message)
		}
		finally
		{
			server.delete()
		}
    }

	void testServer() {

		try {
			// Create
			Server server = Server.build(uri: "http://someserver.com/path", owners: [])
			server.save()

			Layer activeLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: true)
			activeLayer.save()

			def _server = Server.list()[0]
			layerController.params.server = _server.id
			layerController.server()
			assertEquals(200, layerController.response.status)
		}
		catch (e) {
			fail("Unexpected failure: " + e.message)
		}

	}
}

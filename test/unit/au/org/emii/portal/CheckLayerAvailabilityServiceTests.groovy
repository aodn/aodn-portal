package au.org.emii.portal

import org.springframework.mock.web.MockHttpServletRequest
import grails.test.*

class CheckLayerAvailabilityServiceTests extends GrailsUnitTestCase {
	
	
	def service
	
    protected void setUp() {
        super.setUp()
		service = new CheckLayerAvailabilityService()
		mockDomain(Layer)
		mockDomain(Server)
    }

    protected void tearDown() {
        super.tearDown()
    }
	void testGetLayerDetailsUnknownId() {
		
		
		assertNull(service._getLayerDetails("67"))
		
		
	}
	void testGetLayerDetailsKnownId() {
		
		Server server = new Server(uri: "something1", shortAcron: "sa1", id: 1, type:"WMS-1.1.1", scanFrequency: 100,
		name: "something1name", disable: false, opacity: 100, imageFormat: "image/gif",	allowDiscoveries:true)
		server.save(failOnError: true)
		assertNotNull(server.id)
		
		Layer layer = new Layer(server: server, dataSource: "hello mum")
		layer.save(failOnError: true)
		assertNotNull(layer.id)
		
		def res = service._getLayerDetails(layer.id as String)
		
		assertEquals(layer, res.layer)
		assertEquals(server, res.server)
		
		//assertNull(service._getLayerDetails("67"))
		
		/*mockDomain(Layer, [new Layer(id:67)])
		mockDomain(Server)	
		
		
		def Server server = new Server(uri: "something1", shortAcron: "sa1", id: 1, type:"WMS-1.1.1", scanFrequency: 100,
		name: "something1name", disable: false, opacity: 100, imageFormat: "image/gif",
		allowDiscoveries:true)
		server.save(failOnError: true,flush:true)

		
		


		
		assertEquals("67", checkLayerAvailabilityService._getLayerDetails("67"))
		*/
		
	}


}

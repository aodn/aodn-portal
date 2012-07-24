package au.org.emii.portal.display

import au.org.emii.portal.Layer;
import au.org.emii.portal.Server;
import grails.test.*

class LayerPresenterTests extends GrailsUnitTestCase {
    
	def childLayerFilter = {
		def value = !it.blacklisted && it.activeInLastScan
		println "value $value"
		return value
	}
	
	def server = new Server(id: 1, name: "Mocked Server")
	
	protected void setUp() {
		super.setUp()
		
		Layer.metaClass.getLayers = { [] }
    }

    protected void tearDown() {
        super.tearDown()
		Layer.metaClass = null
    }

    void testCanCreateLayerPresenter() {
		def layer = new LayerPresenter(new Layer(blacklisted: false, activeInLastScan: true, server: server), childLayerFilter)
    }
	
	void testFailsCreatingLayerPresenter() {
		try {
			def layer = new LayerPresenter(new Layer(blacklisted: true, activeInLastScan: true, server: server), childLayerFilter)
			fail
		}
		catch (IllegalArgumentException e) {
			
		}
	}
	
	void testNoFilterAppliedDoesNotFail() {
		def layer = new LayerPresenter(new Layer(blacklisted: false, activeInLastScan: true, server: server))
	}
	
	void testListFiltering() {
		def layersToFilter = []
		def layers = LayerPresenter.filter(layersToFilter, childLayerFilter)
		assertEquals([], layers) 
	}
	
	void testListFilteringExcludes() {
		def excludeMe = new Layer(id: 1, blacklisted: true, activeInLastScan: true, server: server)
		def excludeMeToo = new Layer(id: 2, blacklisted: false, activeInLastScan: false, server: server)
		def includeMe = new Layer(id: 3, blacklisted: false, activeInLastScan: true, server: server)
		def layersToFilter = [excludeMe, includeMe, excludeMeToo]
		
		def layers = LayerPresenter.filter(layersToFilter, childLayerFilter)
		
		def ids = layers.collect { it.id }
		
		assertFalse ids.contains(excludeMe.id)
		assertFalse ids.contains(excludeMeToo.id)
		assertTrue ids.contains(includeMe.id)
	}
	
	void testDescendentFiltering() {
		def parent = new Layer(id: 1, blacklisted: false, activeInLastScan: true, server: server)
		def childLayers = [
			new Layer(id: 2, blacklisted: false, activeInLastScan: false, server: server), 
			new Layer(id: 3, blacklisted: false, activeInLastScan: true, server: server), 
			new Layer(id: 4, blacklisted: true, activeInLastScan: true, server: server)
		]
		
		parent.metaClass.getLayers = { return childLayers }
		
		def presentedLayer = new LayerPresenter(parent, childLayerFilter)
		assertTrue presentedLayer.layers.size() == 1
		
		def childrenIds = presentedLayer.layers.collect { it.id }
		assertTrue childrenIds.contains(3l)
	}
}

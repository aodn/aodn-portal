package au.org.emii.portal.display

import au.org.emii.portal.Layer;
import grails.test.*

class LayerPresenterTests extends GrailsUnitTestCase {
    
	def childLayerFilter = {
		def value = !it.blacklisted && it.activeInLastScan
		println "value $value"
		return value
	}
	
	protected void setUp() {
		super.setUp()
		
		Layer.metaClass.getLayers = { [] }
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testCanCreateLayerPresenter() {
		def layer = new LayerPresenter(new Layer(blacklisted: false, activeInLastScan: true), childLayerFilter)
    }
	
	void testFailsCreatingLayerPresenter() {
		try {
			def layer = new LayerPresenter(new Layer(blacklisted: true, activeInLastScan: true), childLayerFilter)
			fail
		}
		catch (IllegalArgumentException e) {
			
		}
	}
	
	void testNoFilterAppliedDoesNotFail() {
		def layer = new LayerPresenter(new Layer(blacklisted: false, activeInLastScan: true))
	}
	
	void testListFiltering() {
		def layersToFilter = []
		def layers = LayerPresenter.filter(layersToFilter, childLayerFilter)
		assertEquals([], layers) 
	}
	
	void testListFilteringExcludes() {
		def excludeMe = new Layer(id: 1, blacklisted: true, activeInLastScan: true)
		def excludeMeToo = new Layer(id: 2, blacklisted: false, activeInLastScan: false)
		def includeMe = new Layer(id: 3, blacklisted: false, activeInLastScan: true)
		def layersToFilter = [excludeMe, includeMe, excludeMeToo]
		
		def layers = LayerPresenter.filter(layersToFilter, childLayerFilter)
		
		def ids = layers.collect { it.id }
		
		assertFalse ids.contains(excludeMe.id)
		assertFalse ids.contains(excludeMeToo.id)
		assertTrue ids.contains(includeMe.id)
	}
	
	void testDescendentFiltering() {
		def parent = new Layer(id: 1, blacklisted: false, activeInLastScan: true)
		def childLayers = [new Layer(id: 2, blacklisted: false, activeInLastScan: false), new Layer(id: 3, blacklisted: false, activeInLastScan: true), new Layer(id: 4, blacklisted: true, activeInLastScan: true)]
		
		parent.metaClass.getLayers = { return childLayers }
		
		def presentedLayer = new LayerPresenter(parent, childLayerFilter)
		assertTrue presentedLayer.layers.size() == 1
		
		def childrenIds = presentedLayer.layers.collect { it.id }
		assertTrue childrenIds.contains(3l)
	}
}

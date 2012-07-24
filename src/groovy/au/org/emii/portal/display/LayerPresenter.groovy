package au.org.emii.portal.display

class LayerPresenter {
	
	def id
	def name
	def title
	def blacklisted
	def activeInLastScan
	def layers
	def server
	
	LayerPresenter(domainLayer) {
		this(domainLayer, { return true })
	}
	
	LayerPresenter(domainLayer, childLayerFilter) {
		assert childLayerFilter != null : "childLayerFilter should not be null"
		
		if (!childLayerFilter(domainLayer)) {
			throw new IllegalArgumentException("Layer does not meet its own standard for presentation")
		}
		
		id = domainLayer.id
		name = domainLayer.name
		title = domainLayer.title
		blacklisted = domainLayer.blacklisted
		activeInLastScan = domainLayer.activeInLastScan
		server = new ServerPresenter(domainLayer.server)
		layers = LayerPresenter.filter(domainLayer.layers, childLayerFilter)
	}
	
	static def filter(layersToFilter, childLayerFilter) {
		return layersToFilter.grep(childLayerFilter).collect { new LayerPresenter(it, childLayerFilter) }
	}
}

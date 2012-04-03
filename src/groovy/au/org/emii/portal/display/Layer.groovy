package au.org.emii.portal.display

class Layer {
	
	def id
	def name
	def title
	def blacklisted
	def activeInLastScan

	Layer(domainLayer) {
		id = domainLayer.id
		name = domainLayer.name
		title = domainLayer.title
		blacklisted = domainLayer.blacklisted
		activeInLastScan = domainLayer.activeInLastScan
	}
}

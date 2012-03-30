package au.org.emii.portal.display

class MenuItem {
	
	def leaf
	def text
	def childItems
	def layer
	def server

	MenuItem(domainMenuItem) {
		leaf = domainMenuItem.leaf
		text = domainMenuItem.text
		childItems = []
		
		_initLayer(domainMenuItem.layer)
		_initServer(domainMenuItem.server)
		_initChildItems(domainMenuItem.childItems)
	}
	
	def _initChildItems(domainChildItems) {
		domainChildItems.each { childDomainItem ->
			childItems << new MenuItem(childDomainItem)
		}
	}
	
	def _initLayer(domainLayer) {
		if (domainLayer) {
			layer = new Layer(domainLayer)
		}
	}
	
	def _initServer(domainServer) {
		if (domainServer) {
			server = new Server(domainServer)
		}
	}
}

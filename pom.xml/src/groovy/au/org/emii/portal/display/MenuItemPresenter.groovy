package au.org.emii.portal.display

class MenuItemPresenter {
	
	def leaf
	def text
	def childItems
	def layer
	def server

	MenuItemPresenter(domainMenuItem) {
		leaf = domainMenuItem.leaf
		text = domainMenuItem.text
		childItems = []
		
		_initLayer(domainMenuItem.layer)
		_initServer(domainMenuItem.server)
		_initChildItems(domainMenuItem.childItems)
	}
	
	def _initChildItems(domainChildItems) {
		domainChildItems.each { childDomainItem ->
			childItems << new MenuItemPresenter(childDomainItem)
		}
	}
	
	def _initLayer(domainLayer) {
		if (domainLayer) {
			layer = new LayerPresenter(domainLayer)
		}
	}
	
	def _initServer(domainServer) {
		if (domainServer) {
			server = new ServerPresenter(domainServer)
		}
	}
}

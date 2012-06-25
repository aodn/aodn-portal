package au.org.emii.portal.display

class Menu {
	
	def id
	def title
	def menuItems

	Menu(domainMenu) {
		if (domainMenu) {
			id = domainMenu.id
			title = domainMenu.title
			_initItems(domainMenu.menuItems)
		}
	}
	
	def _initItems(domainMenuItems) {
		menuItems = []
		domainMenuItems.each { domainMenuItem ->
			menuItems << new MenuItem(domainMenuItem)
		}
	}
}

package au.org.emii.portal.bootstrap.test.unit

//import au.org.emii.portal.bootstrap.MenuBootStrap;


import grails.test.GrailsUnitTestCase

class MenuBootStrapTests extends GrailsUnitTestCase {

	void testNothing() {
		// Need to use a ConfigSlurper to read the DataSource.groovy file and access the connection details
		// to inject a dataSource into menus to get this working, that or make it an integration test, until then
		// I have commented the class out
	}
    
//	protected void setUp() {
//        super.setUp()
//		Menu.metaClass.getServerIdsWithAvailableLayers = { [] }
//		Layer.metaClass.getLayers = { [] }
//		addConverters(au.org.emii.portal.display.MenuPresenter)
//		addConverters(au.org.emii.portal.display.MenuItemPresenter)
//		addConverters(au.org.emii.portal.display.LayerPresenter)
//
//		mockDomain(Config)
//    }
//
//    protected void tearDown() {
//        super.tearDown()
//		Layer.metaClass = null
//    }
//
//    void testNoDefaultMenuBootstrap() {
//		def cfg = _mockConfig()
//		new MenuBootStrap().init(null)
//    }
//
//	void testWithDefaultMenuBootstrap() {
//		def defaultMenu = _mockDefaultMenu()
//		def cfg = _mockConfig(defaultMenu: defaultMenu)
//
//		new MenuBootStrap().init(null)
//
//		assertNotNull(MenuJsonCache.instance().get(defaultMenu))
//	}
//
//	def _mockConfig(args) {
//		def cfg = new Config(args)
//		cfg.metaClass.validate = { true }
//		cfg.save(failOnError: true)
//		return cfg
//	}
//
//	def _mockDefaultMenu() {
//		def menu = new Menu()
//		menu.id = 1
//		menu.title = "Default Menu"
//		menu.active = true
//		menu.menuItems.addAll(_mockMenuItems())
//
//		return menu
//	}
//
//	def _mockMenuItems() {
//		def items = []
//
//		(1..10).each {
//			items << new MenuItem(
//				text: "Item $it",
//				leaf: true,
//				menuPosition: it,
//				layer: new Layer(id: it, name: "Layer $it", title: "Layer $it", blacklisted: false, activeInLastScan: true, server: new Server(id: 1, name: "menu tests mocked server"))
//			)
//		}
//
//		return items
//	}
	
	
}

package au.org.emii.portal.bootstrap.test.unit

import java.net.URL;
import java.util.SortedSet;

import au.org.emii.portal.Config;
import au.org.emii.portal.Layer;
import au.org.emii.portal.Menu;
import au.org.emii.portal.MenuItem;
import au.org.emii.portal.Server;
import au.org.emii.portal.bootstrap.MenuBootStrap;
import au.org.emii.portal.display.MenuJsonCache;
import grails.test.*

class MenuBootStrapTests extends GrailsUnitTestCase {
    
	protected void setUp() {
        super.setUp()
		Menu.metaClass.getServerIdsWithAvailableLayers = { [] }
		addConverters(au.org.emii.portal.display.Menu)
		addConverters(au.org.emii.portal.display.MenuItem)
		addConverters(au.org.emii.portal.display.Layer)
		
		mockDomain(Config)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testNoDefaultMenuBootstrap() {
		def cfg = _mockConfig()
		new MenuBootStrap().init(null)
    }
	
	void testWithDefaultMenuBootstrap() {
		def defaultMenu = _mockDefaultMenu()
		def cfg = _mockConfig(defaultMenu: defaultMenu)
		
		new MenuBootStrap().init(null)
		
		assertNotNull(MenuJsonCache.instance().get(defaultMenu))
	}
	
	def _mockConfig(args) {
		def cfg = new Config(args)
		cfg.metaClass.validate = { true }
		cfg.save(failOnError: true)
		return cfg
	}
	
	def _mockDefaultMenu() {
		def menu = new Menu()
		menu.id = 1
		menu.title = "Default Menu"
		menu.active = true
		menu.menuItems.addAll(_mockMenuItems())
		
		return menu
	}
	
	def _mockMenuItems() {
		def items = []
		
		(1..10).each {
			items << new MenuItem(
				text: "Item $it", 
				leaf: true, 
				menuPosition: it, 
				layer: new Layer(id: it, name: "Layer $it", title: "Layer $it", blacklisted: false, activeInLastScan: true)
			)
		}
		
		return items
	}
	
	
}

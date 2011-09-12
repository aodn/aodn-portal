package au.org.emii.portal

import grails.test.*

class ConfigImplTests extends GrailsUnitTestCase {
	
	def redirectParams
	
    protected void setUp() {
        super.setUp()
		redirectParams = [ : ]
		ConfigController.metaClass.redirect = { Map args -> redirectParams = args  }
    }

    protected void tearDown() {
        super.tearDown()
		def remove = GroovySystem.metaClassRegistry.&removeMetaClass
		remove ConfigController
    }

	void testIndexRedirect() {
		ConfigController cc = new ConfigController()
		cc.index()
		assertEquals "edit" , redirectParams.action
	}
	
    void testSomething() {

    }
}

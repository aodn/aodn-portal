package au.org.emii.portal

import grails.test.*

class MenuTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {

		def menu1 = new Menu(title : "menu1");
		mockForConstraintsTests(Menu, [menu1])
		
		def testMenu = new Menu()
		assertFalse testMenu.validate()
		assertEquals "nullable", testMenu.errors["title"]
		assertEquals "nullable", testMenu.errors["json"]
		assertEquals "nullable", testMenu.errors["active"]
		assertEquals "nullable", testMenu.errors["editDate"]
		
		testMenu = new Menu(title : "menu1")
		assertFalse testMenu.validate()
		assertEquals "unique", testMenu.errors["title"]

		testMenu = new Menu(title : "")
		assertFalse testMenu.validate()
		assertEquals "blank", testMenu.errors["title"]
		
		testMenu = new Menu(title : "01234567890123456789012345678901234567890")
		assertFalse testMenu.validate()
		assertEquals "maxSize", testMenu.errors["title"]
    }
	
	void testToString()
	{
		def testMenu = new Menu(title : "menu1")
		assertEquals "menu1", testMenu.toString()
	}
}

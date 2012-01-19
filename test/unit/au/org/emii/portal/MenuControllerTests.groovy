package au.org.emii.portal

import grails.test.*

class MenuControllerTests extends ControllerUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testSetActiveFail() {
		this.controller.params.id = 10
		def mockMenu = new Menu(id : 10, title : "title_text", json : "JSON", active : true, editDate : null)
		mockDomain(Menu, [mockMenu])
		this.controller.setActive()
		assertTrue this.controller.response.contentAsString.equals("ERROR: Problem saving the new state!")
    }
}

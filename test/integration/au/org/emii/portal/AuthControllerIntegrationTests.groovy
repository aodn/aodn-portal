package au.org.emii.portal

import org.apache.shiro.SecurityUtils

import grails.test.*

class AuthControllerIntegrationTests extends ControllerUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testCreateUserFromOpenIdUrl() {

        def adminId = new UserRole( name: UserRole.ADMINISTRATOR ) .save().id
        def selfRegisteredId = new UserRole( name: UserRole.SELFREGISTERED ) .save().id


        assertEquals 0, User.count()

        def firstInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/robertplant@y.com' )
        firstInstance.save()

        assertEquals 1, User.count()
        assertEquals 1, firstInstance.roles.size()
        assertNotNull firstInstance.roles.find { it.id == adminId }

        
        def secondInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/jimmypage@y.com' )
        secondInstance.save()

        assertEquals 2, User.count()
        assertEquals 1, secondInstance.roles.size()
        assertNotNull secondInstance.roles.find { it.id == selfRegisteredId  }

        // third instance should leave in the same state
        def thirdInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/jimmypage@y.com' )
        thirdInstance.save()

        assertEquals 2, User.count()
        assertEquals 1, thirdInstance.roles.size()
        assertNotNull thirdInstance.roles.find { it.id == selfRegisteredId  }

    }
}

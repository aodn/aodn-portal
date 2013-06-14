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

    void testFirstCreatedUserIsAdministrator() {

        def adminId = new UserRole( name: UserRole.ADMINISTRATOR ) .save().id

        assertEquals 0, User.count()

        def firstInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/robertplant@y.com' )
        firstInstance.save()

        assertEquals 1, User.count()
        assertEquals 1, firstInstance.roles.size()
        assertNotNull firstInstance.roles.find { it.id == adminId }
    }

    void testSecondCreatedUserIsNonPrivileged() {

        new UserRole( name: UserRole.ADMINISTRATOR ) .save()
        def selfRegisteredId = new UserRole( name: UserRole.SELFREGISTERED ) .save().id

        controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/robertplant@y.com' ).save()

        def secondInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/jimmypage@y.com' )
        secondInstance.save()

        assertEquals 2, User.count()
        assertEquals 1, secondInstance.roles.size()
        assertNotNull secondInstance.roles.find { it.id == selfRegisteredId  }
    }

    void testExistingUserIsRecognizedAndNonPrivileged() {

        new UserRole( name: UserRole.ADMINISTRATOR ) .save()
        def selfRegisteredId = new UserRole( name: UserRole.SELFREGISTERED ) .save().id

        controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/robertplant@y.com' ).save()

        def secondInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/jimmypage@y.com' )
        secondInstance.save()

        def thirdInstance = controller._createUserFromOpenIdUrl( 'https://devid.emii.org.au/jimmypage@y.com' )
        thirdInstance.save()

        assertEquals  secondInstance.id, thirdInstance.id
        assertEquals 2, User.count()
        assertEquals 1, thirdInstance.roles.size()
        assertNotNull thirdInstance.roles.find { it.id == selfRegisteredId  }
    }

}

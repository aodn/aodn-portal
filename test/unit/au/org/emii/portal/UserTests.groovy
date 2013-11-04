/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class UserTests extends GrailsUnitTestCase {

    def user

    protected void setUp() {

        super.setUp()

        mockDomain User

        user = new User(
            openIdUrl: "http://www.example.com/openId",
            emailAddress: "admin@utas.edu.au",
            fullName: "Joe Bloggs"
        )
    }

    protected void tearDown() {

        super.tearDown()
    }

    void testValidUser() {

        assertTrue "Validation should have succeeded (unchanged, valid instance)", user.validate()
    }

    void testToString() {

        assertEquals "Joe Bloggs [No Roles] (http://www.example.com/openId)", user.toString()

        user.addToRoles(new UserRole(name: "Role1"))

        assertEquals "Joe Bloggs [Roles: Role1] (http://www.example.com/openId)", user.toString()

        user.addToRoles(new UserRole(name: "Role2"))

        // Need to test either match as ordering of Roles is non-deterministic (as it is a Set)
        assertTrue user.toString() ==~ /Joe Bloggs \[Roles: (Role1, Role2|Role2, Role1)\] \(http:\/\/www\.example\.com\/openId\)/
    }
}

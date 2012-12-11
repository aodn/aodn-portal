/*
* Copyright 2012 IMOS
*
* The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
*
*/

package au.org.emii.portal

import grails.test.*
import org.apache.shiro.subject.*
import org.apache.shiro.SecurityUtils

class UserTagLibTests extends TagLibUnitTestCase {

    // Subjects
    def authdSubjectPrincipal = 1
    def authdSubject = [getPrincipal: { authdSubjectPrincipal },
            isAuthenticated: { true },
            hasRole: { true },
            toString: { return "authdSubject" },
            logout: { authdSubjectPrincipal = null }
    ] as Subject

    // Users
    def user1FullName = "Dan Brown"
    def user1 = new User(id: authdSubjectPrincipal, fullName: user1FullName)

    def user2 = new User(id: 2, fullName: "William Gates (III)")

    protected void setUp() {

        super.setUp()

        loadCodec org.codehaus.groovy.grails.plugins.codecs.HTMLCodec

        mockDomain User, [user1, user2]
        mockLogging UserTagLib
    }

    protected void tearDown() {

        super.tearDown()

        SecurityUtils.metaClass = null
    }

    void testLoggedInUser_NoUserLoggedIn_EmptyOutput() {

        // Ensure no-one is logged-in
        SecurityUtils.metaClass.static.getSubject = { return null }

        tagLib.loggedInUser(property: 'fullName') {}

        assertEquals "No logged-in User should return empty String", "", tagLib.out.toString()
    }

    void testLoggedInUser_ExistingPropertyRequested_RequestedPropertyOutput() {

        SecurityUtils.metaClass.static.getSubject = { authdSubject }

        tagLib.loggedInUser(property: 'fullName') {}

        assertEquals "Should return name of logged-in user", user1FullName, tagLib.out.toString()
    }

    // Currently no fields in User that can be empty/null
//    void testLoggedInUser_NonExistingPropertyRequested_EmptyOutput() {
//
//        SecurityUtils.metaClass.static.getSubject = { authdSubject }
//
//        tagLib.loggedInUser(property: 'someProperty') {}
//
//        assertEquals "Value of property lastName is blank in User. Tag should return empty String.", "", tagLib.out.toString()
//    }
}

package au.org.emii.portal

import grails.test.ControllerUnitTestCase
import org.apache.shiro.SecurityUtils

class AuthControllerTests extends ControllerUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testUnauthorized() {

        controller.unauthorized()
        assertEquals "home", redirectArgs.controller
        assertEquals null, redirectArgs.action
    }

    void testIndex() {

        controller.index()
        assertEquals "login", forwardArgs.action
        assertEquals null, forwardArgs.controller
    }

    void testLogin() {

        int count = 0

        controller.metaClass._authenticateWithOpenId = {
            params, register ->

                ++count

                assertEquals mockParams, params
                assertEquals false, register
        }

        controller.login()

        assertEquals 1, count
    }

    void testRegister() {

        int count = 0

        controller.metaClass._authenticateWithOpenId = {
            params, register ->

                ++count

                assertEquals mockParams, params
                assertEquals true, register
        }

        controller.register()

        assertEquals 1, count
    }

    void testSetRequestAttributes() {

        // create a stack which ensures that both order is correct and all values have been covered
        def st = new Stack()

        st.push(["c", 'http://axschema.org/namePerson', true])
        st.push(["b", 'http://axschema.org/namePerson/friendly', true])
        st.push(["a", 'http://axschema.org/contact/email', true])
        st.push(["lastname", "http://axschema.org/namePerson/last", true])
        st.push(["firstname", "http://axschema.org/namePerson/first", true])
        st.push(["ext1", "http://schema.openid.net/namePerson", true])
        st.push(["ext0", "http://schema.openid.net/contact/email", true])

        def c = [
            addAttribute: {
                key, url, required ->

                    def (expectedKey, expectedUrl, expectedRequired) = st.pop()

                    assertEquals expectedKey, key
                    assertEquals expectedUrl, url
                    assertEquals expectedRequired, required
            }
        ]

        controller._setRequestAttributes(c)

        assertTrue st.empty()
    }

    void testLoadOpenIDSchemaAttributeValues() {

        def userInstance = [:]
        def testFields
        def ext = [
            getAttributeValue: { testFields[it] }
        ]

        // using ext0 as key
        testFields = [
            'ext0': 'john@x.com',
        ]

        controller._loadOpenIDSchemaAttributeValues(ext, userInstance)
        assertEquals "john@x.com", userInstance.emailAddress

        // ext1
        testFields = [
            'ext1': 'john smith'
        ]

        controller._loadOpenIDSchemaAttributeValues(ext, userInstance)
        assertEquals "john smith", userInstance.fullName
    }

    void testLoadAxSchemaAttributeValues() {

        def userInstance = [:]
        def testFields
        def ext = [
            getAttributeValue: { testFields[it] }
        ]

        // using firstname and lastname keys
        testFields = [
            'firstname': 'fred',
            'lastname': 'nurk'
        ]

        controller._loadAxSchemaAttributeValues(ext, userInstance)
        assertEquals "fred nurk", userInstance.fullName

        // using nickname as key
        testFields = [
            'nickname': 'jess brown'
        ]

        controller._loadAxSchemaAttributeValues(ext, userInstance)
        assertEquals "jess brown", userInstance.fullName

        // using email as key
        testFields = [
            'email': 'fred@x.com'
        ]

        controller._loadAxSchemaAttributeValues(ext, userInstance)
        assertEquals "fred@x.com", userInstance.emailAddress
    }

    void testLoadAttributeValuesWithNull() {

        def userInstance = [:]
        def ext = [
            getAttributeValue: { a -> null }
        ]

        controller._loadAttributeValues(ext, userInstance)
        assertEquals "Unk.", userInstance.fullName
        assertEquals "Unk.", userInstance.emailAddress
    }

    void testLogUserIn() {
        def count = 0

        SecurityUtils.metaClass.static.getSubject = {
            [
                login: { arg -> ++count }
            ]
        }

        def userInstance = new User(openIdUrl: 'https://devid.emii.org.au/x@y.com')
        controller._logUserIn(userInstance)

        assertEquals 1, count
    }
}

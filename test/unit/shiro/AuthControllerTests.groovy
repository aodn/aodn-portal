package shiro

import grails.test.ControllerUnitTestCase
import org.apache.shiro.SecurityUtils
import org.apache.shiro.authc.*
import org.apache.shiro.subject.Subject
import org.apache.shiro.util.ThreadContext
import au.org.emii.portal.*

class AuthControllerTests extends ControllerUnitTestCase {

    protected void setUp() {

        super.setUp()

        // Mock controller methods
        controller.metaClass.message = { args -> return args.code }
        controller.metaClass.sendMail = { c -> }
    }

    protected void tearDown() {

        super.tearDown()

        SecurityUtils.metaClass = null
    }

    void testIndexAction() {

        controller.index()

        assertEquals 'login', redirectArgs.action
    }

    void testLoginAction() {

        // Mock domain for test
        Config firstConfig = new Config(name : "FirstConfig")
        Config secondConfig = new Config(name : "SecondConfig")
        mockDomain(Config, [firstConfig, secondConfig])

        def returnedMap

        // Call login with no params
        returnedMap = controller.login()

        assertEquals "Config instances should be first one in list", firstConfig, returnedMap.configInstance
        assertEquals "Username should be preserved", null, returnedMap.username
        assertEquals "TtargetUri should be preserved", null, returnedMap.targetUri

        // Set up params for next call
        mockParams.username = "un"
        mockParams.targetUri = 'http://www.google.com/'

        // Call again (not-null params)
        returnedMap = controller.login()

        assertEquals "Config instances should be first one in list", firstConfig, returnedMap.configInstance
        assertEquals "Username should be preserved", "un", returnedMap.username
        assertEquals "TtargetUri should be preserved", "http://www.google.com/", returnedMap.targetUri
    }

    void testSignInAction_NoCredentials() {

        // Subject info
        def anonSubjectPrincipal = null
        def anonSubject = [ getPrincipal: { anonSubjectPrincipal },
                toString: { return "anonSubject" },
                login: { SaltedUsernamePasswordToken token ->
                    if (token.username && token.username != "invalidusername") { // Remember usernames are lowercased before being added to the AuthenticationToken
                        anonSubjectPrincipal = token.username
                    }
                    else {
                        throw new AuthenticationException("No username provided (credentials treated as invalid)")
                    }
                }
        ] as Subject

        // Mock domain and message behaviour
        mockDomain Config
        controller.metaClass.message = { LinkedHashMap args -> return "${args.code}" }

        logInSubject anonSubject

        assertEquals "Subject principal should be null", null, SecurityUtils.getSubject().getPrincipal()

        // Test with no credentials
        controller.signIn()

        assertEquals "Should redirect to login", "login", redirectArgs.action
        assertEquals "Should have no params", [username: null], redirectArgs.params
        assertEquals "Subject principal should be null", null, SecurityUtils.getSubject().getPrincipal()
    }

    void testSignInAction_InvalidCredentials() {

        // Subject info
        def anonSubjectPrincipal = null
        def anonSubject = [ getPrincipal: { anonSubjectPrincipal },
                toString: { return "anonSubject" },
                login: { SaltedUsernamePasswordToken token ->
                    if (token.username && token.username != "invalidusername") { // Remember usernames are lowercased before being added to the AuthenticationToken
                        anonSubjectPrincipal = token.username
                    }
                    else {
                        throw new AuthenticationException("No username provided (credentials treated as invalid)")
                    }
                }
        ] as Subject

        // Current Subject
        logInSubject anonSubject

        mockDomain Config

        controller.metaClass.message = { LinkedHashMap args -> return "${args.code}" }

        // Set up invalid credentials
        mockParams.username = "invalidUsername"
        mockParams.password = "password"
        mockParams.targetUri = "http://www.google.com/"

        // test with wrong credentials
        controller.signIn()

        assertEquals "Should redirect to login", "login", redirectArgs.action
        assertEquals "Should have same username param", "invalidUsername", redirectArgs.params.username
        assertEquals "Should have null password param", null, redirectArgs.params.password
        assertEquals "Should have same targetUri param", "http://www.google.com/", redirectArgs.params.targetUri
        assertEquals "Subject principal should be null", null, SecurityUtils.getSubject().getPrincipal()
    }

    void testSignInAction_ValidCredentials() {

        // Subject info
        def anonSubjectPrincipal = null
        def anonSubject = [ getPrincipal: { anonSubjectPrincipal },
                toString: { return "anonSubject" },
                login: { SaltedUsernamePasswordToken token ->
                    if (token.username && token.username != "invalidusername") { // Remember usernames are lowercased before being added to the AuthenticationToken
                        anonSubjectPrincipal = token.username
                    }
                    else {
                        throw new AuthenticationException("No username provided (credentials treated as invalid)")
                    }
                }
        ] as Subject

        // Current Subject
        logInSubject anonSubject

        mockDomain Config

        // Set up valid credentials
        mockParams.username = "username"
        mockParams.password = "password"
        mockParams.targetUri = "http://www.google.com/"

        // Test with correct credentials
        controller.signIn()

        assertEquals "Should redirect to what was targetUri", "http://www.google.com/", redirectArgs.uri
        assertEquals "Subject principal should be 'username'", "username", SecurityUtils.getSubject().getPrincipal()
    }

    void testSignOutAction() {

        // Set up Subject info
        def authdSubjectPrincipal = "sys.admin@emii.org.au"
        def authdSubject = [ getPrincipal: { authdSubjectPrincipal },
                isAuthenticated: { true },
                hasRole: { true } ,
                toString: { return "authdSubject" },
                logout: { authdSubjectPrincipal = null }
        ] as Subject

        logInSubject authdSubject

        assertEquals "authdSubject should be logged-in", SecurityUtils.getSubject().getPrincipal(), "sys.admin@emii.org.au"

        controller.signOut()

        assertEquals "Subject principal should now be null", null, SecurityUtils.getSubject().getPrincipal()
        assertEquals "Should redirect back to home page", "/", redirectArgs.uri
    }

    void testUnauthorizedAction() {

        controller.unauthorized()

        assertEquals "You do not have permission to access this page.", controller.response.contentAsString
    }

    private logInSubject(Subject subject) {

        ThreadContext.put( ThreadContext.SECURITY_MANAGER_KEY,
                [ getSubject: { subject } ] as SecurityManager )

        SecurityUtils.metaClass.static.getSubject = { subject }
    }
}
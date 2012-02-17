package shiro

import grails.test.*
import au.org.emii.portal.*
import org.apache.shiro.crypto.hash.Sha256Hash
import org.apache.shiro.util.ThreadContext
import org.apache.shiro.SecurityUtils
import org.apache.shiro.subject.Subject
import org.apache.shiro.authc.*

class AuthControllerTests extends ControllerUnitTestCase {
    
    protected void setUp() {
        
        super.setUp()
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
                            login: { UsernamePasswordToken token ->
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
                            login: { UsernamePasswordToken token ->
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
                            login: { UsernamePasswordToken token ->
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
    
    void testRegisterAction() {

        // Mock domain for test
        Config firstConfig = new Config(name : "FirstConfig")
        Config secondConfig = new Config(name : "SecondConfig")
        mockDomain(Config, [firstConfig, secondConfig])
        mockForConstraintsTests(UserAccountCommand)
        
        // Call register action
        def returnedMap = controller.register()
        
        User emptyUser = new User()
        
        assertEquals "Config instances should be first one in list", firstConfig, returnedMap.configInstance
        assertEquals "UserAccountCommand emailAddress should be same as new User", emptyUser.emailAddress, returnedMap.userAccountCmd.emailAddress
        assertEquals "UserAccountCommand previousEmailAddress should be null", null, returnedMap.userAccountCmd.previousEmailAddress
        assertEquals "UserAccountCommand firstName should be same as new User", emptyUser.firstName, returnedMap.userAccountCmd.firstName
        assertEquals "UserAccountCommand lastName should be same as new User", emptyUser.lastName, returnedMap.userAccountCmd.lastName
    }
	
    void testCreateUserAction() {
        
        // Subject info
        def anonSubjectPrincipal = null
        def anonSubject = [ getPrincipal: { anonSubjectPrincipal },
                            toString: { return "anonSubject" },
                            login: { UsernamePasswordToken token ->
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
        
        // Roles
        UserRole selfRegisteredUser = new UserRole( name: "SelfRegisteredUser" )
        UserRole admin = new UserRole( name: "Admin" )
        
        // Mock Classes
        mockForConstraintsTests UserAccountCommand
        mockDomain User, []
        mockDomain UserRole, [selfRegisteredUser, admin]
        mockDomain Config
        
        // Mock out email methods that should not be run
        def authCtrlrMock = mockFor( AuthController ) // Mock AuthController behaviour
        authCtrlrMock.demand.static.sendRegistrationNotifcationEmail(0..1) { User user -> }
        
        // Create userAccountCommand for testing
        UserAccountCommand createAcctCmd = new UserAccountCommand(emailAddress: "admin@utas.edu.au",
                                                                  firstName: "Bob",
                                                                  lastName: "Brown",
                                                                  passwordRequired: true,
                                                                  password: "password",
                                                                  passwordConfirmation: "")
                                                              
        // Check that it is an invalid instance
        assertFalse "UserAccountCommand shouldn't validate", createAcctCmd.validate()
        
        // Attempt to create User
        controller.createUser(createAcctCmd)
        
        // createAcctCmd is invalid, should be sent back to register page
        assertEquals "Should be sent back to register view", "register", renderArgs.view
        assertEquals "Should have same UserAccountCommand object", createAcctCmd, renderArgs.model.userAccountCmd
        
        // Update the UserAccountCommand
        createAcctCmd.passwordConfirmation = "password"
        
        assertTrue "UserAccountCommand should validate", createAcctCmd.validate()
        
        assertEquals "There should be no users yet", 0, User.count()
        assertEquals "There should be 2 Roles", 2, UserRole.count()        
        
        controller.createUser(createAcctCmd)
        
        // Valid UserAccountCommand should create User
        assertEquals "There should be a new User now", 1, User.count()
        
        // Logged-in User
        User createdUser = User.list()[0]
        
        assertEquals "The new User's name should match", "Bob Brown (admin@utas.edu.au)", createdUser.toString()
        assertEquals "New User should be in one Role", 1, createdUser.roles.size()
        assertTrue "New User should be in Role 'SelfRegisteredUser'", createdUser.roles.contains(selfRegisteredUser)
        assertEquals "Logged-in User should be our new user", createAcctCmd.emailAddress, SecurityUtils.getSubject().getPrincipal()
        
        assertEquals "Should redirect the user back to the Home controller", "home", redirectArgs.controller
    }
    
    void testForgotPasswordAction() {
        
        // Mock domain for test
        Config firstConfig = new Config(name : "FirstConfig")
        Config secondConfig = new Config(name : "SecondConfig")
        mockDomain(Config, [firstConfig, secondConfig])
        
        def returnedMap
        
        returnedMap = controller.forgotPassword()
        
        assertEquals "Config instances should be first one in list", firstConfig, returnedMap.configInstance
        assertEquals "No redirect should take place", 0, redirectArgs.size()
        assertEquals "No model etc. should be returned", 0, renderArgs.size()
    }
    
    void testResetPasswordAction() {
        
        User user1 = new User(emailAddress: "sys.admin@emii.org.au",
                              firstName: "Joe",
                              lastName: "Bloggs",
                              passwordHash: "somePasswordHash")
        
        mockDomain(User, [user1])
        mockDomain(Config)
        mockForConstraintsTests(UserResetPasswordCommand)
        
        // Mock in method so we can check that new password is really created and hashed
        def resetPwdCmdMock = mockFor(UserResetPasswordCommand) // Mock UserResetPasswordCommand behaviour
        resetPwdCmdMock.demand.static.newRandomPassword(1..1) { -> return "newRandomPassword" }
        
        // Mock out email methods that should not be run
        def authCtrlrMock = mockFor(AuthController) // Mock AuthController behaviour
        authCtrlrMock.demand.static.sendPasswordResetAdviceEmail(0..1) { User user, String newPassword -> }
                               
        // Mock up message behaviour
        controller.metaClass.message = { LinkedHashMap args -> return "${args.code}" }
        
        // UserResetPasswordCommand variable to test with
        UserResetPasswordCommand cmd
        
        // Invalid command object instance
        cmd = new UserResetPasswordCommand()
        
        // Try resetPassword action
        controller.resetPassword(cmd)
        
        // cmd is invalid, should be sent back to forgotPassword page
        assertEquals "Should be sent back to forgotPassword view", "forgotPassword", renderArgs.view
        assertEquals "Should have same UserResetPasswordCommand object", cmd, renderArgs.model.userResetPasswordCommand
        
        // Valid command object instance
        cmd = new UserResetPasswordCommand(emailAddress: "sys.admin@emii.org.au")
        
        // Try resetPassword action
        controller.resetPassword(cmd)
        
        // Check password changed
        assertEquals "PasswordHash should have been updated", user1.passwordHash, new Sha256Hash("newRandomPassword").toHex()
        assertEquals "Should be sent back to login page", "login", redirectArgs.action
        assertEquals "Should have email address in 'username' field of params", user1.emailAddress, redirectArgs.params.username
    }
    
    private logInSubject(Subject subject) {
        
        ThreadContext.put( ThreadContext.SECURITY_MANAGER_KEY, 
                           [ getSubject: { subject } ] as SecurityManager )
                
        SecurityUtils.metaClass.static.getSubject = { subject }
    }
}
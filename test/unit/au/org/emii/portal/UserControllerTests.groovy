package au.org.emii.portal

import grails.test.*
import org.apache.shiro.util.ThreadContext
import org.apache.shiro.SecurityUtils
import org.apache.shiro.subject.Subject

class UserControllerTests extends ControllerUnitTestCase {
    
    // Users
    def user1
    def user2
    def invalidUserId = 3
     
    // Subjects
    def authdSubject
    
    // Fields for new User
    def newUserFirstName = "Clarke"
    def newUserLastName = "Kent"
    def newUserEmailAddress = "clarke@thedailyplanet.com"
    def newUserPassword = "IHateKryptonite"
    def newUserInstanceAsString = newUserFirstName + " " + newUserLastName + " (" + newUserEmailAddress + ")"
    
    protected void setUp() {
        super.setUp()
        
        // Set up Users
        user1 = new User(emailAddress: "jbloggs@utas.edu.au",
                         firstName: "Joe",
                         lastName: "Bloggs",
                         passwordHash: 'xxxxxxxxxxxxxxxxxx')
                         
        user2 = new User(emailAddress: "fred.nurk@utas.edu.au",
                         firstName: "Fred",
                         lastName: "Nurk",
                         passwordHash: 'xxxxxxxxxxxxxxxxxx')
        
        mockDomain(Config)
        mockDomain(User, [user1, user2])
        mockForConstraintsTests(UserAccountCommand)
        
        // Set up Subjects
        def authdSubjectPrincipal = user2.emailAddress // Have user2 logged-in
        
        authdSubject = [ getPrincipal: { authdSubjectPrincipal },
                 isAuthenticated: { true },
                 hasRole: { true } ,
                 toString: { return "authdSubject" },
                 logout: { authdSubjectPrincipal = null }
               ] as Subject
        
        // Mock up message behaviour
        controller.metaClass.message = { LinkedHashMap args -> return "${args.code}" }
    }

    protected void tearDown() {
        
        SecurityUtils.metaClass.static.getSubject = null
        
        super.tearDown()
    }

    void testIndexAction() {

        mockParams.val1 = "1"
        mockParams.val2 = "2"
        
        controller.index()
        
        assertEquals "Should redirect to list", "list", redirectArgs.action
        assertEquals "Should persist params", [val1: "1", val2: "2"], redirectArgs.params
    }
    
    void testListAction() {

        mockParams.max = 1
        
        def returnParams = controller.list()
        
        assertEquals "Should return 1 onject as per mockParams.max", 1, returnParams.userInstanceList.size()
        assertEquals "Should be 2 instances in total", 2, returnParams.userInstanceTotal
    }
    
    void testCreateAction() {

        assertEquals "Should be 2 Users to start with", 2, User.list().size()
        
        mockParams.firstName = newUserFirstName
        mockParams.lastName = newUserLastName
        mockParams.emailAddress = newUserEmailAddress
        
        def returnParams = controller.create()
        
        assertEquals "Should still be 2 Users", 2, User.list().size()
        assertEquals "Should have params as fields", newUserInstanceAsString, returnParams.userInstance.toString()
    }
    
    void testSaveAction() {

        assertEquals "Should be 2 Users to start with", 2, User.list().size()
        
        // Enter params (will be invalid, no passwordHash)
        mockParams.firstName = newUserFirstName
        mockParams.lastName = newUserLastName
        mockParams.emailAddress = newUserEmailAddress
        
        // Call save method
        controller.save()
        
        assertEquals "Should render the 'create' view", "create", renderArgs.view
        assertEquals "Should return userInstance with values from params", newUserInstanceAsString, renderArgs.model.userInstance.toString()
        assertEquals "Should still be 2 Users", 2, User.list().size()
        
        // Make params enough for a valid User
        mockParams.password = newUserPassword
        
        // Call save method
        controller.save()
        
        assertEquals "Should now be 3 Users", 3, User.list().size()
        assertEquals "Should redirect to 'show' action", "show", redirectArgs.action
        assertEquals "Should return new User id", 3, redirectArgs.id
    }
    
    void testShowAction() {

        assertEquals "Should be 2 Users to start with", 2, User.list().size()
        
        // Invalid id
        mockParams.id = invalidUserId
        
        controller.show()
        
        assertEquals "Should redirect to list action", "list", redirectArgs.action
        
        // Invalid id
        mockParams.id = user1.id
        
        def returnArgs = controller.show()
        
        assertEquals "Should return Joe Bloggs", user1, returnArgs.userInstance
    }
    
    void testEditAction() {

        assertEquals "Should be 2 Users to start with", 2, User.list().size()
        
        // Invalid id
        mockParams.id = invalidUserId
        
        controller.edit()
        
        assertEquals "Should redirect to list action", "list", redirectArgs.action
        
        // Invalid id
        mockParams.id = user1.id
        
        def returnArgs = controller.show()
        
        assertEquals "Should return Joe Bloggs", user1, returnArgs.userInstance
    }
    
    void testUpdateAction() {

        assertEquals "Should be 2 Users to start with", 2, User.list().size()
        
        mockParams.id = invalidUserId
        
        controller.update()
        
        assertEquals "Should redirect to 'list' action", "list", redirectArgs.action
        
        // Set up for next call
        user2.passwordHash = null
        mockParams.id = user2.id // valid id for invalid user
        
        controller.update()
        
        assertEquals "Should render 'edit' view", "edit", renderArgs.view
        assertEquals "Should return userInstance for id", user2, renderArgs.model.userInstance
        
        // Set up for next call
        user2.passwordHash = "someValidPasswordHash"
        
        controller.update()
        
        assertEquals "Should redirect to 'show' action", "show", redirectArgs.action
        assertEquals "Should pass user id", user2.id, redirectArgs.id
    }
    
    void testDeleteAction() {

        assertEquals "Should be 2 Users to start with", 2, User.list().size()
        
        // Pass invalid id
        mockParams.id = invalidUserId
        
        controller.delete()
        
        assertEquals "Invalid id should redirect to 'list' action", "list", redirectArgs.action
        
        // Pass valid id
        mockParams.id = user2.id
        
        controller.delete()
        
        assertEquals "Should now be 1 User", 1, User.list().size()
        assertEquals "Valid id should redirect to 'list' action", "list", redirectArgs.action
    }
    
    void testUpdateAccountAction() {

        logInSubject(authdSubject)
                
        def returnArgs = controller.updateAccount()
        
        assertEquals "Email address of UserAccountCommand should be the same", SecurityUtils.getSubject().getPrincipal(), returnArgs.userAccountCmd.emailAddress
     }
    
    void testUserUpdateAccountAction() {

        logInSubject(authdSubject)
        
        def userAcctCmd = UserAccountCommand.from(user2)
        userAcctCmd.firstName = newUserFirstName
        
        assertFalse "UserAccountCommand should not validate", userAcctCmd.validate()
        
        // Should be invalid as password is required but not given
        controller.userUpdateAccount(userAcctCmd)
        
        assertEquals "Should render updateAccount page", "updateAccount", renderArgs.view
        assertEquals "Should return same UserAccountCommand", userAcctCmd, renderArgs.model.userAccountCmd
        assertEquals "Should have same name still", user2.firstName, "Fred"
        
        // Make UserAccountCommand valid
        userAcctCmd.passwordRequired = false
        
        // Valid UserAccountCommand now
        controller.userUpdateAccount(userAcctCmd)
        
        assertEquals "Should redirect to home page", "home", redirectArgs.controller
        assertEquals "Should be same principal logged-in", SecurityUtils.getSubject().getPrincipal(), user2.emailAddress
        assertEquals "Should have new name now", user2.firstName, newUserFirstName
        
        userAcctCmd.emailAddress = newUserEmailAddress

        // Now change password with userAccountCommand
        controller.userUpdateAccount(userAcctCmd)
        
        assertEquals "Should redirect to home page", "home", redirectArgs.controller
        assertEquals "Should be null user logged-in as email address was changed", SecurityUtils.getSubject().getPrincipal(), null
        assertEquals "Should still have new name", user2.firstName, newUserFirstName
        assertEquals "Should have new emailAddress", user2.emailAddress, newUserEmailAddress
    }
            
    private static logInSubject(Subject subject) {
        
        ThreadContext.put( ThreadContext.SECURITY_MANAGER_KEY, 
                           [ getSubject: { subject } ] as SecurityManager )
                
        SecurityUtils.metaClass.static.getSubject = { subject }
    }
}

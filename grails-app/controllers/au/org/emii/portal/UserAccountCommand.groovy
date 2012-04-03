package au.org.emii.portal

import org.apache.log4j.Logger

class UserAccountCommand {

    private static def log = Logger.getLogger( this )

    // Fields
    String emailAddress
    String previousEmailAddress
    String firstName
    String lastName
    
    boolean passwordRequired = true
    String password
    String passwordConfirmation

    String address
    String state
    String postcode
    String country
    
    String organisation
    OrganisationType orgType
    
    // Constraints
    static constraints = {
        emailAddress(email: true, blank: false, nullable: false, validator:{ val, obj ->
                
            // Check for unique email address? how about changing email address?
            if (val != obj.previousEmailAddress) {
                
                if (User.findByEmailAddress(val.toLowerCase()))
                {
                    return "userAccountCommand.emailAddress.conflict"
                }
            }
        })
        previousEmailAddress()
        firstName(nullable: false, blank: false)
        lastName(nullable: false, blank: false)
        password(validator:{ val, obj ->
            
            if (obj.passwordRequired && !val) {
                return "userAccountCommand.password.required"
            }
        })
        passwordConfirmation(validator:{ val, obj ->
            
            if (obj.passwordRequired && !val) {
                return "userAccountCommand.passwordConfirmation.required"
            }
                
            if (val != obj.password) {
               
                return "userAccountCommand.passwordConfirmation.mismatch"
            }
        })
        
        address(nullable: true)
        state(nullable: true)
        postcode(nullable: true)
        country(nullable: true)

        organisation(nullable: true)
        orgType(nullable: true)
    }
    
    User createUser( authService ) {

        def salt = authService.newRandomSalt()

        def user = new User(emailAddress: emailAddress.toLowerCase(),
                            firstName: firstName,
                            lastName: lastName,
                            passwordHash: authService.generatePasswordHash( salt, password ),
                            passwordSalt: salt,
                            address: address,
                            state: state,
                            postcode: postcode,
                            country: country,
                            organisation: organisation,
                            orgType: orgType)
        
        return user
    }
    
    User updateUser( authService ) {

        if ( !previousEmailAddress ) {

            log.error "previousEmailAddress is null or empty"
            return null
        }
        
        previousEmailAddress = previousEmailAddress.toLowerCase()
        
        // Get user to update
        def user = User.findByEmailAddress( previousEmailAddress )
        
        if ( !previousEmailAddress ) {

            log.error "Could not find user for previousEmailAddress: '$previousEmailAddress'"
            return null
        }
        
        user.emailAddress = emailAddress.toLowerCase()
        user.firstName = firstName
        user.lastName = lastName
        user.address = address
        user.state = state
        user.postcode = postcode
        user.country = country
        user.organisation = organisation
        user.orgType = orgType        
        
        // Change password if it has been supplied
        if ( password ) {

            def salt = authService.newRandomSalt()

            user.passwordHash = authService.generatePasswordHash( salt, password )
            user.passwordSalt = salt
        }
        
        return user
    }

    String toString() {
        
        return "UserAccountCommand(email: '$emailAddress'; prevEmail: '$previousEmailAddress'; passwdReqd: '$passwordRequired'. @${Integer.toHexString( hashCode() )})"
    }
        
    static UserAccountCommand from( User user ) {
        return new UserAccountCommand([emailAddress: user.emailAddress,
                                       previousEmailAddress: user.emailAddress,
                                       firstName: user.firstName,
                                       lastName: user.lastName,
                                       address: user.address,
                                       state: user.state,
                                       postcode: user.postcode,
                                       country: user.country,
                                       organisation: user.organisation,
                                       orgType: user.orgType])
    }
}
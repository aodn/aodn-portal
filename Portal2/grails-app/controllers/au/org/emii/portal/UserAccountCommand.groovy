package au.org.emii.portal

import org.apache.shiro.crypto.hash.Sha256Hash

class UserAccountCommand {
    
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
                    return "unique"
                }
            }
        })
        previousEmailAddress()
        firstName(nullable: false, blank: false)
        lastName(nullable: false, blank: false)
        password(validator:{ val, obj ->
            
            if (obj.passwordRequired && !val) {
                return "nullable"
            }
        })
        passwordConfirmation(validator:{ val, obj ->
            
            if (obj.passwordRequired && !val) {
                return "nullable"
            }
                
            if (val != obj.password) {
               
                return "mismatch"
            }
        })
        
        address(nullable: true)
        state(nullable: true)
        postcode(nullable: true)
        country(nullable: true)

        organisation(nullable: true)
        orgType(nullable: true)
    }
    
    User createUser() {        
        def user = new User(emailAddress: emailAddress.toLowerCase(),
                            firstName: firstName,
                            lastName: lastName,
                            passwordHash: new Sha256Hash(password).toHex(),
                            address: address,
                            state: state,
                            postcode: postcode,
                            country: country,
                            organisation: organisation,
                            orgType: orgType)
        
        return user
    }
    
    User updateUser() {    
        
        if (!previousEmailAddress) {
            log.error "previousEmailAddress is null or empty"
            return null
        }
        
        previousEmailAddress = previousEmailAddress.toLowerCase()
        
        // Get user to update
        def user = User.findByEmailAddress(previousEmailAddress)
        
        if (!previousEmailAddress) {
            log.error String.format("Could not find user for previousEmailAddress: '%s'", previousEmailAddress)
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
        if (password) {
            user.passwordHash = new Sha256Hash(password).toHex()
        }
        
        return user
    }
    
    String toString() {
        return String.format("UserAccountCommand(email: '%s'; prevEmail: '%s'; passwdReqd: '%s'. @%s)", emailAddress, previousEmailAddress, passwordRequired, Integer.toHexString(hashCode()))
    }
    
    static UserAccountCommand from(User user) {
        return new UserAccountCommand([emailAddress: user.emailAddress,
                                       previousEmailAddress: user.emailAddress,
                                       firstName: user.firstName,
                                       lastName: user.lastName,
                                       address: user.address,
                                       state: user.state,
                                       postcode: user.postcode,
                                       state: user.state,
                                       country: user.country,
                                       organisation: user.organisation,
                                       orgType: user.orgType])
    }
}
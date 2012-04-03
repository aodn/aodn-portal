package au.org.emii.portal

import java.security.SecureRandom
import org.apache.commons.lang.RandomStringUtils
import org.apache.shiro.crypto.hash.Sha256Hash

class AuthService {

    static transactional = true

    def newRandomSalt() {

        def saltBytes = new byte[32] // Salt is 32 bytes (256 bits) long

        new SecureRandom().nextBytes saltBytes // Generate random bytes

        return saltBytes.encodeBase64().toString()
    }

    def newRandomPassword() {

        return RandomStringUtils.randomAlphanumeric( 10 ) // 10 charcter random password
    }

    def generatePasswordHash( salt, password ) {

        return new Sha256Hash( combineForHash( salt, password ) ).toHex()
    }
    
    def combineForHash( salt, password ) {
        
        if ( !salt ) throw new IllegalArgumentException( "Argument 'salt' may not be null" )
        if ( !password ) throw new IllegalArgumentException( "Argument 'password' may not be null" )
        
        return salt + password
    }
}

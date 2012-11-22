
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.shiro.authc.AuthenticationToken

class OpenIdAuthenticationToken implements AuthenticationToken {
    
    def userId
    def openIdUrl
    
    OpenIdAuthenticationToken( userId, openIdUrl ) {

        this.userId = userId
        this.openIdUrl = openIdUrl
    }

    Object getPrincipal() {

        return userId
    }

    Object getCredentials() {

        return openIdUrl
    }
}

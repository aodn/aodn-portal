
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.slf4j.MDC

class LoggingFilters {

    def grailsApplication

    def filters = {

        addLoggingInfo(controller:'*', action:'*') {

            before = {

                // Client data
                MDC.put 'clientAddress', clientAddress( request )
                MDC.put 'userAgent', userAgent( request )

                // User data
                def principal = SecurityUtils?.subject?.principal
                MDC.put 'userInfoForFile', userInfoForFile( principal )
                MDC.put 'userInfoForEmail', userInfoForEmail( principal )
            }

            afterView = {

                MDC.remove 'clientAddress'
                MDC.remove 'userAgent'
                MDC.remove 'userInfoForFile'
                MDC.remove 'userInfoForEmail'
            }
        }
    }

    String clientAddress( request ) {

        return request.remoteAddr ?: request.getHeader( "X-Forwarded-For" ) ?: request.getHeader( "Client-IP" )
    }

    String userAgent( request ) {

        return request.getHeader( "User-Agent" ) ?: ""
    }

    String userInfoForFile( principal ) {

        return "(User: ${ principal ?: "anon." }) "
    }

    String userInfoForEmail( principal ) {

        return "User: ${ principal ?: "Not logged-in" }\n"
    }
}

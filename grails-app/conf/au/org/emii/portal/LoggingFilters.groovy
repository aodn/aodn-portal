package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.slf4j.MDC

class LoggingFilters {

    def filters = {

        addLoggingInfo(controller:'*', action:'*') {

            before = {

                // Client data
                MDC.put 'clientAddress', clientAddress( request )
                MDC.put 'userAgent', request.getHeader( "User-Agent" )

                // User data
                def principal = SecurityUtils?.subject?.principal
                MDC.put 'userInfoForFile', "(User: ${ principal ?: "anon." }) "
                MDC.put 'userInfoForEmail', "User: ${ principal ?: "Not logged-in" }\n"
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
}
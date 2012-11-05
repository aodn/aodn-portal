package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.slf4j.MDC
import grails.util.Environment

class LoggingFilters {

	def grailsApplication

    def filters = {

        addLoggingInfo(controller:'*', action:'*') {

            before = {

	            def md = grails.util.Metadata.current

	            MDC.put('serverUrl',  grailsApplication.config.grails.serverURL)
	            MDC.put('instanceName', grailsApplication.config.portal.instance.name)
	            MDC.put('grailsEnvironment', Environment.current.name.toString())
	            MDC.put('appVersion', md.'app.version')
	            MDC.put('buildDate', md.'app.build.date')
	            MDC.put('buildNumber', md.'app.build.number')
	            MDC.put('buildRevision', md.'app.svn.revision')

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
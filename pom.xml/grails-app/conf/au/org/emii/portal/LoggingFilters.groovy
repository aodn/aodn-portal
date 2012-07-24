package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.slf4j.MDC

class LoggingFilters {

    def filters = {

        addLoggingInfo(controller:'*', action:'*') {

            before = {

                def principal = SecurityUtils?.subject?.principal

                MDC.put 'userInfoForFile', "(User: ${ principal ?: "anon." }) "
                MDC.put 'userInfoForEmail', "User: ${ principal ?: "Not logged-in" }\n"
            }

            afterView = {

                MDC.remove 'userInfoForFile'
                MDC.remove 'userInfoForEmail'
            }
        }
    }
}
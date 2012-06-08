package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.slf4j.MDC

class LoggingFilters {

    static final def UserInfoField = 'userInfo'

    def filters = {

        addLoggingInfo(controller:'*', action:'*') {

            before = {

                def principal = SecurityUtils?.subject?.principal

                def userInfo = principal ?: "Not auth'd"

                MDC.put UserInfoField, userInfo as String
            }

            afterView = {

                MDC.remove UserInfoField
            }
        }
    }
}


package au.org.emii.portal

import org.slf4j.Logger
import org.slf4j.LoggerFactory

import static au.org.emii.portal.HttpUtils.Status.*

class SystemController {

    static final Logger clientLogger = LoggerFactory.getLogger('client-log')

    // From Stackoverflow:
    // http://stackoverflow.com/questions/1766917/is-it-possible-to-catch-handle-exceptions-thrown-from-a-grails-controller-aop
    def error = {
        // Grails has already set the response status to 500

        // Did the original controller set a exception handler?
        if (request.exceptionHandler) {
            if (request.exceptionHandler.call(request.exception)) {
                return
            }
            // Otherwise exceptionHandler did not want to handle it
        }
        render(view: "/error")
    }

    def clientLog = {
        clientLogger."${params.level.toLowerCase()}"("session ID: ${clientLogId}, message: ${params.message}");
        render status: HTTP_200_OK, text: "Log posted"
    }

    def getClientLogId() {
        // First few chars should be enough (a la git SHAs).
        session.id[0..8]
    }
}

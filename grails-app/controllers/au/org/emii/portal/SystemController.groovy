/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.slf4j.Logger
import org.slf4j.LoggerFactory

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
        clientLogger."${params.level.toLowerCase()}"(params.message);
        render status: 200, text: "Log posted"
    }
}

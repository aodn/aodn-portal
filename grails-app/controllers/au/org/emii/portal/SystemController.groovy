package au.org.emii.portal


//From Stackoverflow:
//http://stackoverflow.com/questions/1766917/is-it-possible-to-catch-handle-exceptions-thrown-from-a-grails-controller-aop
class SystemController {
    def error = {
        // Grails has already set the response status to 500

        // Did the original controller set a exception handler?
        if (request.exceptionHandler) {
            if (request.exceptionHandler.call(request.exception)) {
                return
            }
            // Otherwise exceptionHandler did not want to handle it
        }
        render(view:"/error")
    }
}

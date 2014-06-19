package au.org.emii.portal

class AodaacJobController {

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = 100
        [aodaacJobInstanceList: AodaacJob.list(params), aodaacJobInstanceTotal: AodaacJob.count()]
    }

    def show = {
        def aodaacJobInstance = AodaacJob.get(params.id)
        if (!aodaacJobInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'aodaacJob.label', default: 'AodaacJob'), params.id])}"
            redirect(action: "list")
        }
        else {
            [aodaacJobInstance: aodaacJobInstance]
        }
    }
}

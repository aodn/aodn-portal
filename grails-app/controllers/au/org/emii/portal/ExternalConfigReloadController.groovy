package au.org.emii.portal

import org.slf4j.Logger
import org.slf4j.LoggerFactory

class ExternalConfigReloadController {

    static final Logger log = LoggerFactory.getLogger(this)

    def grailsApplication

    def index() {
        def config = grailsApplication.config
        def locations = config.grails.config.locations

        locations.each { location ->
            String configFileName = location.split("file:")[1]
            log.info "Reloading config from file '${configFileName}'..."
            config.merge(new ConfigSlurper().parse(new File(configFileName).text))
        }
        render(status: 200, text: 'OK')
    }

    def beforeInterceptor = {
        if (!["127.0.0.1", "0:0:0:0:0:0:0:1"].contains(request.remoteAddr)) {
            render(status: 401, text: 'Unauthorized')
            return false
        }
    }
}

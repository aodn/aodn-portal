package au.org.emii.portal

import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException
import static groovyx.net.http.ContentType.JSON

class GogoduckService {

    static transactional = true

    def grailsApplication

    void registerJob(jobParameters) throws HttpResponseException {

        _gogoduckConnection().post(
            [
                body: jobParameters,
                requestContentType: JSON
            ],
            successHandler
        )
    }

    def _gogoduckConnection() {

        def registerJobUrl = "${grailsApplication.config.gogoduck.url}/job/"

        return new HTTPBuilder(registerJobUrl)
    }

    def successHandler = { response, reader ->

        log.debug "GoGoDuck response: ${response.statusLine}"
    }
}

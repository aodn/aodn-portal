package au.org.emii.portal.proxying

import org.codehaus.groovy.grails.io.support.IOUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class ExternalRequest {

    static final Logger log = LoggerFactory.getLogger(this)

    def response
    def outputStream
    def targetUrl
    def connectTimeout
    def grailsApplication

    ExternalRequest(outputStream, url) {
        this.outputStream = outputStream
        this.targetUrl = url
    }

    ExternalRequest(response, url, grailsApplication) {
        this.response = response
        this.targetUrl = url
        this.connectTimeout = grailsApplication.config.proxyConnectTimeout
        this.grailsApplication = grailsApplication
    }

    def straightThrough = { inputStream, outputStream ->
        log.debug "Straight-through stream processor"
        outputStream << inputStream
    }

    def onConnectionOpened = { conn ->
        // give sub classes access to headers
    }

    def executeRequest = { streamProcessor = null ->

        def processStream = streamProcessor ?: straightThrough

        log.debug "Opening connection to target URL: $targetUrl"

        URLConnection conn = targetUrl.openConnection()

        if (connectTimeout) {
            conn.setConnectTimeout(connectTimeout);
        }
        if (grailsApplication) {
            String userAgent = "AODN-Portal".concat( (grailsApplication.metadata) ? "/V" + grailsApplication.metadata.'app.version': "/development-test");
            conn.addRequestProperty("User-Agent", userAgent);
        }

        onConnectionOpened conn

        try {
            InputStream inputStream = conn.getInputStream()
        }
        catch (IOException e) {
            throw e
            return
        }

        try {
            if (response) {
                outputStream = response.outputStream
            }
            processStream conn.inputStream, outputStream
            outputStream.flush()
        }
        finally {
            IOUtils.closeQuietly(outputStream)
        }
    }
}

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

    ExternalRequest(outputStream, url) {
        this.outputStream = outputStream
        this.targetUrl = url
    }

    ExternalRequest(response, url, grailsApplication) {
        this.response = response
        this.targetUrl = url
        this.connectTimeout = grailsApplication.config.proxyConnectTimeout
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

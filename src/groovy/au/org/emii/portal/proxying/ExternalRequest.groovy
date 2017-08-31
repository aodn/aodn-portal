package au.org.emii.portal.proxying

import org.codehaus.groovy.grails.io.support.IOUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class ExternalRequest {

    static final Logger log = LoggerFactory.getLogger(this)

    def outputStream
    def targetUrl
    def proxyConnectTimeout

    ExternalRequest(outputStream, url) {
        this.outputStream = outputStream
        this.targetUrl = url
    }

    ExternalRequest(outputStream, url, proxyConnectTimeout) {
        this.outputStream = outputStream
        this.targetUrl = url
        this.proxyConnectTimeout = proxyConnectTimeout
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

        if (proxyConnectTimeout) {
            conn.setConnectTimeout(proxyConnectTimeout);
        }

        onConnectionOpened conn

        try {
            processStream conn.inputStream, outputStream
            outputStream.flush()
        }
        finally {
            IOUtils.closeQuietly(outputStream)
        }
    }
}

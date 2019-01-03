package au.org.emii.portal.wms

import groovy.json.JsonSlurper
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class WpsUniqueValuesFilterService {

    static final Logger log = LoggerFactory.getLogger(this)

    private def wpsUrl
    private def requestRenderer

    WpsUniqueValuesFilterService(wpsUrl, requestRenderer) {
        this.wpsUrl = wpsUrl
        this.requestRenderer = requestRenderer
    }

    def getFilterValues(layer, filter) {
        def values = []

        try {
            def uniqueValuesResponse = _getPagedUniqueValues(layer, filter)
            def json = new JsonSlurper().parseText(uniqueValuesResponse)

            values = json.values
        } catch (e) {
            log.error "Unable to parse filters values for wps server '${wpsUrl}', layer '${layer}', filter '${filter}'"
        }

        return values
    }

    def _getPagedUniqueValues(layer, filter) {
        def params = [typeName: layer, propertyName: filter]
        def body = requestRenderer.render(template: '/filters/pagedUniqueRequest.xml', model: params)
        log.debug("Request body:\n\n${body}")

        def connection = wpsUrl.toURL().openConnection()

        connection.with {
            doOutput = true
            requestMethod = 'POST'
            setRequestProperty("Content-Type", "application/xml; charset=utf-8")
            outputStream.withWriter { writer ->
                writer << body
            }
            content.text
        }
    }
}

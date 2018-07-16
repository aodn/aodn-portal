package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest
import groovy.json.JsonSlurper

class DataTrawlerServer extends CoreGeoserverServer {

    def groovyPageRenderer

    DataTrawlerServer(groovyPageRenderer) {
        this.groovyPageRenderer = groovyPageRenderer
    }

    def getStyles(server, layer) {
        return []
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(_describeFeatureType(server, layer))

            def attributes = xml.'**'.findAll { node ->
                node.name() == 'element' && node.@name != _removePrefix(layer)
            }

            boolean hasTemporalRange = false

            attributes.each { attribute ->
                def propertyName = attribute.@name.text()
                def propertyType = attribute.@type.text()

                if (['TIME_COVERAGE_START', 'TIME_COVERAGE_END'].contains(propertyName)) {
                    // HACK: handle CSIRO layers with capitalised property names
                    if (!hasTemporalRange) {
                        filters.push(
                            [
                                label     : 'Time',
                                type      : 'datetime',
                                name      : 'TIME',
                                visualised: true,
                                wmsStartDateName: 'TIME_COVERAGE_START',
                                wmsEndDateName: 'TIME_COVERAGE_END'
                            ]
                        )
                        hasTemporalRange = true
                    }
                } else {
                    filters.push(
                        [
                            label     : _toLabel(propertyName),
                            type      : _toFilterType(propertyType),
                            name      : propertyName,
                            visualised: true
                        ]
                    )
                }
            }
        } catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
        }

        return filters
    }

    def _describeFeatureType(server, layer) {
        def requestUrl = server + "?request=DescribeFeatureType&service=WFS&version=1.0.0&typeName=${layer}"
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def _getPagedUniqueValues(server, layer, filter) {
        def params = [typeName: layer, propertyName: filter]
        def body = groovyPageRenderer.render(template: '/filters/pagedUniqueRequest.xml', model: params)
        log.debug("Request body:\n\n${body}")

        def connection = server.toURL().openConnection()

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

    def _toLabel(attributeName) {
        attributeName.replaceAll('_', ' ').toLowerCase().capitalize()
    }

}

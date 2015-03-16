/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import au.org.emii.portal.Layer
import au.org.emii.portal.Server
import au.org.emii.portal.proxying.ExternalRequest
import groovy.xml.MarkupBuilder

class GeoserverServer extends WmsServer {
    def filterSource

    GeoserverServer(filterSource) {
        this.filterSource = filterSource
    }

    def getStyles(server, layer) {

        return []
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, layer))

            xml.filter.each { filter ->

                filters.push([
                    label: filter.label.text(),
                    type: filter.type.text(),
                    name: filter.name.text(),
                    visualised: Boolean.valueOf(filter.visualised.text())
                ])
            }
        }
        catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
        }

        return filters
    }

    def _getFiltersXml(server, layer) {

        switch (filterSource) {
            case 'database':
                return _getFiltersXmlFromDatabase(server, layer)

            case 'geoserver':
                return _getFiltersXmlFromGeoserver(server, layer)

            case 'file':
                return _getFiltersXmlFromFile(layer)

            default :
                throw new Exception("Unsupported filter source: '$filterSource'")
        }
    }

    def _getFiltersXmlFromFile(layer) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("filters/${workspaceName}/${layerName}/filters.xml")
        return inputFile.text
    }

    def _getFiltersXmlFromGeoserver(server, layer) {
        def filtersUrl = getFiltersUrl(server, layer)
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, filtersUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def _getFiltersXmlFromDatabase(serverAddress, fullLayerName) {

        def filters = _filtersForLayer(serverAddress, fullLayerName)

        def xmlOutput = new StringWriter()
        def builder = new MarkupBuilder(xmlOutput)

        builder.'filters' {
            filters.each { currentFilter ->

                'filter' {
                    'label' currentFilter.label
                    'name' currentFilter.name
                    'type' currentFilter.type
                    'visualised' !currentFilter.downloadOnly
                }
            }
        }

        return xmlOutput.toString()
    }

    def getFilterValues(server, layer, filter) {
        def values = []

        try {
            def xml = new XmlSlurper().parseText(_getFilterValuesXml(server, layer, filter))

            values = xml.value.collect { it.text() }
        }
        catch (e) {
            log.error "Unable to parse filters values for server '${server}', layer '${layer}', filter '${filter}'", e
        }

        return values
    }

    def _getFilterValuesXml(server, layer, filter) {

        switch (filterSource) {
            case 'database':
                return _getFilterValuesXmlFromDatabase(server, layer, filter)

            case 'geoserver':
                return _getFilterValuesXmlFromGeoserver(server, layer, filter)

            case 'file':
                return _getFilterValuesXmlFromFile(layer, filter)

            default :
                throw new Exception("Unsupported filter source: '$filterSource'")
        }
    }

    def _getFilterValuesXmlFromFile(layer, filter) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("filters/${workspaceName}/${layerName}/${filter}.xml")
        return inputFile.text
    }

    def _getFilterValuesXmlFromGeoserver(server, layer, filter) {
        def filtersUrl = getFilterValuesUrl(server, layer, filter)
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, filtersUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def _getFilterValuesXmlFromDatabase(serverAddress, fullLayerName, filterName) {

        def filters = _filtersForLayer(serverAddress, fullLayerName)
        def filter = filters.find{ it.name == filterName }

        def xmlOutput = new StringWriter()
        def builder = new MarkupBuilder(xmlOutput)

        builder.'uniqueValues' {
            filter.possibleValues.each {
                'value' it
            }
        }

        return xmlOutput.toString()
    }

    def _filtersForLayer(serverAddress, fullLayerName) {
        def server = Server.findByUri(serverAddress)
        def layerName = getLayerName(fullLayerName)
        def layer = Layer.findByNameAndServer(layerName, server)

        return layer.filters.asList().findAll{ it.enabled }
    }

    static String getLayerWorkspace(fullLayerName) {
        if (fullLayerName.contains(":")) {
            return fullLayerName.split(":")[0]
        }
        else {
            return ""
        }
    }

    static String getLayerName(fullLayerName) {
        if (fullLayerName.contains(":")) {
            return fullLayerName.split(":")[1]
        }
        else {
            return fullLayerName
        }
    }

    static String _getFiltersUrlBase(server, layer, request, extraOpts) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)

        def final service = "layerFilters"
        def final version = "1.0.0"

        return server + "?request=${request}&service=${service}&version=${version}&workspace=${workspaceName}&layer=${layerName}${extraOpts}"
    }

    static String getFiltersUrl(server, layer) {
        return _getFiltersUrlBase(server, layer, "enabledFilters", "")
    }

    static String getFilterValuesUrl(server, layer, filter) {
        return _getFiltersUrlBase(server, layer, "uniqueValues", "&propertyName=${filter}")
    }
}

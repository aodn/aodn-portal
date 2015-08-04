package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest

class GeoserverServer extends WmsServer {
    def filePath

    GeoserverServer(filePath) {
        this.filePath = filePath
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
                    visualised: Boolean.valueOf(filter.visualised.text()),
                    wmsStartDateName: filter.wmsStartDateName.text(),
                    wmsEndDateName: filter.wmsEndDateName.text()
                ])
            }
        }
        catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
        }

        return filters
    }

    def _getFiltersXml(server, layer) {

        if (filePath) {
            _loadFile(layer, "filters.xml")
        }
        else {
            _loadUrl(getFiltersUrl(server, layer))
        }
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

        if (filePath) {
            _loadFile(layer, "${filter}.xml")
        }
        else {
            _loadUrl(getFilterValuesUrl(server, layer, filter))
        }
    }

    def _loadFile(layer, filename) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("$filePath/${workspaceName}/${layerName}/${filename}")
        return inputFile.text
    }

    static def _loadUrl(address) {
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, address.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
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

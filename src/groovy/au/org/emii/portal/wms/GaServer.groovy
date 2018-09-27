package au.org.emii.portal.wms

class GaServer {
    def getStyles(server, layer) {
        return []
    }
    def getFilterValues(server, layer, filter) {
        return true
    }

    def getFilters(server, layer) {
        def filters = []

        filters.push(
                [
                        label           : 'Bounding Box',
                        type            : 'geometrypropertytype',
                        name            : 'position',
                        visualised      : false
                ]
        )
        return filters
    }
}

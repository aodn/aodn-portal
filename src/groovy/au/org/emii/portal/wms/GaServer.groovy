package au.org.emii.portal.wms

class GaServer extends CoreGeoserverServer{

    def groovyPageRenderer

    GaServer(Map attributes) {
        super(attributes)
        this.groovyPageRenderer = groovyPageRenderer
    }

    def getFilters(server, layer) {
        def filters = super.getFilters(server, layer)

        if (filters.size() == 0) {
            filters.push(
                    [
                            label           : 'Bounding Box',
                            type            : 'geometrypropertytype',
                            name            : 'position',
                            visualised      : false
                    ]
            )
        }
        // todo ask Craig
        return filters
    }
}

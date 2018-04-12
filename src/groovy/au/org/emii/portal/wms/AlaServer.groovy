package au.org.emii.portal.wms

class AlaServer extends WmsServer {

    def getStyles(server, layer) {
        // todo
        return []
    }

    def getFilters(server, layer) {
        def filters = []

        filters.push(
            [
                label     : 'Filter by species/taxon',
                type      : 'alastringarray',
                name      : 'Q',
                visualised: true
            ]
        )
        filters.push(
            [
                label           : 'Time Range',
                type            : 'datetime',
                name            : 'dateTime',
                wmsStartDateName: 'startDate',
                wmsEndDateName  : 'endDate',
                visualised      : true,
                primaryFilter   : false
            ]
        )
        return filters
    }

    def getFilterValues(server, layer, filter) {
        return true //
    }
}

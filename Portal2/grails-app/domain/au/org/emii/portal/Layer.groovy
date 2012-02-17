package au.org.emii.portal

class Layer {

    String name
    String namespace
    String title
    String abstractTrimmed
    Server server
    Boolean cache
    String cql
    String styles
    String bbox
    String projection
    String metaUrl // store the whole url of mest, ramadda, or whatever end point
    Boolean queryable
    Boolean isBaseLayer
    
    // Extra info
    String dataSource
    Boolean activeInLastScan
    Boolean blacklisted
    Date lastUpdated

    /* <tns:name>Argo Oxygen Floats</tns:name>
        <tns:disabled>false</tns:disabled>
        <tns:description>Oxygen enabled Argo Floats in the Australian region</tns:description>
        <tns:uriIdRef>web-maps-0</tns:uriIdRef>
        <tns:type>WMS-LAYER-1.1.1</tns:type>
        <tns:cache>false</tns:cache>
        <tns:cql>oxygen_sensor eq true</tns:cql>
        <tns:style>argo_oxygen</tns:style>
        <tns:opacity>1.0</tns:opacity>
        <tns:layers>argo_float</tns:layers>
        <tns:imageFormat>image/png</tns:imageFormat>
        <tns:queryable>true</tns:queryable>

     */
    static mapping = {
        sort "server"
		layers sort: "title"
        styles type:'text'
    }
	
    static belongsTo = [parent: Layer]
    static hasMany = [layers: Layer]

    static constraints = {
        name( nullable: true, size:1..225 )
        namespace( nullable: true )
        title( nullable: true )
        blacklisted()
        abstractTrimmed(size:0..455, blank:true)
        server()
        cache()
        cql(nullable:true)
        styles(blank:true)
        metaUrl(nullable:true)
        bbox(nullable:true)
        projection(nullable: true)
        queryable()
        isBaseLayer()
        
        dataSource(blank:false)
        activeInLastScan()
        lastUpdated(nullable:true)
    }
	
    Layer() {
        layers = []
        
        // Defaults
        abstractTrimmed = ""
        blacklisted = false
        cache = false
        styles = ""
        queryable = false
        isBaseLayer = false
        activeInLastScan = true
    }

    String toListString() {
        return "${server?.shortAcron} - ${name}"
    }
    
    String toString() {
        return "${server?.shortAcron} - ${name}"
    }

    def onDelete() {
        Layer.executeUpdate("delete MenuItem mi where mi.layerId = :layerId", [layerId: id])
    }

    String nameOrTitle() {
        
        return name ?: title
    }
    
    void printTree(int depth = 0) {

        if ( depth == 0 ) {
            log.info ""
            log.info "-- Layer Tree --"
        }

        def spaces = ( "   " * depth )
        log.info "$spaces$name [$id] (parent: '$parent' [${parent?.id}]; layers: '${layers.size()}'; active: '$activeInLastScan';)"

        layers.each{

            it.printTree (depth + 1)
        }
    }
}
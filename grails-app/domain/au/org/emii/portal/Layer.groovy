package au.org.emii.portal

import org.apache.commons.lang.builder.EqualsBuilder

class Layer {

    String name
    String namespace
    String title
    String abstractTrimmed
    Server server
    Boolean cache
    String cql
    String styles
    String bboxMinX
    String bboxMinY
    String bboxMaxX
    String bboxMaxY
    String projection
    String metaUrl // store the whole url of mest, ramadda, or whatever end point
    Boolean queryable
    Boolean isBaseLayer

    // Extra info
    String dataSource
    Boolean activeInLastScan
    Boolean blacklisted
    Date lastUpdated

    String layerHierarchyPath

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
        // Sorting
        sort "server"
		layers sort: "title"

        // Column types
        styles type: "text"
        layerHierarchyPath type: "text"
        dimensions cascade: 'all-delete-orphan'
    }

    static belongsTo = [parent: Layer]
    static hasMany = [layers: Layer, dimensions: WMSDimension]
    static constraints = {
        name( nullable: true, size:1..225 )
        namespace( nullable: true )
        title( nullable: true )
        blacklisted()
        abstractTrimmed(size:0..455, nullable:true)
        server()
        cache()
        cql(nullable:true)
        styles(nullable:true)
        metaUrl(nullable:true)
        bboxMinX(nullable:true)
        bboxMinY(nullable:true)
        bboxMaxX(nullable:true)
        bboxMaxY(nullable:true)
        projection(nullable: true)
        queryable()

        isBaseLayer()
        
        dataSource(blank:false)
        activeInLastScan()
        lastUpdated(nullable:true)
        layerHierarchyPath(nullable: true)
    }

    Layer() {
        layers = []
        dimensions = []
        
        // Defaults
        abstractTrimmed = ""
        blacklisted = false
        cache = false
        styles = ""
        queryable = false
        isBaseLayer = false
        activeInLastScan = true
    }

    boolean equals(other){
        if(is(other)){
            return true
        }    
        if(!(other instanceof Layer)) {
            return false
        }
        return new EqualsBuilder()
            .append(id, other.id)
            .isEquals()
    }

    String toString() {
        return "${server?.shortAcron} - ${name}"
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

    void deleteDefaultLayersInConfig(){
        Config.withNewSession{
            def configInstance = Config.activeInstance()

            configInstance.defaultLayers.remove(this)
            configInstance.save()
        }
    }

    void deleteLayerMenuItems(){
        MenuItem.withNewSession{
            def dels = MenuItem.findAllByLayer(this)
            dels*.delete()
        }
    }

    void beforeDelete(){
        //find all layers related to this server
        deleteDefaultLayersInConfig()
        deleteLayerMenuItems()
    }
}
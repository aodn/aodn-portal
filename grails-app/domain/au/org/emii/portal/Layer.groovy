package au.org.emii.portal

import grails.converters.deep.*
import groovyx.net.http.*

class Layer {
    
    String name
	String title
    Boolean disabled
    String description
    Server server
    Boolean cache
    String cql
    String style
    String bbox
    String metaUrl // store the whole url of mest, ramadda, or whatever end point
    Boolean queryable
    Boolean isBaseLayer
    
    // Extra info useful for WMS scanner
    String source
    boolean currentlyActive
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
    }
	
	static belongsTo = [parent: Layer]
	static hasMany = [layers: Layer]

    static constraints = {
        name(size:5..225)
        disabled()
        description(size:5..455,blank:false)
        server()
        cache()
        cql(nullable:true)
        style(nullable:true)
        metaUrl(nullable:true)
        bbox(nullable:true)
        queryable()
        isBaseLayer()
        
        source(blank:false)
        currentlyActive()
    }
	
	Layer() {
		layers = []
	}

    String toListString() {
        return "${server.shortAcron} - ${name}"
    }
    String toString() {
        return "${server.shortAcron} - ${name}"
    }
}

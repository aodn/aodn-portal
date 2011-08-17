package au.org.emii.portal

import grails.converters.deep.*
import groovyx.net.http.*


class Layer {

    String name
    Boolean disabled
    String description
    Server server
    Boolean cache
    String keywords
    String cql
    String style
    Integer opacity
    String layers
    String bbox
    String imageFormat
    String metaUrl // store the whole url of mest, ramadda, or whatever end point
    Boolean queryable
    Boolean isBaseLayer


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

    static constraints = {
        name(size:5..225,unique:true)
        keywords(nullable:true)
        disabled()
        description(size:5..455,blank:false,unique:true)
        server()
        cache()
        cql(nullable:true)
        style(nullable:true)
        metaUrl(nullable:true)
        opacity(range:30..100)
        layers()
        bbox(nullable:true)
        imageFormat( inList:['image/png','image/gif'] )
        queryable()
        isBaseLayer()

    }

     String toListString() {
        return "${server.shortAcron} - ${name}"
    }
    String toString() {
        return "${server.shortAcron} - ${name}"
    }
}

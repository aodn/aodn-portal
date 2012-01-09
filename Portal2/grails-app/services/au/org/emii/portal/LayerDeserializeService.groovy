package au.org.emii.portal

import grails.converters.*
import org.codehaus.groovy.grails.web.json.JSONObject

class LayerDeserializeService {

    Layer fromJson(JSONObject json, Server server) {

        log.debug "Parsing JSON to Layer..."
        
        // Retrieve child layer info
        def childrenJson = json.children
        json.children = null
        
        def layer = new Layer( json )
        
        // Add layer to server
        layer.server = server
        
        childrenJson.each{
            
            layer.addToLayers fromJson( it, server )
        }
        
        return layer
    }
}

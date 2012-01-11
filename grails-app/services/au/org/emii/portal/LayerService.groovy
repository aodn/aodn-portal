package au.org.emii.portal

import grails.converters.*
import org.codehaus.groovy.grails.web.json.JSONObject
import org.codehaus.groovy.runtime.*

class LayerService {

    static transactional = true
    
    void updateWithNewData(JSONObject layerAsJson, Server server, String dataSource) {
        
        try {
            
            def existingLayers = [:]
            
            // Traverse existing layers
            // - Disable layer
            // - Store layer is map for later update
            log.debug "layerAsJson.title ${layerAsJson.title}"
            println "layerAsJson.title ${layerAsJson.title}"
            def rootLayer = Layer.findByServerAndTitle( server, layerAsJson.title )
            
            println "rootLayer: ${rootLayer?.getClass()}"
            
            if ( rootLayer ) {
                
                _traverseLayerTree rootLayer, {
                    println "> $it"
                    existingLayers[it.title] = it
                }
            }
            
            // Traverse incoming JSON and create or update layers (update if they are in existingLayers[])
            def newLayer = _traverseJsonLayerTree( layerAsJson, null, { newData, parent ->
                    
                def layerToUpdate = existingLayers[ newData.title ]

                if ( !layerToUpdate ) {

                    // Doesn't exist, create
                    layerToUpdate = new Layer(parent: parent, server: server)
                }

                layerToUpdate.title = newData.title
                layerToUpdate.name = newData.name ? newData.name : newData.title
                layerToUpdate.description = newData.description
                layerToUpdate.bbox = newData.bbox
                layerToUpdate.metaUrl = newData.metaUrl
                layerToUpdate.queryable = newData.queryable

                // Some defaults
                layerToUpdate.cache = false
                layerToUpdate.disabled = false
                layerToUpdate.isBaseLayer = false

                layerToUpdate.source = dataSource
                layerToUpdate.currentlyActive = true
                layerToUpdate.lastUpdated = new Date()

                return layerToUpdate
            })
            
            newLayer.printTree()
            
            newLayer.save( failOnError: true )
        }
        catch(Exception e) {
            
            throw new RuntimeException("Failure in updateWithNewData(...)", e)
        }
    }
    
    void _traverseLayerTree(Layer layer, Closure closure) {
        
        closure layer
        
        layer.layers.each{
            _traverseLayerTree it, closure
        }
    }
    
    def _traverseJsonLayerTree(JSONObject layerAsJson, Layer parent, Closure c) {
        
        def newLayer = c( layerAsJson, parent )
        
        layerAsJson.children.each{

            def newChild = _traverseJsonLayerTree( it, newLayer, c )
        }
        
        if ( parent ) {
            
            parent.addToLayers newLayer
        }
        
        return newLayer
    }
}
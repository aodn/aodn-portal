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
            
            def rootLayer = Layer.findWhere(
                server: server,
                title: layerAsJson.title,
                source: dataSource
            )
            
            println "== Find Root Layer =="
            println "server: $server"
            println "title:  ${layerAsJson.title}"
            println "source: $dataSource"
            println "found:  $rootLayer"
            println "== =============== =="
            
            println "rootLayer: ${rootLayer?.getClass()}"
            
            if ( rootLayer ) {
                
                _traverseLayerTree rootLayer, {
                    
                    println "Disabling existing layer $it"
                    
                    it.disabled = true
                    existingLayers[it.title] = it
                }
            }
            
            // Traverse incoming JSON and create or update layers (update if they are in existingLayers[])
            def newLayer = _traverseJsonLayerTree( layerAsJson, null, {
                newData, parent ->
                    
                def layerToUpdate = existingLayers[ newData.title ]

                if ( layerToUpdate ) {
                    
                    println "Found existing layer eith name. $layerToUpdate"
                }
                else {

                    println "Could not find existing layer with title: ${newData.title}. Creating new..."
                        
                    // Doesn't exist, create
                    layerToUpdate = new Layer(parent: parent, server: server)
                }

                //println "New data: $newData"
                
                def nameVal = newData.name
                def titleUsedAsName = false
                    
                if ( !nameVal ) {
                    nameVal = newData.title
                    titleUsedAsName = true
                }
                    
                layerToUpdate.title = newData.title
                layerToUpdate.name = nameVal
                layerToUpdate.description = newData.abstractText ? newData.abstractText : "<No description>"
                layerToUpdate.bbox = newData.bbox
                layerToUpdate.metaUrl = newData.metadataUrl
                layerToUpdate.queryable = newData.queryable

                // Some defaults
                layerToUpdate.cache = false
                layerToUpdate.disabled = false
                layerToUpdate.isBaseLayer = false

                layerToUpdate.source = dataSource
                layerToUpdate.currentlyActive = true
                layerToUpdate.lastUpdated = new Date()
                layerToUpdate.titleUsedAsName = titleUsedAsName

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
            
            parent.layers << newLayer
        }
        
        return newLayer
    }
}
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
                parent: null,
                dataSource: dataSource
            )

            log.debug "== Find Root Layer =="
            log.debug "server: $server"
            log.debug "parent: null"
            log.debug "source: $dataSource"
            log.debug "found:  $rootLayer"
            log.debug "====================="

            if ( rootLayer ) {
                
                _traverseLayerTree rootLayer, {
                    
                    // Only modify layers created by the scanner
                    if ( it.dataSource == dataSource ) {
                    
                        def uid = _uniqueIdentifier( it )
                        
                        log.debug "Disabling existing layer and storing for later ($uid)"
                        
                        // Check for duplicates
                        if ( existingLayers[ uid ] ) {
                            
                            log.warn "*********************************"
                            log.warn "*** Duplicate name + title id: $uid"
                            log.warn "*********************************"
                        }
                        
                        it.activeInLastScan = false
                        existingLayers[ uid ] = it
                    }
                }
            }
            
            // Traverse incoming JSON and create or update layers (update if they are in existingLayers[])
            def newLayer = _traverseJsonLayerTree( layerAsJson, null, {
                newData, parent ->

                def uid = _uniqueIdentifier( newData )
                def layerToUpdate = existingLayers[ uid ]

                if ( layerToUpdate ) {
                    
                    log.debug "Found existing layer with details: '$uid'"
                }
                else {

                    log.debug "Could not find existing layer with details: '$uid'. Creating new..."
                        
                    // Doesn't exist, create
                    layerToUpdate = new Layer()
                    layerToUpdate.server = server
                }
                   
                log.debug "Applying new values to layer: $newData"
                                    
                // Process name from title value
                def nameVal = newData.name
                def namespaceVal
                    
                // Trim namespace
                if ( nameVal ) {
                    def separatorIdx = nameVal.lastIndexOf( ":" )

                    if ( separatorIdx >= 0 ) {

                        nameVal = newData.name[ separatorIdx + 1 .. -1 ]
                        namespaceVal = newData.name[ 0 .. separatorIdx - 1 ]
                    } 
                }
                
                // Process abstractText value
                def abstractVal = newData.abstractText

                if ( !abstractVal ) {
                    abstractVal = ""
                }
                else if ( abstractVal.length() > 455 ) { // 455 is current max length of this field
                    abstractVal = abstractVal[0..451] + "..."
                }

                // process bbox data
                def bboxVal
                    
                if ( newData.bboxMinX && newData.bboxMinY && newData.bboxMaxX && newData.bboxMaxY ) {
                    
                    bboxVal = "${newData.bboxMinX},${newData.bboxMinY},${newData.bboxMaxX},${newData.bboxMaxY}"
                }
                    
                // Move data over
                layerToUpdate.parent = parent
                layerToUpdate.title = newData.title
                layerToUpdate.name = nameVal
                layerToUpdate.namespace = namespaceVal
                layerToUpdate.abstractTrimmed = abstractVal
                layerToUpdate.metaUrl = newData.metadataUrl
                layerToUpdate.queryable = newData.queryable
                layerToUpdate.bbox = bboxVal
                layerToUpdate.projection = newData.bboxProjection

                // Scan info
                layerToUpdate.dataSource = dataSource
                layerToUpdate.activeInLastScan = true
                layerToUpdate.lastUpdated = new Date()

                return layerToUpdate
            })

//            newLayer.printTree()

            newLayer.save( failOnError: true )
        }
        catch(Exception e) {

            throw new RuntimeException("Failure in updateWithNewData()", e)
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
    
    def _uniqueIdentifier( layer ) {

        
        def namePart
        
        if ( layer.name ) {
        
            namePart = layer.namespace ? "${layer.namespace}:${layer.name}" : layer.name
        }
        else {
            
            namePart = "<no name>"
        }
        
        def titlePart = layer.title ?: "<no title>"
            
        return "$namePart @@ $titlePart" 
    }
}
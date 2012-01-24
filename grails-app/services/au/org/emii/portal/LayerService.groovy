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
                name: layerAsJson.name,
                dataSource: dataSource
            )

            log.debug "== Find Root Layer =="
            log.debug "server: $server"
            log.debug "title:  ${layerAsJson.title}"
            log.debug "source: $dataSource"
            log.debug "found:  $rootLayer"

            if ( rootLayer ) {
                
                _traverseLayerTree rootLayer, {
                    
                    log.debug "Disabling existing layer $it"
                    
                    it.activeInLastScan = false
                    existingLayers[it.name] = it
                }
            }
            
            // Traverse incoming JSON and create or update layers (update if they are in existingLayers[])
            def newLayer = _traverseJsonLayerTree( layerAsJson, null, {
                newData, parent ->

                def layerToUpdate = existingLayers[ newData.name ]

                if ( layerToUpdate ) {
                    
                    log.debug "Found existing layer with name. $layerToUpdate"
                }
                else {

                    log.debug "Could not find existing layer with name: ${newData.name}. Creating new..."
                        
                    // Doesn't exist, create
                    layerToUpdate = new Layer()
                    layerToUpdate.setParent parent
                    layerToUpdate.setServer server
                }

                log.debug "Applying new values to layer: $newData"

                // Process name from title value
                def nameVal = newData.name
                def titleUsedAsName = false

                if ( !nameVal ) {
                    nameVal = newData.title
                    titleUsedAsName = true
                }
                else {
                    // Trim namespace
                    def separatorIdx = nameVal.lastIndexOf( ":" )
                    
                    if ( separatorIdx >= 0 ) {

                        nameVal = nameVal[ separatorIdx + 1 .. -1 ]
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
                layerToUpdate.title = newData.title ? newData.title : newData.name
                layerToUpdate.name = nameVal
                layerToUpdate.abstractTrimmed = abstractVal
                layerToUpdate.metaUrl = newData.metadataUrl
                layerToUpdate.queryable = newData.queryable
                layerToUpdate.bbox = bboxVal
                layerToUpdate.projection = newData.bboxProjection

                // Scan info
                layerToUpdate.dataSource = dataSource
                layerToUpdate.activeInLastScan = true
                layerToUpdate.lastUpdated = new Date()
                layerToUpdate.titleUsedAsName = titleUsedAsName

                return layerToUpdate
            })

            //newLayer.printTree()

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
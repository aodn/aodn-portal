package au.org.emii.portal

import org.codehaus.groovy.grails.web.json.JSONElement

class LayerService {

    static transactional = true

    void updateWithNewData(JSONElement layerAsJson, Server server, String dataSource) {

        try {

            def existingLayers = [:]

            // Traverse existing layers
            // - Disable layer
            // - Store layer in map for later update

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
                    
                        def uid = _uniquePathIdentifier( it, it.parent )
                        
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

                def uniquePath = _uniquePathIdentifier( newData, parent )
                def layerToUpdate = existingLayers[ uniquePath ]

                if ( layerToUpdate ) {
                    
                    log.debug "Found existing layer with details: '$uniquePath'"
                    
                    def currentParent = layerToUpdate.parent
                    
                    if ( currentParent && ( currentParent != parent ) ) {
                            
                        layerToUpdate.parent.removeFromLayers layerToUpdate
                    }

                    layerToUpdate.dimensions*.delete()
                }
                else {

                    log.debug "Could not find existing layer with details: '$uniquePath'. Creating new..."
                        
                    // Doesn't exist, create
                    layerToUpdate = new Layer()
                    layerToUpdate.server = server
                }
                   
                log.debug "Applying new values to layer: $newData"

                // Add as child of parent
                if ( parent ) parent.addToLayers layerToUpdate
                
                // Move data over
                layerToUpdate.title      = newData.title
                layerToUpdate.queryable  = newData.queryable
                layerToUpdate.bboxMinX   = newData.bboxMinX
                layerToUpdate.bboxMinY   = newData.bboxMinY
                layerToUpdate.bboxMaxX   = newData.bboxMaxX
                layerToUpdate.bboxMaxY   = newData.bboxMaxY
                layerToUpdate.projection = newData.bboxProjection

                _attachNameInfo      layerToUpdate, newData
                _attachAbstractText  layerToUpdate, newData
                _attachStyleInfo     layerToUpdate, newData
                _attachMetadataUrls  layerToUpdate, newData
                _attachWmsDimensions layerToUpdate, newData

                // Scan info
                layerToUpdate.dataSource = dataSource
                layerToUpdate.activeInLastScan = true
                layerToUpdate.lastUpdated = new Date()

                layerToUpdate.layerHierarchyPath = uniquePath

                return layerToUpdate
            })

//            newLayer.printTree()

            log.debug "Updating Layers finished."
            
            newLayer.save( failOnError: true )
        }
        catch ( Exception e ) {

            throw new RuntimeException( "Failure in updateWithNewData()", e )
        }
    }

    void _traverseLayerTree(Layer layer, Closure layerProcess) {

        layerProcess.call( layer )

        layer.layers.each {
            _traverseLayerTree it, layerProcess
        }
    }

    def _traverseJsonLayerTree(JSONElement layerAsJson, Layer parent, Closure layerProcess) {

        def newLayer = layerProcess.call( layerAsJson, parent )

        layerAsJson.children.each {

            _traverseJsonLayerTree(
                    it as JSONElement,
                    newLayer as Layer,
                    layerProcess
            )
        }

        if ( parent ) {

            parent.layers << newLayer
        }

        return newLayer
    }
    
    def _uniquePathIdentifier( layer, parent ) {
        
        def namePart
        
        if ( layer.name ) {
        
            namePart = layer.namespace ? "${layer.namespace}:${layer.name}" : layer.name
        }
        else {
            
            namePart = "<no name>"
        }
        
        def titlePart = layer.title ?: "<no title>"
        def parentPart = parent ? _uniquePathIdentifier( parent, parent.parent ) + " // " : ""
        
        return "$parentPart$namePart -- $titlePart" 
    }

    // More helpers

    def _attachNameInfo( layer, newData ) {

        def newName = newData.name

        if ( !newName ) return

        def hasNamespace = newName.contains( ":" )

        if ( !hasNamespace ) {

            layer.name = newName
        }
        else {

            def separatorIdx = newName.lastIndexOf( ":" )

            layer.name = newName[ separatorIdx + 1 .. -1 ]
            layer.namespace = newName[ 0 .. separatorIdx - 1 ]
        }
    }

    def _attachAbstractText( layer, newData ) {

        // Process abstractText value
        def abstractVal = newData.abstractText ?: ""

        if ( abstractVal.length() > 455 ) { // 455 is current max length of this field
            abstractVal = abstractVal[0..451] + "..."
        }

        layer.abstractTrimmed = abstractVal
    }

    def _attachStyleInfo( layer, newData ) {

        if ( !newData.styles ) return

        def names = newData.styles*.name

        layer.styles = names.join( "," )
    }

    def _attachMetadataUrls( layer, newData ) {

        layer.metadataUrls*.delete()
        layer.metadataUrls.clear()

        newData.metadataUrls.each {

            def metadataUrl = new MetadataUrl( layer )

            metadataUrl.format = it.format
            metadataUrl.type = it.type
            metadataUrl.onlineResource.type = it.onlineResource.type
            metadataUrl.onlineResource.href = it.onlineResource.href

            layer.metadataUrls << metadataUrl
        }
    }

    def _attachWmsDimensions( layer, newData ) {

        def dimensions = []

        newData.dimensions?.each {

            WMSDimension dim = new WMSDimension()

            dim.name = it.name
            dim.units = it.units
            dim.unitSymbol = it.unitSymbol
            dim.defaultValue = it.defaultValue
            dim.hasMultipleValues = it.hasMultipleValues
            dim.hasNearestValue = it.hasNearestValue
            dim.hasCurrent = it.hasCurrent
            dim.extent = it.extent

            dim.save()
            dimensions.add dim
        }

        layer.dimensions = dimensions
    }
}
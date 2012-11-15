package au.org.emii.portal

import org.codehaus.groovy.grails.web.json.JSONElement

class LayerService {

    static transactional = true

    def grailsApplication

    void updateWithNewData(JSONElement layerAsJson, Server server, String dataSource) {

        try {

            // Track existing and updated Layers
            def existingLayers = [:]
            def existingActiveLayerPaths = [] as Set
            def existingInactiveLayerPaths = [] as Set
            def addedLayerPaths = [] as Set
            def updatedLayerPaths = [] as Set

            // Traverse existing layers
            // - Disable layer
            // - Store layer in map for later update

            def matchingLayers = Layer.findAllWhere(
                server: server,
                parent: null,
                dataSource: dataSource
            )

            def rootLayer = matchingLayers?.getAt( 0 ) // Get first element or null

            log.info "== Find Root Layer =="
            log.info "With server: $server"
            log.info "With parent: null"
            log.info "With source: $dataSource"
            log.info "Found ${matchingLayers.size()} matching Layer(s)"
            log.info "Using: $rootLayer"
            log.debug "====================="

            if ( rootLayer ) {

                def allLayersInServer = Layer.findAllByServerAndDataSource( server, dataSource )

                log.debug "allLayersInServer: ${ allLayersInServer.size() }"

                allLayersInServer.each {

                    def uid = _uniquePathIdentifier( it, it.parent )

                    log.debug "Disabling existing layer and storing for later ($uid)"

                    // Check for duplicates
                    if ( existingLayers[ uid ] ) {

                        log.warn "*********************************"
                        log.warn "*** Duplicate name + title id: $uid"
                        log.warn "*********************************"
                    }

                    // Record for stats
                    if ( it.activeInLastScan ) {

                        existingActiveLayerPaths << uid
                    }
                    else {

                        existingInactiveLayerPaths << uid
                    }

                    // Mark inactive and store
                    it.activeInLastScan = false
                    existingLayers[ uid ] = it
                }
            }

            // Traverse incoming JSON and create or update layers (update if they are in existingLayers[])
            _traverseJsonLayerTree( layerAsJson, null, {
                newData, parent ->

                def uniquePath = _uniquePathIdentifier( newData, parent )
                def layerToUpdate = existingLayers[ uniquePath ]

                if ( layerToUpdate ) {

                    log.debug "Found existing layer with details: '$uniquePath'"

                    updatedLayerPaths << uniquePath // Record for stats

                    def currentParent = layerToUpdate.parent

                    if ( currentParent && ( currentParent != parent ) ) {

                        layerToUpdate.parent = null
                    }

                    layerToUpdate.dimensions*.delete()
                }
                else {

                    log.debug "Could not find existing layer with details: '$uniquePath'. Creating new..."

                    addedLayerPaths << uniquePath // Record for stats

                    // Doesn't exist, create
                    layerToUpdate = new Layer()
                    layerToUpdate.server = server
                }

                log.debug "Applying new values to layer: $newData"

                // Add as child of parent
                if ( parent ) layerToUpdate.parent = parent //parent.addToLayers layerToUpdate

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

				// Need to explicitly save, since saves no longer cascade to children (since fix for #1761).
				layerToUpdate.save(failOnError: true)

                return layerToUpdate
            })

            // Summary of changes
            _logAndEmailSummary( server, existingActiveLayerPaths, existingInactiveLayerPaths, addedLayerPaths, updatedLayerPaths )
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

        return "$parentPart$namePart -- $titlePart".toString() // Needs to be a String (ie. not a GString) to be used as a key in a map reliably
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

            def metadataUrl = new MetadataUrl()

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

    def _logAndEmailSummary( server, existingActiveLayerPaths, existingInactiveLayerPaths, addedLayerPaths, updatedLayerPaths ) {

        // Calculate remaining changes
        def layersMadeInactive = existingActiveLayerPaths - updatedLayerPaths
        def layersRemainingInactive = existingInactiveLayerPaths - updatedLayerPaths

        def layersReactivated = existingInactiveLayerPaths.clone()
        layersReactivated.retainAll( updatedLayerPaths )

        def labelsAndLayers = [
            [ "Layers created", addedLayerPaths ],
            [ "Layers deactivated", layersMadeInactive ],
            [ "Layers reactivated", layersReactivated ],
            [ "Layers remaining active", updatedLayerPaths ],
            [ "Layers remaining inactive", layersRemainingInactive ]
        ]

        // Write summary to log
        log.info _summaryText( server, labelsAndLayers, log.debugEnabled )

        // Email report
        if ( grailsApplication.config.wmsScanner.updateEmails.enabled ) {

            def interestingLayerChanges = addedLayerPaths.size() || layersMadeInactive.size() || layersReactivated.size()

            def menuItemsForInactiveLayersOnServer = MenuItem.executeQuery( "SELECT mi FROM MenuItem mi JOIN mi.layer l WHERE l.server = :server AND l.activeInLastScan = false", [server: server] ).findAll { it.menu != null }
            def menusAffected = menuItemsForInactiveLayersOnServer.size()

            log.debug "interestingLayerChanges: ${ interestingLayerChanges }"
            log.debug "menusAffected: ${ menusAffected }"

            if ( interestingLayerChanges || menusAffected ) {

                def emailBody = _summaryText( server, labelsAndLayers, false ) + "\n" + _summaryText( server, labelsAndLayers, true ) // Include short summary first, then full summary with Layers

                if ( menusAffected ) {

                    def menus = menuItemsForInactiveLayersOnServer.collect{ it.menu }.unique()

                    def newInfo = "Menus with inactive Layers from this Server:\n"

                    newInfo +=  menus.join( "\n" )

                    emailBody = "$newInfo\n$emailBody"
                }

                sendMail {
                    to( ["dnahodil@utas.edu.au"] )
                    subject( "WMS Scanner report from ${ grailsApplication.config.grails.serverURL } for '$server'" )
                    body( "Site: ${ grailsApplication.config.grails.serverURL }\n\n$emailBody" )
                    from( grailsApplication.config.portal.systemEmail.fromAddress )
                }
            }
        }
    }

    def _summaryText( server, labelsAndLayers, includeLayerPaths ) {

        def summary = "\n== Updating Layers finished for server: $server (${server.uri}) ==\n"

        labelsAndLayers.each {

            def label = it[ 0 ]
            def layers = it[ 1 ]

            summary += "# $label: ${ layers.size() }\n"
            if ( includeLayerPaths ) summary += layers.join( "\n" ) + "\n"
        }

        return summary
    }
}
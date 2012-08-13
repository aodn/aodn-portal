package au.org.emii.portal

import au.org.emii.portal.display.LayerPresenter
import grails.converters.JSON
import org.apache.commons.codec.binary.Base64

class Server {
    Long id
    String uri
    String shortAcron
    String name
    String type // no need for another class
    Boolean disable
    Boolean allowDiscoveries // hide from menus    
    Integer opacity // layer opacity
    String imageFormat
    String comments
    String username
    String password

    Date lastScanDate
    Integer scanFrequency = 120 // 2 hours

    static mapping = {
        sort "shortAcron"
    }
	
    static constraints = {
        uri(unique:true)
        shortAcron(unique:true,size:0..16)
        // dont change only add. 
        // getFeatureInfo request code will need to be written to use new versions
        // Openlayers should handle getMap
        type(inList:[//"WMS-1.0.0",  // to old
                       //"WMS-1.0.7", // to weird
                       //"WMS-1.1.0", // mmm
                       "WMS-1.1.1",
                       "WMS-1.3.0",
                       "NCWMS-1.1.1",
                       //"NCWMS-1.3.0", // dont support until issues resolved http://www.resc.rdg.ac.uk/trac/ncWMS/ticket/187
                       "THREDDS",
                       "GEORSS",
                       "KML",
                       "RAMADDA",
                       "AUTO" 
        ])
        lastScanDate( nullable:true )
        scanFrequency()
        name(unique:true)
        disable()
        allowDiscoveries()
        allowDiscoveries()
        opacity()
        imageFormat( inList:['image/png','image/gif'] )
        comments(nullable:true)
        username(nullable:true)
        password(nullable:true)
    }
    
    String toIdString() {
        return "${shortAcron}"
    }
    
    String toString() {
        return "${shortAcron}"
    }

	def beforeDelete() {
        MenuItem.withNewSession{
            def menuItemServers = MenuItem.findAllByServer(this)
            menuItemServers*.delete()
        }

        Layer.withNewSession {
            def dels = Layer.findAllByServer(this)
            dels*.delete()
        }

        //For some strange reason, I must include these calls
        //in order for the activeInstance to be updated with the new
        //default layers list.
        Config.activeInstance().refresh()
        Config.activeInstance().defaultLayers
    }

    def beforeValidate() {

        uri = uri?.trim()
    }

	def isCredentialled() {
		return username && password
	}
	
	def getEncodedCredentials() {
		return new String(Base64.encodeBase64("$username:$password".getBytes()))
	}

	def recache(cache) {
		def result = cache.get(this)
		if (result) {
			cache.add(this, toServerLayerJson())
		}
	}

	def toServerLayerJson() {
		def criteria = Layer.createCriteria()
		def layerDescriptors = criteria.list() {
			isNull 'parent'
			eq 'blacklisted', false
			eq 'activeInLastScan', true
			eq 'server.id', id
			join 'server'
		}

		def layersToReturn = layerDescriptors
		// If just one grouping layer, bypass it
		if ( layerDescriptors.size() == 1 &&
			layerDescriptors[0].layers.size() > 0 )
		{
			layersToReturn = layerDescriptors[0].layers
		}

		layersToReturn = _removeBlacklistedAndInactiveLayers(layersToReturn)
		def layersJsonObject = [layerDescriptors: layersToReturn]
		// Evict from the Hibernate session as modifying the layers causes a Hibernate update call
		layerDescriptors*.discard()

		return (layersJsonObject as JSON).toString()
	}

	def _removeBlacklistedAndInactiveLayers(layerDescriptors) {
		return LayerPresenter.filter(layerDescriptors, { !it.blacklisted && it.activeInLastScan })
	}
}

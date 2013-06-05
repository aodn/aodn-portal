
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.display.LayerPresenter
import grails.converters.JSON
import groovy.time.TimeCategory
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
	String infoFormat
    String comments
    String username
    String password

    Date lastScanDate
    Integer scanFrequency = 120 // 2 hours

    Set operations = [] // operations supported by this server
    Set owners = []

    static hasMany = [operations: Operation, owners: User]

    static mapping = {
        sort "shortAcron"

        operations cascade: 'all-delete-orphan'
    }

    static constraints = {
        uri(unique:true, url:true)
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
                       "GEO-1.1.1",
                       "GEO-1.3.0",
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
        opacity()
        imageFormat( inList:['image/png','image/gif'] )
        infoFormat( inList:['text/html','text/plain','image/png'] )
        comments(nullable:true)
        username(nullable:true)
        password(nullable:true)
        owners(nullable:  true, validator: {
            //This is totally not a great way to do things
            def ownerRole = UserRole.findByName(UserRole.SERVEROWNER)

            def valid = false
            if(it?.size() == 0)
                return true

            it?.roles?.each(){ r ->
                r.each(){  rr->
                    if(rr.id == ownerRole.id) {
                        valid = true
                    }
                }
            }

            if(!valid){
                return ['invalid.serverowner']
            }
            return valid
        })
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

		//save without whitespace to help avoid non-uniqueness
        uri = uri?.trim()

//		save without trailing question mark to help avoid non-uniqueness
		if(uri.getAt(uri.size()-1)=='?')
		{
			uri = uri.substring(0, uri.size()-1)
		}
//		//save without trailing slash to help avoid non-uniqueness
		if(uri.getAt(uri.size()-1)=='/')
		{
			uri = uri.substring(0, uri.size()-1)
		}

    }

	def isCredentialled() {
		return username && password
	}

	def getEncodedCredentials() {
		return new String(Base64.encodeBase64("$username:$password".getBytes()))
	}

	def recache(cache) {

		def startTime = new Date()

		def result = cache.get(this)
		if (result) {
			cache.add(this, toServerLayerJson())
		}

		use(TimeCategory) {
			log.debug "recache() on '$this' took ${new Date() - startTime}"
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

	def addAuthentication(connection) {
		if (isCredentialled()) {
			connection.setRequestProperty("Authorization", "Basic ${getEncodedCredentials()}")
		}
	}

    def updateOperations( newOperations ) {

        operations.clear()

        newOperations.each {

            def operation = new Operation()

            operation.name = it.name
            operation.formats = it.formats.join(",")
            operation.getUrl = it.getUrl
            operation.postUrl = it.postUrl

            operations << operation
        }

      }


}

package au.org.emii.portal.test

import au.org.emii.portal.Layer;
import au.org.emii.portal.Server;

class TommyController {
	
    def index = { 
		// Find/create the server
		def server = Server.findById(2)
		
		if (!server) {
			server = new Server()
			server.uri  = 'http://geoserverdev.emii.org.au/geoserver/wms'
			server.shortAcron = 'philgeodev1-3-0'
			server.type = 'WMS-1.3.0'
			server.name = 'philgeodev1-3-0'
			server.allowDiscoveries = true
			server.imageFormat = 'image/png'
			server.lastScanDate = new Date()
			server.opacity = 100
			server.disable = false
			//server.parseFrequency = 0
			
			server.save(flush:true, failOnError: true)
		}
		
		// If there are already layers bail, otherwise manually delete then
		// run again to add them
		def msg
		def layers = Layer.findAllByServer(server)
		

                
        
		if (!layers || layers.isEmpty()) {
	                def dom = new XmlSlurper().parse(server.uri + '?service=wms&version=1.3.0&request=getCapabilities')
                        layers = _parseDomToLayers(dom, server)
			layers*.save(failOnError: true)
			msg = "Layers saved"
		}
		else {
                        msg = layers.size() + " Layers already exist for Server: " + server.id + ", delete and re-run";
		}
		
		return render(msg)
    }
	
	def _parseDomToLayers(dom, server) {
		def layers = []
		dom.Capability.children().each {
			log.debug(it.name())
			if (_isLayerNode(it)) {
				layers << _parseLayer(it, server)
			}
		}
		return layers
	}
	
	def _parseLayer(node, server) {
            
		def layer = new Layer()
		layer.title = node.Title.text()
                
                println "---------------"
                println "tags:" + node.'*'.collect{ it.name() }
                println "name:" +node.name.text()
                
                
        
		//log.debug("Parsing layer ${layer.title}")
		layer.name = node.Name.isEmpty() ? layer.title : node.Name.text()
		layer.blacklisted = false
		layer.activeInLastScan = false
		layer.abstractTrimmed = _getDescription(node, layer.title)
		layer.server = server
		layer.cache = false
		layer.queryable = (node.@queryable == 1) 
		layer.activeInLastScan = (node.@queryable == 1)
		layer.isBaseLayer = false
		layer.dataSource = server.shortAcron
                /* bbox
                * 1.1.1 has SRS, LatLonBoundingBox, BoundingBox
                * 1.3.0 has Name, Title, Abstract, KeywordList, CRS[n], EX_GeographicBoundingBox, BoundingBox, Style
                *
                */
               
               if (node.BoundingBox.SRS.isEmpty()) {
                   // 1.1.1
                   layer.projection = node.CRS[0].text()
               }
               else {
                   // 1.3.0
                   layer.projection = node.SRS.text()
               }
               
               layer.bbox = node.BoundingBox.@minx.text() + "," +
                            node.BoundingBox.@miny.text() + "," +
                            node.BoundingBox.@maxx.text() + "," +
                            node.BoundingBox.@maxy.text()
               
                 
		//layer.currentlyActive = true
		
		if (!layer.abstractTrimmed) {
			log.error("No description for $layer.title")
			throw new Exception()
		}
		
		node.children().each {
			if (_isLayerNode(it)) {
				def child = _parseLayer(it, server)
				child.parent = layer
				layer.layers << child
			}
		}
		log.info((layer.projection == "").toString() + " ||  " + (layer.bbox.size() < 5).toString())
                
                if (layer.projection == "" || layer.bbox.size() < 5) {
                    // this is not a mapable layer.
                    //println "ignoreing"
                    //layer = null;
                }
                
		return layer
	}
	
	def _getDescription(node, dfault) {
		if (!node.Description.isEmpty()) {
			def desc = node.Description.text()
			if (desc.length() > 455) {
				desc = desc.subString(0, 452) + '...'
			}
			return desc
		}
		return dfault
	}
	
	def _isLayerNode(node) {
		return 'Layer' == node.name()
	}
	
	def _pad(description) {
		def padded = description
		while (padded.length() < 5) {
			padded = padded + "-"
		}
		return padded
	}
}

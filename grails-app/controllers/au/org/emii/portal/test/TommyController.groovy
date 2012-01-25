package au.org.emii.portal.test

import au.org.emii.portal.Layer;
import au.org.emii.portal.Server;

class TommyController {
	
    def index = { 
		// Find/create the server
		def server = Server.findByName("Tommy CMAR")
		
		if (!server) {
			server = new Server()
			server.uri  = 'http://www.cmar.csiro.au/geoserver/wms'
			server.shortAcron = 'TFCMAR'
			server.type = 'WMS-1.1.1'
			server.name = 'Tommy CMAR'
			server.allowDiscoveries = true
			server.imageFormat = 'image/png'
			server.parseDate = new Date()
			server.opacity = 100
			server.disable = false
			server.parseFrequency = 0
			
			server.save(flush:true, failOnError: true)
		}
		
		// If there are already layers bail, otherwise manually delete then
		// run again to add them
		def msg
		def layers = Layer.findAllByServer(server)
		if (!layers || layers.isEmpty()) {
			def dom = new XmlSlurper().parse(server.uri + '?service=wms&version=1.1.1&request=getCapabilities&namespace=mnf')
			layers = _parseDomToLayers(dom, server)
			layers*.save(failOnError: true)
			msg = "Layers saved"
		}
		else {
			msg = "Layers already exist, delete and re-run"
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
		log.debug("Parsing layer ${layer.title}")
		layer.name = node.Name.isEmpty() ? layer.title : node.Name.text()
		layer.disabled = false
		layer.description = _getDescription(node, layer.title)
		layer.server = server
		layer.cache = false
		layer.queryable = node.@queryable.text() == 1
		layer.isBaseLayer = false
		layer.source = server.shortAcron
		layer.currentlyActive = true
		
		if (!layer.description) {
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
		log.info("Layer $layer.title has id $layer.id")
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

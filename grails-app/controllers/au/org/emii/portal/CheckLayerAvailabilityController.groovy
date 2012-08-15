package au.org.emii.portal
import grails.converters.JSON

class CheckLayerAvailabilityController {

	
	def checkLayerAvailabilityService
	
    def index = { 
		def layer
		if (params.layerId != null && params.layerId?.isInteger()  ) {
			
						
			layer = checkLayerAvailabilityService.isLayerAlive(params)
			
			if (layer) {
				//print layer 
				render text: layer, status: 200
			}
			else {
				render  status: 500 // fail
			}
		}
		else {
			render text: "layerId and/or serverUri(as an  integer) not supplied", contentType: "text/html", encoding: "UTF-8", status: 500
		}
		 
		
	}
}

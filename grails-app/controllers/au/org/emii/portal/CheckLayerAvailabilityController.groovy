package au.org.emii.portal

class CheckLayerAvailabilityController {

	def checkLayerAvailabilityService
	
    def index = { 

        def isAlive

        if (params.layerId != null && params.layerId?.isInteger()  ) {

            isAlive = checkLayerAvailabilityService.isLayerAlive(params)
			
			if ( isAlive ) {

				render text: isAlive, status: 200
			}
			else {
				render status: 500 // fail
			}
		}
		else {
			render text: "layerId and/or serverUri(as an  integer) not supplied", contentType: "text/html", encoding: "UTF-8", status: 500
		}
	}
}
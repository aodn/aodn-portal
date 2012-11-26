
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class CheckLayerAvailabilityController {

	def checkLayerAvailabilityService

    def index = {

		if ( params.layerId?.isInteger() ) {

			if ( checkLayerAvailabilityService.isLayerAlive(params) ) {

				render status: 200, text: "Layer is available"
			}
			else {
				render status: 500, text: "Layer is not available"
			}
		}
		else {

			render text: "layerId not supplied or not an integer. layerId: '${params.layerId}'", contentType: "text/html", encoding: "UTF-8", status: 500
		}
	}
}

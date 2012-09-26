package au.org.emii.portal

import org.apache.commons.io.IOUtils

class OceanCurrentService {

    //static transactional = true
	def grailsApplication
	//def cfgInstanceName
	//String acron

    def getRandomDetails() {

		def acron = ""
		def imageURL = "images/OceanCurrent4AODN.png"	// fall back to the local stored image
		def speil = ""
		def parentPage = ""
		def baseURL = "http://oceancurrent.imos.org.au/"
		def fileAddress = baseURL + "sitemap/updating.txt"
		def cfgInstanceName = grailsApplication.config.instanceName.toLowerCase()

		def waodn = ['NWS/latest.gif',
						'Ningaloo/latest.gif',
						'Perth/latest.gif',
						'CLeeu/latest.gif',
						'DonPer/latest.gif',
						'AlbEsp/latest.gif',
						'sst_anom/latest.gif',
						'sst_n/latest.gif',
						'sst_s/latest.gif',
						'uv/latest.gif',
						'profiles/map/latest.gif'
					]

		try {

            def con = fileAddress.toURL().openConnection()
            con.readTimeout = 20 * 1000 // 20 seconds
            con.connect()

            def data = IOUtils.toString( con.inputStream, "UTF-8" )
            data = data.split("\n").toList()

			// Special case for West Australian portal
			if (cfgInstanceName == 'waodn') {
				data.retainAll(waodn)
			}

			if (data.size() > 0) {
				int lineCount = 0;
				data.each { lineCount++; }
				Random rand = new Random()
				lineCount = rand.nextInt(lineCount)

				def num = 0
				data.each {
					if(num == lineCount) {
						imageURL = baseURL + it
						acron = it.minus("/latest.gif")
						speil = "Latest graph for " + acron
						parentPage = "/latest.html?region=" + cfgInstanceName
					}
					num++
				}
			}
		}
		catch (Exception e) {
            log.info "ERROR: Couldnt open $fileAddress", e
        }

		return [speil: speil, acron: acron, imageURL: imageURL, baseURL: baseURL, parentPage: parentPage]
    }
}

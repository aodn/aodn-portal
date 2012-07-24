package au.org.emii.portal
import java.util.Random 

class OceanCurrentService {

    static transactional = true
	//String acron

    def getRandomDetails() {
		
		def acron = ""
		def imageURL = ""
		def speil = ""
		def parentPage = "/latest.html"
		def baseURL = "http://oceancurrent.imos.org.au/"
		def fileURL = baseURL + "sitemap/updating.txt"
		
		try {
			
			def data = new URL(fileURL).getText()		
			if (data.length() > 0) {
				int lineCount = 0;
				data.eachLine { lineCount++; } 			
				Random rand = new Random() 
				lineCount = rand.nextInt(lineCount)

				def num = 0
				data.eachLine { 
					if(num == lineCount) {
						imageURL = baseURL + it 
						acron = it.minus("/latest.gif")
						speil = "Latest graph for " + acron
					}
					num++				
				}
			}	
		}
		catch (Exception e) {
            log.info "ERROR: Couldnt open " + fileURL, e           
        }
		
		// fall back to the local stored image
		if (imageURL.length() == 0 ) {
			parentPage = ""
			imageURL = "images/OceanCurrent4AODN.png"
		}
		
		return [speil: speil, acron: acron, imageURL: imageURL, baseURL: baseURL, parentPage: parentPage]
    }
}

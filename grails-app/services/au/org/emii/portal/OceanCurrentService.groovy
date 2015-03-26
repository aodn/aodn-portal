
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.commons.io.IOUtils

class OceanCurrentService {

    def grailsApplication

    def getRandomDetails() {

        def acron = ""
        def imageURL = "images/OceanCurrent4AODN.png"    // fall back to the local stored image
        def speil = ""
        def parentPage = ""
        def baseURL = "http://oceancurrent.imos.org.au/"
        def fileAddress = baseURL + "sitemap/updating.txt"

        try {
            def con = fileAddress.toURL().openConnection()
            con.connectTimeout = 1000 // 1 second
            con.readTimeout = 2000 // 2 seconds
            con.connect()

            def data = IOUtils.toString( con.inputStream, "UTF-8" )
            data = data.split("\n").toList()

            if (data.size() > 0) {
                int lineCount = 0;
                data.each { lineCount++; }
                Random rand = new Random()
                lineCount = rand.nextInt(lineCount)

                def num = 0
                data.each {
                    if (num == lineCount) {
                        imageURL = baseURL + it
                        acron = it.minus("/latest.gif")
                        speil = "Latest graph for " + acron
                        parentPage = "/latest.html?region=IMOS"
                    }
                    num++
                }
            }
        }
        catch (Exception e) {
            log.info "Unable to load latest OceanCurrent data from '$fileAddress'"
            log.debug "Caught:", e // Only print stack trace if logger set to 'debug' level
        }

        return [speil: speil, acron: acron, imageURL: imageURL, baseURL: baseURL, parentPage: parentPage]
    }
}

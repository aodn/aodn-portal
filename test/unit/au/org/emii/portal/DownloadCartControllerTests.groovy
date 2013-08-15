
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import grails.test.ControllerUnitTestCase
import org.apache.commons.codec.net.URLCodec

class DownloadCartControllerTests extends ControllerUnitTestCase {

    void testDownload_NoEntries_ErrorReturned() {

        controller.download()

        assertEquals "No items are in the Download Cart", mockResponse.contentAsString
        // assertEquals 400, mockResponse.status // There is a bug in Grails testing code where response is always 200
    }

    void testDownload_WithEntries() {

        controller.params.items = """[
    {
        'uuid': '1111111',
        'name': 'some record',
        'title': 'its really interesting',
        'links': [
            {
                "title":"NRSNSI Mooring diagram - surface",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_surface_revA.pdf&access=private",
                "type":"application/pdf",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            },
            {
                "title":"NRSNSI Mooring diagram - sub-surface",
                "type":"application/pdf",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_subsurface_revA.pdf&access=private",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            }]
    },
    {
        'uuid': '22222',
        'name': 'another record',
        'title': 'its really really interesting',
        'links': [
            {
                "title":"NRSNSI Snoring diagram - Another Dimension",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_surface_revA.pdf&access=private",
                "type":"application/pdf",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            },
            {
                "title":"NRSNSI Snoring diagram - Another Sub Dimension",
                "type":"application/pdf",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_subsurface_revA.pdf&access=private",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            }]
    }
]"""
        controller.metaClass._outputArchiveFromItemList =  {
            
            downloadCart->

            assertEquals( downloadCart.size(), 2 )
            assertEquals( downloadCart[1].links[1].title, "NRSNSI Snoring diagram - Another Sub Dimension")
        }

        controller.download()
    }
}

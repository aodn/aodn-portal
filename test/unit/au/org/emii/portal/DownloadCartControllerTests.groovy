
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

    protected void setUp() {

        super.setUp()
    }

    protected void tearDown() {

        super.tearDown()
    }

    void testAdd_NewEntries_EntriesAdded() {

        def uniqueEntriesString  = """\
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
            }\
        """

        def entriesToTryToAdd = """\
        [
            $uniqueEntriesString,
            {
                "title":"NRSNSI Mooring diagram - sub-surface",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_subsurface_revA.pdf&access=private",
                "type":"application/pdf",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            }
        ]"""

        def expectedEntries = """\
        [
            $uniqueEntriesString
        ]"""

        def expectedSessionValue = [] as Set
        expectedSessionValue.addAll JSON.parse( expectedEntries ).toArray()

        // Reset cart
        mockRequest.session.downloadCart = []

        // Add first entries
        controller.params.newEntries = entriesToTryToAdd
        controller.add()

        // Verify result
        assertEquals expectedSessionValue, mockRequest.session.downloadCart
        assertEquals "2", mockResponse.contentAsString
    }

    void testAdd_NoEntries_ErrorReturned() {

        controller.add()

        assertEquals "No items specified to add", mockResponse.contentAsString
        // assertEquals 500, mockResponse.status // There is a bug in Grails testing code where response is always 200
    }

    void testGetSize() {

        def newEntries = """[{"a":"b"}, {"c":"d"}, {"e":"f"}]"""

        mockRequest.session.downloadCart = JSON.parse( newEntries ).toArray() as Set

        controller.getSize()

        assertEquals "3", mockResponse.contentAsString
    }

    void testClear() {

        mockRequest.session.downloadCart = ["sone thing", "and another"] as Set

        controller.clear()

        assertNull mockRequest.session.downloadCart
        assertEquals "0", mockResponse.contentAsString
    }

    void testDownload_ItemsInCart() {

        loadCodec URLCodec

        def cartContents = [[href: "http://example.com/file1.txt", title:"File One"],[href:"http://example.com/file3.jpeg", title:"File Three"],[href:"http://example.com/file2.gif", title:"File Too"]] as Set

        controller.bulkDownloadService = [
                generateArchiveOfFiles: {
                    jsonArray, outputStream, locale ->

                    assertEquals cartContents, jsonArray
                    assertEquals mockResponse.outputStream, outputStream
                },
                getArchiveFilename: {
                    locale ->

                    return "filename.zip"
                }
        ]

        // Set up mock request
        mockRequest.session.downloadCart = cartContents

        controller.download()

        // Check response properties
        assertEquals "Content disposition header", "attachment; filename=filename.zip", mockResponse.getHeader( "Content-Disposition" )
        assertEquals "Content Type", "application/octet-stream", mockResponse.getContentType()
    }

    void testDownload_EmptyCart() {

        mockRequest.session.downloadCart = []

        controller.download()

        assertEquals "home", controller.redirectArgs.controller
        assertEquals "No data in cart to download", controller.flash.message
    }

    void testGetCartRecords() {

        def cartEntries = """
                             [
                                 { "rec_uuid":"2", rec_title: "A", title : "first"},
                                 { "rec_uuid":"1", rec_title: "B", title : "first" },
                                 { "rec_uuid":"3", rec_title: "C", title : "first" },
                                 { "rec_uuid":"2", rec_title: "A", title : "second" },
                                 { "rec_uuid":"3", rec_title: "C", title : "second" },
                             ]""".stripIndent()

        mockRequest.session.downloadCart = JSON.parse( cartEntries ).toArray() as Set

        // Make the call
        controller.getCartRecords()

        def result = JSON.parse( mockResponse.contentAsString )

        assertEquals 1, result.size()

        println "result: $result"

        def recs = result.'records'

        def rec0 = recs.findAll{ r -> r.uuid == "2" }[0]

        assertNotNull rec0
        assertEquals "A", rec0.title
        assertEquals "2", rec0.uuid
        assertEquals 2, rec0.downloads.size()

        def rec1 = recs.findAll{ r -> r.uuid == "1" }[0]
        assertNotNull rec1
        assertEquals "B", rec1.title
        assertEquals "1", rec1.uuid
        assertEquals 1, rec1.downloads.size()

        def rec2 = recs.findAll{ r -> r.uuid == "3" }[0]
        assertNotNull rec2
        assertEquals "C", rec2.title
        assertEquals "3", rec2.uuid
        assertEquals 2, rec2.downloads.size()
    }

    void testRemoveRecord() {
        def cartEntries = """
                             [
                                 { disableFlag: "false", "rec_uuid":"2", rec_title: "A", title : "first"},
                                 { disableFlag: "false", "rec_uuid":"1", rec_title: "B", title : "first" },
                                 { disableFlag: "false", "rec_uuid":"3", rec_title: "C", title : "first" },
                                 { disableFlag: "false", "rec_uuid":"5", rec_title: "A", title : "second" },
                                 { disableFlag: "false", "rec_uuid":"3", rec_title: "C", title : "second" },
                             ]""".stripIndent()

        controller._setCart(JSON.parse( cartEntries ).toArray() as Set)
        controller.params.rec_uuid = "2";
        controller.params.disableFlag = "true";
        controller.modifyRecordAvailability();

        def cart = controller._getCart();

        def entriesForRec2 = cart.findAll{ r -> r.disableFlag == true }
        assertEquals 1, entriesForRec2.size()

        def entriesForRec3 = cart.findAll{ r -> r.rec_uuid == "3" }
        assertEquals 2, entriesForRec3.size()

        def entriesForRec1 = cart.findAll{ r -> r.rec_uuid == "1" }
        assertEquals 1, entriesForRec1.size()
    }
}

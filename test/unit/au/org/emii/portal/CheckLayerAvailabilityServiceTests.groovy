/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase
import grails.test.MockUtils

class CheckLayerAvailabilityServiceTests extends GrailsUnitTestCase {
    def service = new CheckLayerAvailabilityService()

    protected void setUp() {

        super.setUp()

        MockUtils.mockLogging CheckLayerAvailabilityService, true
    }

    protected void tearDown() {

        // undo any metaClass changes
        service.metaClass = null
        Server.metaClass = null

        super.tearDown()
    }

    void testIsLayerAlive_NoLayerId() {

        mockDomain Layer.class // No Layers in db

        def params = [id: 100]

        assertFalse service.isLayerAlive(params)
    }

    void testIsLayerAlive_checkGetMapResponse() {

        // Test data
        def conn = [
            getContentType: { -> return "THEIMAGEFORMAT"}
        ]

        def testLayer = [
            id: 100,
            bboxMinX: 5,
            bboxMaxX: 16,
            bboxMinY: 12,
            bboxMaxY: 30,
            name: 'Cool Layer',
            namespace: "cool",
            projection: 'EPSG:1234',
            server:  [imageFormat: "THEIMAGEFORMAT", uri: 'http://rarara']
        ] as Layer
        mockDomain(Layer, [testLayer])

        // Make the call
        assert service._testGetMap(conn, testLayer,  [ format: 'asdf'])
    }

    void testIsLayerAlive_checkFeatureInfoResponse() {

        mockDomain Layer.class, [[id: 100] as Layer]

        // Mock out other methods
        def urlReturned = {
            [
                openConnection: { [contentType: "C;D", text: "response text2"] },
            ]
        }

        service.metaClass._constructGetMapRequest = { layer, params ->
            return [toURL: urlReturned]
        }
        service.metaClass._addAuthentication = { conn, url -> /* Do nothing */ }
        service.metaClass._checkGetMapResponse = { contentType ->
            return false
        }

        service.metaClass._constructFeatureInfoRequest = { layer, params ->
            return [toURL: urlReturned]
        }

        service.metaClass._checkFeatureInfoResponse = { contentType ->
            assertEquals "C", contentType
            return true
        }
        service.metaClass._isValidFromResponse = { responseText ->
            assertEquals "response text2", responseText
            return true
        }

        service.metaClass.notifyOwner = { layer, failedOps ->
            println "notifying owner"
        }

        // Make the call
        assertFalse service.isLayerAlive([id: 100])
    }

    void testIsLayerAlive_ExceptionThrown() {

        mockDomain Layer.class, [[id: 100] as Layer]

        // Mock out other methods
        def urlReturned = {
            [
                openConnection: { [contentType: "C;D", text: "response text2"] },
            ]
        }

        service.metaClass._constructGetMapRequest = { layer, params ->
            return [toURL: { [openConnection: { throw new Exception('Test Exception') }] }]
        }

        service.metaClass._constructFeatureInfoRequest = { layer, params ->
            return [toURL: urlReturned]
        }

        service.metaClass._checkFeatureInfoResponse = { contentType ->
            assertEquals "C", contentType
            return true
        }
        service.metaClass._isValidFromResponse = { responseText ->
            assertEquals "response text2", responseText
            return true
        }

        service.metaClass.notifyOwner = { layer, failedOps ->
            println "notifying owner"
        }


        def params = [id: 100]

        assertFalse service.isLayerAlive(params)
    }

    void testAddAuthentication() {

        def authenticationAdded = false
        def foundServer = [addAuthentication: { conn -> authenticationAdded = true }]

        def testConnection = new Object() // The class is irrelevant as it is just passed-through
        def testUrl = new Object() // The class is irrelevant as it is just passed-through

        // Test 1 _getServer returns null
        service.metaClass._getServer = { url ->
            assertEquals testUrl, url // Ensure correct object is passed-through
            return null
        }

        service._addAuthentication(testConnection, testUrl)
        assertFalse authenticationAdded

        // Test 2 _getServer returns a valid server
        service.metaClass = null
        service.metaClass._getServer = { url -> foundServer }

        service._addAuthentication(testConnection, testUrl)

        assertTrue authenticationAdded
    }

    void testGetServer() {

        def testUrl = [host: 'HOST']
        def foundServer = new Server()

        Server.metaClass.static.findByUriLike = { searchString ->

            assertEquals '%HOST%', searchString

            return foundServer
        }

        assertEquals foundServer, service._getServer(testUrl)
    }

    void testGetFeatureInfo() {

        def conn = [
            getContentType: { -> return "XML"},
            inputStream: new ByteArrayInputStream("something".bytes)
        ]

        // Test data
        def testLayer = [
            bboxMinX: 5,
            bboxMaxX: 16,
            bboxMinY: 12,
            bboxMaxY: 30,
            name: 'Cool Layer',
            namespace: "cool",
            projection: 'EPSG:1234'
        ]

        def params = {}
        def called = false

        service.metaClass._isValidFromResponse = {
            String responseText ->
                called = true

                assertEquals('something', responseText)
        }

        service._testGetFeatureInfo(conn, testLayer, params)

        assertTrue called
    }

    void testIsValidFromResponse() {

        assertFalse service._isValidFromResponse('<something><WMT_MS_Capabilities><something_else>')
        assertFalse service._isValidFromResponse('some text<ServiceExceptionReport some other text')
        assertFalse service._isValidFromResponse('')

        assertTrue service._isValidFromResponse('InvalidRangeException')
        assertTrue service._isValidFromResponse('Some String which is not empty but that does not match any of the other conditions')
    }

    void testBuildUrl() {

        // Test 1 - storedUri contains '?'
        def testLayer = [server: [uri: 'STORED_URI?A=B']]
        def testFeatureInfoParams = "B=C"

        assertEquals "STORED_URI?A=B&B=C", service._buildUrl(testLayer, testFeatureInfoParams)

        // Test 2 - storedUri doesn't contain '?'
        testLayer = [server: [uri: 'STORED_URI']]

        assertEquals "STORED_URI?B=C", service._buildUrl(testLayer, testFeatureInfoParams)
    }

    void testConstructFeatureInfoRequest() {

        service.metaClass._buildUrl = { layer, params -> params }


        // Test data
        def testLayer = [
            bboxMinX: 5,
            bboxMaxX: 16,
            bboxMinY: 12,
            bboxMaxY: 30,
            name: 'Cool Layer',
            namespace: "cool",
            projection: 'EPSG:1234'
        ]

        def testParams = [
            format: 'text/plain'
        ]

        // Test 1 - Build URL with infoFormat
        def expectedResult = 'VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=cool%3ACool+Layer&STYLES=&SRS=EPSG%3A1234&CRS=EPSG%3A1234&BBOX=5.0%2C12.0%2C16%2C30&QUERY_LAYERS=cool%3ACool+Layer&X=0&Y=0&I=0&J=0&WIDTH=1&HEIGHT=1&FEATURE_COUNT=1&INFO_FORMAT=text%2Fplain'

        assertEquals expectedResult, service._constructFeatureInfoRequest(testLayer, testParams)

    }
}

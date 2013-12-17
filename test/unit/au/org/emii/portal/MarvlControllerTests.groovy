package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class MarvlControllerTests extends ControllerUnitTestCase {

    def controller

    protected void setUp() {
        super.setUp()

        controller = new MarvlController()
        controller.grailsApplication = [
            config: new ConfigSlurper().parse("""
                marvl {
                    urlList {
                        prefixToRemove = "/mnt/files/"
                        newUrlBase = "http://data.aodn.org.au/"
                    }
                }"""
            )
        ]
    }

    void testUrlListForFeatureRequest() {

        mockParams.propertyName = "the_property"

        def testParamProcessor = new Object()
        controller.metaClass.requestSingleFieldParamProcessor = { fieldName ->
            assertEquals "the_property", fieldName
            return testParamProcessor
        }

        def testStreamProcessor = new Object()
        controller.metaClass.urlListStreamProcessor = { propertyName, prefixToRemove, newUrlBase ->
            assertEquals "the_property", propertyName
            assertEquals "/mnt/files/", prefixToRemove
            assertEquals "http://data.aodn.org.au/", newUrlBase
            return testStreamProcessor
        }

        def performProxyingCalledCount = 0
        controller._performProxying = { paramProcessor, streamProcessor ->

            performProxyingCalledCount++

            assertEquals testParamProcessor, paramProcessor
            assertEquals testStreamProcessor, streamProcessor
        }

        controller.urlListForFeatureRequest()

        assertEquals 1, performProxyingCalledCount
    }

    void testUrlListForFeatureRequestPropertyNameMissing() {

        controller.urlListForFeatureRequest()

        assertEquals "No propertyName provided", mockResponse.contentAsString
    }
}

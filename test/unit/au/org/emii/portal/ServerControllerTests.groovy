/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class ServerControllerTests extends ControllerUnitTestCase {
    protected void setUp() {
        super.setUp()

        controller.grailsApplication = [
            config: [
                knownServers: [
                    [
                        uri: 'http://geoserver1.example.com',
                        type: 'some_type',
                        filteredAttribute: 'filtered'
                    ],
                    [
                        uri: 'http://geoserver2.example.com'
                    ]
                ]
            ]
        ]
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testIndex() {
        this.controller.index()
        assertEquals "list", this.controller.redirectArgs["action"]
    }

    void testShowServerByItsId() {
        mockDomain(Server, [new Server(id: 10, uri: "uri1", shortAcron: "A", name: "name1", type: "WMS-1.1.1", lastScanDate: null, scanFrequency: 0, disable: false, allowDiscoveries: true, opacity: 3, imageFormat: "image/png", comments: "", username: null, password: null)])
        this.controller.params.serverId = "10_10"
        this.controller.showServerByItsId()

        def content = this.controller.response.contentAsString
        assertTrue content.contains('"id":10')
        assertTrue content.contains('"name":"name1"')
        assertTrue content.contains('"uri":"uri1"')
        assertTrue content.contains('"shortAcron":"A"')
    }

    void testGetInfoWhenServerNotFound() {
        controller.params.server = 'nonExistingServer'
        controller.getInfo()
        assertEquals "{}", controller.response.contentAsString
    }

    void testGetInfoWhenServerFound1() {
        controller.params.server = 'http://geoserver1.example.com'
        controller.getInfo()
        assertEquals '{"uri":"http://geoserver1.example.com","type":"some_type"}', controller.response.contentAsString
    }

    void testGetInfoWhenServerFound2() {
        controller.params.server = 'http://geoserver2.example.com'
        controller.getInfo()
        assertEquals '{"uri":"http://geoserver2.example.com"}', controller.response.contentAsString
    }
}

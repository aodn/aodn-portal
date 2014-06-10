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


}

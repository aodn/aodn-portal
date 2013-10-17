/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

import java.text.SimpleDateFormat

class LayerControllerIntegrationTests extends ControllerUnitTestCase {

    def layerController

    protected void setUp() {

        super.setUp()

        layerController = new LayerController()
    }

    protected void tearDown() {

        super.tearDown()
    }

    // #1761
    void testNoDuplicatesInLayerAsJson() {

        // Create
        Server server = Server.build(uri: "http://someserver.com/path", owners: [])
        server.save()

        Layer activeLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: true)
        activeLayer.save()

        Layer inactiveLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: false)
        inactiveLayer.save()

        try {

            layerController.params.serverUri = "http://someserver.com/path"
            layerController.params.name = "imos:layername"
            layerController.findLayerAsJson()

            assertEquals(200, layerController.response.status)
        }
        catch (Exception e) {

            fail("Unexpected failure: " + e.message)
        }
        finally {

            server.delete()
        }
    }

    void testServer() {

        try {
            // Create
            Server server = Server.build(uri: "http://someserver.com/path", owners: [])
            server.save()

            Layer activeLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: true)
            activeLayer.save()

            def _server = Server.list()[0]
            layerController.params.server = _server.id
            layerController.server()
            assertEquals(200, layerController.response.status)
        }
        catch (e) {
            fail("Unexpected failure: " + e.message)
        }
    }

    void testConfiguredbaselayers() {

        Server s1 = Server.build(name: "s1", uri: "http://someserver.com/", shortAcron: "s1", owners: []).save()
        Server s2 = Server.build(name: "s2", uri: "http://someotherserver.com/", shortAcron: "s2", owners: []).save()
        Server s3 = Server.build(name: "s3", uri: "http://thirdserver.com/", shortAcron: "s3", owners: []).save()

        Layer l1 = Layer.build(parent: null, server: s1, namespace: "imos", name: "Layer1", cql: null, activeInLastScan: true).save()
        Layer l2 = Layer.build(parent: null, server: s2, namespace: "imos", name: "Layer2", cql: null, activeInLastScan: true).save()
        Layer l3 = Layer.build(parent: null, server: s3, namespace: "imos", name: "Layer3", cql: null, activeInLastScan: true).save()
        Layer l4 = Layer.build(parent: null, server: s1, namespace: "imos", name: "Layer4", cql: null, activeInLastScan: true).save()

        Menu menu = Menu.build(menuItems: [] as SortedSet).save()
        menu.with{
            addToMenuItems([layer: l2, menuPosition: 1, text: "Layer 2 menu item", leaf: true])
            addToMenuItems([layer: l4, menuPosition: 2, text: "Layer 4 menu item", leaf: true])
            addToMenuItems([layer: l1, menuPosition: 3, text: "Layer 1 menu item", leaf: true])
        }

        Config.build(baselayerMenu: menu)

        def expectedOutput = """\
[\
${_layerAndServerString(l2)},\
${_layerAndServerString(l4)},\
${_layerAndServerString(l1)}\
]\
"""

        layerController.configuredbaselayers()
        def testResult = mockResponse.contentAsString

        println _layerAndServerString(l2)
        println testResult
        assertTrue testResult.contains(_layerAndServerString(l2))
        assertTrue testResult.contains(_layerAndServerString(l4))
        assertTrue testResult.contains(_layerAndServerString(l1))
    }

    def _layerAndServerString = {
        layer ->

            def server = layer.server

            // Ensure timezone is set
            def formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
            formatter.timeZone = TimeZone.getTimeZone("GMT")
            def lastUpdatedString = formatter.format(layer.lastUpdated)

            // Just substitue the values tht aren't set by default
            return """{\
"abstractTrimmed":"",\
"activeInLastScan":true,\
"allStyles":[],\
"available":true,\
"bboxMaxX":null,\
"bboxMaxY":null,\
"bboxMinX":null,\
"bboxMinY":null,\
"blacklisted":false,\
"cache":false,\
"cql":null,\
"dataSource":"dataSource",\
"filters":[],\
"id":${layer.id},\
"isBaseLayer":false,\
"lastUpdated":"${lastUpdatedString}",\
"layerHierarchyPath":null,\
"layers":[],\
"name":"${layer.name}",\
"namespace":"imos",\
"overrideMetadataUrl":null,\
"projection":null,\
"queryable":false,\
"server":{"class":"au.org.emii.portal.Server","id":${server.id},"allowDiscoveries":false,"comments":null,"disable":false,"imageFormat":"image/png","infoFormat":"text/html","lastScanDate":null,"name":"${server.name}","opacity":0,"operations":[],"owners":[],"password":null,"scanFrequency":120,"shortAcron":"${server.shortAcron}","type":"WMS-1.1.1","uri":"${server.uri}","username":null},\
"styles":[],\
"title":null,\
"version":0,\
"viewParams":null,\
"wfsLayer":null}"""
    }
}

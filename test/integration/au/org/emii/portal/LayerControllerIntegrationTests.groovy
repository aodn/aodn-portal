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


    void testLayerAsJsonWithNamespace() {

        // Create
        Server server = Server.build(uri: "http://someserver.com/path/wms?namespace=imos", owners: [])
        server.save()

        Layer activeLayer = Layer.build(parent: null, server: server, namespace: "imos", name: "layername", cql: null, activeInLastScan: true)
        activeLayer.save()

        try {

            layerController.params.serverUri = "http://someserver.com/path/imos/wms"
            layerController.params.name = "imos:layername"
            layerController.findLayerAsJson()

            assertEquals(200, layerController.response.status)
            def scum = layerController.response.status
            def scum2 = scum
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
"server":{"class":"au.org.emii.portal.Server","id":${server.id},"allowDiscoveries":false,"comments":null,"disable":false,"imageFormat":"image/png","infoFormat":"text/html","lastScanDate":null,"name":"${server.name}","opacity":0,"operations":[],"owners":[],"password":null,"scanFrequency":120,"shortAcron":"${server.shortAcron}","type":"WMS-1.1.1","uri":"${server.uri}","urlListDownloadPrefixToRemove":null,"urlListDownloadPrefixToSubstitue":null,"username":null},\
"styles":[],\
"title":null,\
"urlDownloadFieldName":null,\
"version":0,\
"viewParams":null,\
"wfsLayer":null}"""
    }
}

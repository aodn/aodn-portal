/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import grails.test.ControllerUnitTestCase

class LayerControllerIntegrationTests extends ControllerUnitTestCase {

    def layerController

    protected void setUp() {

        super.setUp()

        layerController = new LayerController()
        layerController.metaClass._getAodaacProductInfo = { null }
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

    void testFindLayerAsJson() {
        Server serverInstance = new Server(
            uri: "http://geoserver.emii.org.au/geoserver/wms",
            allowDiscoveries: true,
            disable: false,
            imageFormat: "image/png",
            infoFormat: "text/plain",
            name: "",
            opacity: 1,
            shortAcron: "",
            type: "WMS-1.1.1"
        )

        serverInstance.save(failOnError: true)

        Layer layerInstance = new Layer(namespace: "imos", name: "argo_float_mv", server: serverInstance, dataSource: "Manual")
        // Faking the wMS scanner bug
        Layer layerInstance2 = new Layer(namespace: "imos", name: "argo_float_mv", server: serverInstance, dataSource: "Manual")

        layerInstance.save(failOnError: true)
        layerInstance2.save(failOnError: true)

        def controller = new LayerController()

        controller.params.serverUri = serverInstance.uri
        controller.params.name = "imos:argo_float_mv"

        controller.findLayerAsJson()

        def layerAsJson = JSON.parse(controller.response.contentAsString)

        assertEquals(layerInstance.id, layerAsJson.id)
        assertEquals("imos", layerAsJson.namespace)
        assertEquals("argo_float_mv", layerAsJson.name)
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
}

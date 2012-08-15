package au.org.emii.portal

import grails.converters.JSON

class LayerServiceTests extends GroovyTestCase {
    
    // The service
    def layerService
    
    // Long abstract text
    def fullAbstractText    = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris volutpat justo a risus mattis sagittis. Duis elementum, nisi quis fringilla bibendum, magna neque vulputate odio, ut malesuada metus quam sit amet enim. Phasellus in libero ipsum, at auctor purus. Integer sodales lobortis vulputate. Sed nibh elit, malesuada ac rhoncus eget, vehicula at ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris eleifend aliquet dolor."
    def trimmedAbstractText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris volutpat justo a risus mattis sagittis. Duis elementum, nisi quis fringilla bibendum, magna neque vulputate odio, ut malesuada metus quam sit amet enim. Phasellus in libero ipsum, at auctor purus. Integer sodales lobortis vulputate. Sed nibh elit, malesuada ac rhoncus eget, vehicula at ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. M..."

    // layerHierarchyPaths
    def layerAHierarchyPath = "existing layer A hierarchy path"
    def layerBHierarchyPath = "existing layer B hierarchy path"
    def layerCHierarchyPath = "existing layer C hierarchy path"

    def server
    def layerDataSource = "testCode"
    def newData = """
{
    name: "layer_a",
    title: "Layer A",
    abstractText: "$fullAbstractText",
    queryable: true,
    bboxMinX: "-90",
    bboxMinY: "-180",
    bboxMaxX: "90",
    bboxMaxY: "180",
    bboxProjection: "EPSG:2010",
    children: [
        {
            name: "awesomeSauce:layer_c",
            title: "Layer C",
            queryable: false,
            children: [
                {
                    title: "Grouping",
                    queryable: false,
                    children: [
                        { name: "layer_c_1" , queryable: true },
                        { name: "layer_c_2", queryable: true }
                    ]
                }
            ],
             metadataUrls: [
                {
                    type: "link1type",
                    format: "fmt1",
                    onlineResource: {
                        type: "simple",
                        href: "http://www.goofle.com/"
                    }
                }
            ]
        },
        {
            title: "Layer D",
            abstractText: "Just some layer, yo.",
            queryable: false,
            styles: [
                {
                    title: "boxfill/alg",
                    name: "boxfill/alg",
                    abstractText: "boxfill style, using the alg palette",
                    legends: []
                },
                {
                    title: "boxfill/redblue",
                    name: "boxfill/redblue",
                    abstractText: "boxfill style, using the redblue palette",
                    legends: []
                }
            ],
            metadataUrls: [
                {
                    type: "link1type",
                    format: "fmt1",
                    onlineResource: {
                        type: "simple",
                        href: "http://www.goofle.com/"
                    }
                },
                {
                    type: "link2type",
                    format: "fmt2",
                    onlineResource: {
                        type: "complex",
                        href: "http://www.goofle.com/too"
                    }
                }
            ],
            children: [
                {
                    title: "Grouping",
                    queryable: false,
                    children: [
                        { name: "layer_d_1", queryable: true, children: [] }
                    ]
                }
            ]
        }
    ]
}"""
    
    protected void setUp() {
        
        super.setUp()
        
        server = new Server( uri: "http://www.testserver.com/asdf/", name: "TestServer", shortAcron: "TS", type: "AUTO", allowDiscoveries: true, imageFormat: "image/png", infoFormat: "text/plain", disable: false, opacity: 100 )
        server.save( failOnError: true )
    }

    protected void tearDown() {

        super.tearDown()
    }

    void testUpdateWithNewData_NoExistingLayers() {

        assertEquals "Should be 0 layers to start with", 0, Layer.count()

        layerService.updateWithNewData(
                JSON.parse( newData ),
                server as Server,
                layerDataSource as String )

        _verifyHierarchy false /* Test didn't have existing Layers */
    }

    void testUpdateWithNewData_ExistingHierarchy() {

        def layerA = new Layer( title: "Layer A", name: "layer_a", dataSource: "testCode", server: server, layerHierarchyPath: layerAHierarchyPath )
        def layerB = new Layer( title: "Layer B", name: "layer_b", dataSource: "testCode", server: server, layerHierarchyPath: layerBHierarchyPath )
        def layerC = new Layer( title: "Leyar C (oops, typos)", name: "layer_c", dataSource: "testCode", server: server, layerHierarchyPath: layerCHierarchyPath )

        def layerCMetadataUrl = new MetadataUrl()
        layerCMetadataUrl.format = "fmt"
        layerCMetadataUrl.type = "type"
        layerCMetadataUrl.onlineResource = new OnlineResource( type: "type", href: "href" )

        layerB.save( failOnError: true )
        layerC.save( failOnError: true )
        layerCMetadataUrl.save( failOnError: true )
        layerA.addToLayers layerB
        layerA.addToLayers layerC
        layerA.save( failOnError: true )

        assertEquals "Should be 3 layers to start with", 3, Layer.count()
        assertEquals "Should be 1 metadataUrl to start with", 1, MetadataUrl.count()

        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource

        _verifyHierarchy true /* Test had existing Layers */
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
        
        layerInstance.save(failOnError: true)
        
        def controller = new LayerController()
        
        controller.params.serverUri = serverInstance.uri
        controller.params.name = "imos:argo_float_mv"
        
        controller.findLayerAsJson()
        
        def layerAsJson = JSON.parse(controller.response.contentAsString)

        assertEquals(layerInstance.id, layerAsJson.id)
        assertEquals("imos", layerAsJson.namespace)
        assertEquals("argo_float_mv", layerAsJson.name)
    }
    
    void testUpdateWithNewData_NoExistingThenUpdateProcessedTwice() {
        
        assertEquals "Should be 0 layers to start with", 0, Layer.count()
        
        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource
        
        _verifyHierarchy false /* Test didn't have existing Layers */

        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource
        
        _verifyHierarchy false /* Test didn't have existing Layers */
    }
    
    void _verifyHierarchy(boolean hadExistingBAndC) {

        def numLayersExpected = hadExistingBAndC ? 10 : 8
        def layerAExpectedChildren = hadExistingBAndC ? 4 : 2
        def numberExpectedMetadataUrls = hadExistingBAndC ? 4 : 3

        assertEquals "Should be ${numLayersExpected} layers in the end.", numLayersExpected, Layer.count()

        // Root layer (layer_a)
        def layerA = Layer.findWhere( server: server, name: "layer_a" )

        assertNotNull "layer_a should exist.", layerA
        assertEquals "layer_a property title.", "Layer A", layerA.title
        assertEquals "layer_a property abstractTrimmed.", trimmedAbstractText, layerA.abstractTrimmed
        assertEquals "layer_a property queryable.", true, layerA.queryable
        assertEquals "layer_a property bboxMinX.", "-90", layerA.bboxMinX
        assertEquals "layer_a property bboxMinY.", "-180", layerA.bboxMinY
        assertEquals "layer_a property bboxMaxX.", "90", layerA.bboxMaxX
        assertEquals "layer_a property bboxMaxY.", "180", layerA.bboxMaxY
        assertEquals "layer_a property projection.", "EPSG:2010", layerA.projection
        assertEquals "layer_a property dataSource.", "testCode", layerA.dataSource
        assertEquals "layer_a property activeInLastScan.", true, layerA.activeInLastScan
        assertNotNull "layer_a property lastUpdated should exist.", layerA.lastUpdated
        assertEquals "layer_a property lastUpdated.", "java.util.Date", layerA.lastUpdated.class.name
        assertNull   "layer_a shouldn't have a parent.", layerA.parent
        assertEquals "layer_a should have $layerAExpectedChildren child layers.", layerAExpectedChildren, layerA.layers.size()
        assertEquals "layer_a -- Layer A", layerA.layerHierarchyPath

        // Existing child (layer_b) if applicable
        if ( hadExistingBAndC ) {
            def layerB = Layer.findWhere( server: server, name: "layer_b" )

            assertNotNull "layer_b should exist.", layerB
            assertEquals "layer_b property title.", "Layer B", layerB.title
            assertEquals "layer_b property abstractTrimmed.", "", layerB.abstractTrimmed
            assertEquals "layer_b property queryable.", false, layerB.queryable
            assertEquals "layer_a property bboxMinX.", null, layerB.bboxMinX
            assertEquals "layer_a property bboxMinY.", null, layerB.bboxMinY
            assertEquals "layer_a property bboxMaxX.", null, layerB.bboxMaxX
            assertEquals "layer_a property bboxMaxY.", null, layerB.bboxMaxY
            assertEquals "layer_b property projection.", null, layerB.projection
            assertEquals "layer_b property dataSource.", "testCode", layerB.dataSource
            assertEquals "layer_b property activeInLastScan.", false, layerB.activeInLastScan
            assertNotNull "layer_b property lastUpdated should exist.", layerB.lastUpdated
            assertEquals "layer_b property lastUpdated.", "java.util.Date", layerB.lastUpdated.class.name
            assertEquals "layer_b parent should be layer_a.", layerA, layerB.parent
            assertEquals "layer_b should have no child layers.", 0, layerB.layers.size()
            assertEquals layerBHierarchyPath, layerB.layerHierarchyPath

            def existingC = Layer.findWhere( server: server, title: "Leyar C (oops, typos)" )
            assertNotNull "Leyar C should exist.", existingC
            assertEquals "Leyar C property name.", "layer_c", existingC.name
            assertEquals "Leyar C property namespace.", null, existingC.namespace
            assertEquals "Leyar C property abstractTrimmed.", "", existingC.abstractTrimmed
            assertEquals "Leyar C property queryable.", false, existingC.queryable
            assertEquals "layer_a property bboxMinX.", null, existingC.bboxMinX
            assertEquals "layer_a property bboxMinY.", null, existingC.bboxMinY
            assertEquals "layer_a property bboxMaxX.", null, existingC.bboxMaxX
            assertEquals "layer_a property bboxMaxY.", null, existingC.bboxMaxY
            assertEquals "Leyar C property projection.", null, existingC.projection
            assertEquals "Leyar C property dataSource.", "testCode", existingC.dataSource
            assertEquals "Leyar C property activeInLastScan.", false, existingC.activeInLastScan
            assertNotNull "Leyar C property lastUpdated should exist.", existingC.lastUpdated
            assertEquals "Leyar C property lastUpdated.", "java.util.Date", existingC.lastUpdated.class.name
            assertEquals "Leyar C parent should be layer_a.", layerA, existingC.parent
            assertEquals "Leyar C should have no child layers.", 0, existingC.layers.size()
            assertEquals layerCHierarchyPath, existingC.layerHierarchyPath
        }

        // New children (layer_c, layer_c_1, layer_d, layer_d_1)
        def layerC = Layer.findWhere( server: server, title: "Layer C" )
        assertNotNull "layer_c should exist.", layerC
        assertEquals "layer_c property name.", "layer_c", layerC.name
        assertEquals "layer_c property namespace.", "awesomeSauce", layerC.namespace
        assertEquals "layer_c property abstractTrimmed.", "", layerC.abstractTrimmed
        assertEquals "layer_c property queryable.", false, layerC.queryable
        assertEquals "layer_a property bboxMinX.", null, layerC.bboxMinX
        assertEquals "layer_a property bboxMinY.", null, layerC.bboxMinY
        assertEquals "layer_a property bboxMaxX.", null, layerC.bboxMaxX
        assertEquals "layer_a property bboxMaxY.", null, layerC.bboxMaxY
        assertEquals "layer_c property projection.", null, layerC.projection
        assertEquals "layer_c property dataSource.", "testCode", layerC.dataSource
        assertEquals "layer_c property activeInLastScan.", true, layerC.activeInLastScan
        assertNotNull "layer_c property lastUpdated should exist.", layerC.lastUpdated
        assertEquals "layer_c property lastUpdated.", "java.util.Date", layerC.lastUpdated.class.name
        assertEquals "layer_c parent should be layer_a.", layerA, layerC.parent
        assertEquals "layer_c should have one child layer.", 1, layerC.layers.size()
        assertEquals "layer_a -- Layer A // awesomeSauce:layer_c -- Layer C", layerC.layerHierarchyPath

        def groupingUnderC = layerC.layers.toArray()[0]
        assertNotNull "'Grouping' should exist under Layer C.", groupingUnderC
        assertEquals "groupingUnderC property title.", "Grouping", groupingUnderC.title
        assertNull "groupingUnderC property name.", groupingUnderC.name
        assertEquals "groupingUnderC parent should be Layer C.", layerC, groupingUnderC.parent
        assertEquals "groupingUnderC should have two child layers.", 2, groupingUnderC.layers.size()
        assertEquals "layer_a -- Layer A // awesomeSauce:layer_c -- Layer C // <no name> -- Grouping", groupingUnderC.layerHierarchyPath

        def layerC1 = Layer.findWhere( server: server, name: "layer_c_1" )
        assertNotNull "layer_c_1 should exist.", layerC1
        assertNull "layer_c_1 property title.", layerC1.title
        assertEquals "layer_c_1 parent should be Grouing (under Layer C).", groupingUnderC, layerC1.parent
        assertEquals "layer_c_1 should have no child layers.", 0, layerC1.layers.size()
        assertEquals "layer_a -- Layer A // awesomeSauce:layer_c -- Layer C // <no name> -- Grouping // layer_c_1 -- <no title>", layerC1.layerHierarchyPath

        def layerC2 = Layer.findWhere( server: server, name: "layer_c_2" )
        assertNotNull "layer_c_2 should exist.", layerC2
        assertNull "layer_c_2 property title.", layerC2.title
        assertEquals "layer_c_2 parent should be Grouing (under Layer C).", groupingUnderC, layerC2.parent
        assertEquals "layer_c_2 should have no child layers.", 0, layerC2.layers.size()
        assertEquals "layer_a -- Layer A // awesomeSauce:layer_c -- Layer C // <no name> -- Grouping // layer_c_2 -- <no title>", layerC2.layerHierarchyPath

        def layerD = Layer.findWhere( server: server, title: "Layer D", name: null )
        assertNotNull "layer_d should exist", layerD
        assertEquals "layer_d property abstractTrimmed", "Just some layer, yo.", layerD.abstractTrimmed
        assertEquals "layer_d property queryable", false, layerD.queryable
        assertEquals "layer_a property bboxMinX.", null, layerD.bboxMinX
        assertEquals "layer_a property bboxMinY.", null, layerD.bboxMinY
        assertEquals "layer_a property bboxMaxX.", null, layerD.bboxMaxX
        assertEquals "layer_a property bboxMaxY.", null, layerD.bboxMaxY
        assertEquals "layer_d property projection", null, layerD.projection
        assertEquals "layer_d property styles", "boxfill/alg,boxfill/redblue", layerD.styles
        assertEquals "layer_d property dataSource", "testCode", layerD.dataSource
        assertEquals "layer_d property activeInLastScan", true, layerD.activeInLastScan
        assertNotNull "layer_d property lastUpdated should exist", layerD.lastUpdated
        assertEquals "layer_d property lastUpdated", "java.util.Date", layerD.lastUpdated.class.name
        assertEquals "layer_d parent should be layer_a.", layerA, layerD.parent
        assertEquals "layer_d should have one child layer.", 1, layerD.layers.size()
        assertEquals "layer_a -- Layer A // <no name> -- Layer D", layerD.layerHierarchyPath

        // Test metadataUrls
        assertEquals numberExpectedMetadataUrls, MetadataUrl.count()
        assertEquals 2, layerD.metadataUrls.size()

        layerD.metadataUrls.each {

            switch ( it.onlineResource.href ) {

                case "http://www.goofle.com/":

                    assertEquals "link1type", it.type
                    assertEquals "fmt1", it.format
                    assertEquals "simple", it.onlineResource.type
                    break;

                case "http://www.goofle.com/too":

                    assertEquals "link2type", it.type
                    assertEquals "fmt2", it.format
                    assertEquals "complex", it.onlineResource.type
                    break;

                default: fail "Not one of the expected values"
            }
        }

        def groupingUnderD = layerD.layers.toArray()[0]
        assertNotNull "'Grouping' should exist under Layer D.", groupingUnderD
        assertEquals "groupingUnderD property title.", "Grouping", groupingUnderD.title
        assertNull "groupingUnderD property name.", groupingUnderD.name
        assertEquals "groupingUnderD parent should be Layer D.", layerD, groupingUnderD.parent
        assertEquals "groupingUnderD should have one child layer.", 1, groupingUnderD.layers.size()
        assertEquals "layer_a -- Layer A // <no name> -- Layer D // <no name> -- Grouping", groupingUnderD.layerHierarchyPath

        def layerD1 = Layer.findWhere( server: server, name: "layer_d_1" )
        assertNotNull "layer_d_1 should exist.", layerD1
        assertNull "layer_d_1 property title.", layerD1.title
        assertEquals "layer_d_1 parent should be Grouing (under Layer D).", groupingUnderD, layerD1.parent
        assertEquals "layer_d_1 should have no child layers.", 0, layerD1.layers.size()
        assertEquals "layer_a -- Layer A // <no name> -- Layer D // <no name> -- Grouping // layer_d_1 -- <no title>", layerD1.layerHierarchyPath
    }
}
package au.org.emii.portal

import grails.converters.*

class LayerServiceTests extends GroovyTestCase {
    
    // The service
    def layerService
    
    // Long abstract text
    def fullAbstractText    = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris volutpat justo a risus mattis sagittis. Duis elementum, nisi quis fringilla bibendum, magna neque vulputate odio, ut malesuada metus quam sit amet enim. Phasellus in libero ipsum, at auctor purus. Integer sodales lobortis vulputate. Sed nibh elit, malesuada ac rhoncus eget, vehicula at ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris eleifend aliquet dolor."
    def trimmedAbstractText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris volutpat justo a risus mattis sagittis. Duis elementum, nisi quis fringilla bibendum, magna neque vulputate odio, ut malesuada metus quam sit amet enim. Phasellus in libero ipsum, at auctor purus. Integer sodales lobortis vulputate. Sed nibh elit, malesuada ac rhoncus eget, vehicula at ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. M..."
    
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
    metadataUrl: "urlA",
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
        
        server = new Server( uri: "http://www.testserver.com/asdf/", name: "TestServer", shortAcron: "TS", type: "AUTO", allowDiscoveries: true, imageFormat: "image/png", disable: false, opacity: 100 )
        server.save( failOnError: true )
    }

    protected void tearDown() {

        super.tearDown()
    }

    void testUpdateWithNewData_NoExistingLayers() {

        assertEquals "Should be 0 layers to start with", 0, Layer.count()

        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource

        _verifyHierarchy false /* Test didn't have existing Layers */
    }

    void testUpdateWithNewData_ExistingHierarchy() {

        def layerA = new Layer( title: "Layer A", name: "layer_a", dataSource: "testCode", server: server )
        def layerB = new Layer( title: "Layer B", name: "layer_b", dataSource: "testCode", server: server )
        def layerC = new Layer( title: "Leyar C (oops, typos)", name: "layer_c", dataSource: "testCode", server: server )

        layerB.save( failOnError: true )
        layerC.save( failOnError: true )
        layerA.addToLayers layerB
        layerA.addToLayers layerC
        layerA.save( failOnError: true )

        assertEquals "Should be 3 layers to start with", 3, Layer.count()

        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource

        _verifyHierarchy true /* Test had existing Layers */
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

        assertEquals "Should be ${numLayersExpected} layers in the end.", numLayersExpected, Layer.count()

        // Root layer (layer_a)
        def layerA = Layer.findWhere( server: server, name: "layer_a" )

        assertNotNull "layer_a should exist.", layerA
        assertEquals "layer_a property title.", "Layer A", layerA.title
        assertEquals "layer_a property abstractTrimmed.", trimmedAbstractText, layerA.abstractTrimmed
        assertEquals "layer_a property metaUrl.", "urlA", layerA.metaUrl
        assertEquals "layer_a property queryable.", true, layerA.queryable
        assertEquals "layer_a property bbox.", "-90,-180,90,180", layerA.bbox
        assertEquals "layer_a property projection.", "EPSG:2010", layerA.projection
        assertEquals "layer_a property dataSource.", "testCode", layerA.dataSource
        assertEquals "layer_a property activeInLastScan.", true, layerA.activeInLastScan
        assertNotNull "layer_a property lastUpdated should exist.", layerA.lastUpdated
        assertEquals "layer_a property lastUpdated.", "java.util.Date", layerA.lastUpdated.class.name
        assertNull   "layer_a shouldn't have a parent.", layerA.parent
        assertEquals "layer_a should have $layerAExpectedChildren child layers.", layerAExpectedChildren, layerA.layers.size()

        // Existing child (layer_b) if applicable
        if ( hadExistingBAndC ) {
            def layerB = Layer.findWhere( server: server, name: "layer_b" )

            assertNotNull "layer_b should exist.", layerB
            assertEquals "layer_b property title.", "Layer B", layerB.title
            assertEquals "layer_b property abstractTrimmed.", "", layerB.abstractTrimmed
            assertEquals "layer_b property metaUrl.", null, layerB.metaUrl
            assertEquals "layer_b property queryable.", false, layerB.queryable
            assertEquals "layer_b property bbox.", null, layerB.bbox
            assertEquals "layer_b property projection.", null, layerB.projection
            assertEquals "layer_b property dataSource.", "testCode", layerB.dataSource
            assertEquals "layer_b property activeInLastScan.", false, layerB.activeInLastScan
            assertNotNull "layer_b property lastUpdated should exist.", layerB.lastUpdated
            assertEquals "layer_b property lastUpdated.", "java.util.Date", layerB.lastUpdated.class.name
            assertEquals "layer_b parent should be layer_a.", layerA, layerB.parent
            assertEquals "layer_b should have no child layers.", 0, layerB.layers.size()

            def existingC = Layer.findWhere( server: server, title: "Leyar C (oops, typos)" )
            assertNotNull "Leyar C should exist.", existingC
            assertEquals "Leyar C property name.", "layer_c", existingC.name
            assertEquals "Leyar C property namespace.", null, existingC.namespace
            assertEquals "Leyar C property abstractTrimmed.", "", existingC.abstractTrimmed
            assertEquals "Leyar C property metaUrl.", null, existingC.metaUrl
            assertEquals "Leyar C property queryable.", false, existingC.queryable
            assertEquals "Leyar C property bbox.", null, existingC.bbox
            assertEquals "Leyar C property projection.", null, existingC.projection
            assertEquals "Leyar C property dataSource.", "testCode", existingC.dataSource
            assertEquals "Leyar C property activeInLastScan.", false, existingC.activeInLastScan
            assertNotNull "Leyar C property lastUpdated should exist.", existingC.lastUpdated
            assertEquals "Leyar C property lastUpdated.", "java.util.Date", existingC.lastUpdated.class.name
            assertEquals "Leyar C parent should be layer_a.", layerA, existingC.parent
            assertEquals "Leyar C should have no child layers.", 0, existingC.layers.size()
        }

        // New children (layer_c, layer_c_1, layer_d, layer_d_1)
        def layerC = Layer.findWhere( server: server, title: "Layer C" )
        assertNotNull "layer_c should exist.", layerC
        assertEquals "layer_c property name.", "layer_c", layerC.name
        assertEquals "layer_c property namespace.", "awesomeSauce", layerC.namespace
        assertEquals "layer_c property abstractTrimmed.", "", layerC.abstractTrimmed
        assertEquals "layer_c property metaUrl.", null, layerC.metaUrl
        assertEquals "layer_c property queryable.", false, layerC.queryable
        assertEquals "layer_c property bbox.", null, layerC.bbox
        assertEquals "layer_c property projection.", null, layerC.projection
        assertEquals "layer_c property dataSource.", "testCode", layerC.dataSource
        assertEquals "layer_c property activeInLastScan.", true, layerC.activeInLastScan
        assertNotNull "layer_c property lastUpdated should exist.", layerC.lastUpdated
        assertEquals "layer_c property lastUpdated.", "java.util.Date", layerC.lastUpdated.class.name
        assertEquals "layer_c parent should be layer_a.", layerA, layerC.parent
        assertEquals "layer_c should have one child layer.", 1, layerC.layers.size()

        def groupingUnderC = layerC.layers.toArray()[0]
        assertNotNull "'Grouping' should exist under Layer C.", groupingUnderC
        assertEquals "groupingUnderC property title.", "Grouping", groupingUnderC.title
        assertNull "groupingUnderC property name.", groupingUnderC.name
        assertEquals "groupingUnderC parent should be Layer C.", layerC, groupingUnderC.parent
        assertEquals "groupingUnderC should have two child layers.", 2, groupingUnderC.layers.size()

        def layerC1 = Layer.findWhere( server: server, name: "layer_c_1" )
        assertNotNull "layer_c_1 should exist.", layerC1
        assertNull "layer_c_1 property title.", layerC1.title
        assertEquals "layer_c_1 parent should be Grouing (under Layer C).", groupingUnderC, layerC1.parent
        assertEquals "layer_c_1 should have no child layers.", 0, layerC1.layers.size()

        def layerC2 = Layer.findWhere( server: server, name: "layer_c_2" )
        assertNotNull "layer_c_2 should exist.", layerC2
        assertNull "layer_c_2 property title.", layerC2.title
        assertEquals "layer_c_2 parent should be Grouing (under Layer C).", groupingUnderC, layerC2.parent
        assertEquals "layer_c_2 should have no child layers.", 0, layerC2.layers.size()

        def layerD = Layer.findWhere( server: server, title: "Layer D", name: null )
        assertNotNull "layer_d should exist", layerD
        assertEquals "layer_d property abstractTrimmed", "Just some layer, yo.", layerD.abstractTrimmed
        assertEquals "layer_d property metaUrl", null, layerD.metaUrl
        assertEquals "layer_d property queryable", false, layerD.queryable
        assertEquals "layer_d property bbox", null, layerD.bbox
        assertEquals "layer_d property projection", null, layerD.projection
        assertEquals "layer_d property styles", "boxfill/alg,boxfill/redblue", layerD.styles
        assertEquals "layer_d property dataSource", "testCode", layerD.dataSource
        assertEquals "layer_d property activeInLastScan", true, layerD.activeInLastScan
        assertNotNull "layer_d property lastUpdated should exist", layerD.lastUpdated
        assertEquals "layer_d property lastUpdated", "java.util.Date", layerD.lastUpdated.class.name
        assertEquals "layer_d parent should be layer_a.", layerA, layerD.parent
        assertEquals "layer_d should have one child layer.", 1, layerD.layers.size()

        def groupingUnderD = layerD.layers.toArray()[0]
        assertNotNull "'Grouping' should exist under Layer D.", groupingUnderD
        assertEquals "groupingUnderD property title.", "Grouping", groupingUnderD.title
        assertNull "groupingUnderD property name.", groupingUnderD.name
        assertEquals "groupingUnderD parent should be Layer D.", layerD, groupingUnderD.parent
        assertEquals "groupingUnderD should have one child layer.", 1, groupingUnderD.layers.size()

        def layerD1 = Layer.findWhere( server: server, name: "layer_d_1" )
        assertNotNull "layer_d_1 should exist.", layerD1
        assertNull "layer_d_1 property title.", layerD1.title
        assertEquals "layer_d_1 parent should be Grouing (under Layer D).", groupingUnderD, layerD1.parent
        assertEquals "layer_d_1 should have no child layers.", 0, layerD1.layers.size()
    }
}
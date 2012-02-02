package au.org.emii.portal

import grails.test.*
import grails.converters.*

class LayerServiceTests extends GroovyTestCase {
    
    // The service
    def layerService
    
    // Long abstract text
    def fullAbstractText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris volutpat justo a risus mattis sagittis. Duis elementum, nisi quis fringilla bibendum, magna neque vulputate odio, ut malesuada metus quam sit amet enim. Phasellus in libero ipsum, at auctor purus. Integer sodales lobortis vulputate. Sed nibh elit, malesuada ac rhoncus eget, vehicula at ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris eleifend aliquet dolor."
    def trimmedAbstractText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris volutpat justo a risus mattis sagittis. Duis elementum, nisi quis fringilla bibendum, magna neque vulputate odio, ut malesuada metus quam sit amet enim. Phasellus in libero ipsum, at auctor purus. Integer sodales lobortis vulputate. Sed nibh elit, malesuada ac rhoncus eget, vehicula at ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. M..."
    
    def server
    def layerDataSource = "testCode"
    def newData = """\
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
    {name: "awesomeSauce:layer_c", title: "Layer C", queryable: false},
    {title: "Layer D", abstractText: "Just some layer, yo.", queryable: false}
]
}\
"""
    
    protected void setUp() {
        super.setUp()
        
        server = new Server( uri: "http://www.testserver.com/asdf/", name: "TestServer", shortAcron: "TS", type: "AUTO", allowDiscoveries: true, imageFormat: "image/png", disable: false, opacity: 100 )
        server.save( failOnError: true )
        
        // Todo - DN: Doesn't yet updating an item whose name or title has changed. Old layer hould be marked inactive and new one should exist in its place
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testUpdateWithNewData_NoExistingLayers() {
        
        assertEquals "Should be 0 layers to start with", 0, Layer.count()
        
        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource
        
        _verifyHierarchy false
    }
    
    void testUpdateWithNewData_ExistingHierarchy() {
        
        def layerA = new Layer( title: "Layer A", name: "layer_a", dataSource: "testCode", server: server )
        def layerB = new Layer( title: "Layer B", name: "layer_b", dataSource: "testCode", server: server )
        
        layerB.save( failOnError: true )
        layerA.addToLayers layerB
        layerA.save( failOnError: true )
        
        assertEquals "Should be 2 layers to start with", 2, Layer.count()
        
        layerService.updateWithNewData JSON.parse( newData ), server, layerDataSource
        
        println Layer.list()
        
        _verifyHierarchy true
    }
    
    void _verifyHierarchy(boolean expectB) {
        
        def numLayersExpected = expectB ? 4 : 3
        def layerAExpectedChildren = expectB ? 3 : 2
        
        assertEquals "Should be ${numLayersExpected} layers in the end", numLayersExpected, Layer.count()
        
        // Root layer (layer_a)
        def layerA = Layer.findWhere( server: server, name: "layer_a" )
        
        assertNotNull "layer_a should exist", layerA
        assertEquals "layer_a property title", "Layer A", layerA.title
        assertEquals "layer_a property name", "layer_a", layerA.name
        assertEquals "layer_a property abstractTrimmed", trimmedAbstractText, layerA.abstractTrimmed
        assertEquals "layer_a property metaUrl", "urlA", layerA.metaUrl
        assertEquals "layer_a property queryable", true, layerA.queryable
        assertEquals "layer_a property bbox", "-90,-180,90,180", layerA.bbox
        assertEquals "layer_a property projection", "EPSG:2010", layerA.projection
        assertEquals "layer_a property dataSource", "testCode", layerA.dataSource
        assertEquals "layer_a property activeInLastScan", true, layerA.activeInLastScan
        assertNotNull "layer_a property lastUpdated should exist", layerA.lastUpdated
        assertEquals "layer_a property lastUpdated", "java.util.Date", layerA.lastUpdated.class.name
        assertNull   "layer_a shouldn't have a parent", layerA.parent
        assertEquals "layer_a should have $layerAExpectedChildren layers", layerAExpectedChildren, layerA.layers.size()
        
        // Existing child (layer_b) if applicable
        if ( expectB ) {
            def layerB = Layer.findWhere( server: server, name: "layer_b" )
            
            assertNotNull "layer_b should exist", layerB
            assertEquals "layer_b property title", "Layer B", layerB.title
            assertEquals "layer_b property name", "layer_b", layerB.name
            assertEquals "layer_b property abstractTrimmed", "", layerB.abstractTrimmed
            assertEquals "layer_b property metaUrl", null, layerB.metaUrl
            assertEquals "layer_b property queryable", false, layerB.queryable
            assertEquals "layer_b property bbox", null, layerB.bbox
            assertEquals "layer_b property projection", null, layerB.projection
            assertEquals "layer_b property dataSource", "testCode", layerB.dataSource
            assertEquals "layer_b property activeInLastScan", false, layerB.activeInLastScan
            assertNotNull "layer_b property lastUpdated should exist", layerB.lastUpdated
            assertEquals "layer_b property lastUpdated", "java.util.Date", layerB.lastUpdated.class.name
            assertEquals "layer_b parent should be layer_a", layerA, layerB.parent
            assertEquals "layer_b should have no layers", 0, layerB.layers.size()
        }
        
        // New children (layer_c, layer_d)
        def layerC = Layer.findWhere( server: server, name: "layer_c" )
        assertNotNull "layer_c should exist", layerC
        assertEquals "layer_c property title", "Layer C", layerC.title
        assertEquals "layer_c property name", "layer_c", layerC.name
        assertEquals "layer_c property abstractTrimmed", "", layerC.abstractTrimmed
        assertEquals "layer_c property metaUrl", null, layerC.metaUrl
        assertEquals "layer_c property queryable", false, layerC.queryable
        assertEquals "layer_c property bbox", null, layerC.bbox
        assertEquals "layer_c property projection", null, layerC.projection
        assertEquals "layer_c property dataSource", "testCode", layerC.dataSource
        assertEquals "layer_c property activeInLastScan", true, layerC.activeInLastScan
        assertNotNull "layer_c property lastUpdated should exist", layerC.lastUpdated
        assertEquals "layer_c property lastUpdated", "java.util.Date", layerC.lastUpdated.class.name
        assertEquals "layer_c parent should be layer_a", layerA, layerC.parent
        assertEquals "layer_c should have no layers", 0, layerC.layers.size()
        
        def layerD = Layer.findWhere( server: server, title: "Layer D", name: null )
        assertNotNull "layer_d should exist", layerD
        assertEquals "layer_d property title", "Layer D", layerD.title
        assertNull "layer_d property name should be null", layerD.name
        assertEquals "layer_d property abstractTrimmed", "Just some layer, yo.", layerD.abstractTrimmed
        assertEquals "layer_d property metaUrl", null, layerD.metaUrl
        assertEquals "layer_d property queryable", false, layerD.queryable
        assertEquals "layer_d property bbox", null, layerD.bbox
        assertEquals "layer_d property projection", null, layerD.projection
        assertEquals "layer_d property dataSource", "testCode", layerD.dataSource
        assertEquals "layer_d property activeInLastScan", true, layerD.activeInLastScan
        assertNotNull "layer_d property lastUpdated should exist", layerD.lastUpdated
        assertEquals "layer_d property lastUpdated", "java.util.Date", layerD.lastUpdated.class.name
        assertEquals "layer_d parent should be layer_a", layerA, layerD.parent
        assertEquals "layer_d should have no layers", 0, layerD.layers.size()
    }
}
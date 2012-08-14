package au.org.emii.portal;

import static org.junit.Assert.*

import org.codehaus.groovy.grails.web.json.JSONObject

import grails.converters.JSON

class SnapshotServiceTests extends GroovyTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testServiceReferenceSaveJSONRequest() 
    {
        def user = new User(emailAddress: "Joe.Bloggs@testing.com", fullName: "Joe Bloggs", openIdUrl: "http://www.example.com/openId")
        
        user.save()

        def controller = new SnapshotController()
        
        controller.request.method = "POST"
        controller.request.contentType = "application/json"
        controller.request.content = '{"name":"test","owner":'+user.id+',"minX":-100,"minY":-60,"maxX":80,"maxY":85,"layers":[{"name":"topp:seabird","title":"Seabird","serviceUrl":"http://www.google.com.au"},{"name":"topp:bird","title":"Bird","serviceUrl":"http://www.google.com.au"}]}'
        
        controller.save()

        def theResponse = controller.response
        
        assertEquals(200, controller.response.status)
        assertEquals("application/json;charset=UTF-8", controller.response.contentType)
        
        def jsonSnapshot = JSON.parse(controller.response.contentAsString)
        
        assertEquals("test", jsonSnapshot.name)
        assertEquals(user.id, jsonSnapshot.owner.id)
        
        assertEquals(2, jsonSnapshot.layers.size())
        
        def snapshotLayer1 = SnapshotLayer.get(jsonSnapshot.layers[0].id)
        
        assertEquals("topp:seabird", snapshotLayer1.name)
        
        def snapshotLayer2 = SnapshotLayer.get(jsonSnapshot.layers[1].id)

        assertEquals("topp:bird", snapshotLayer2.name)
    }
    
    void testLayerReferenceSaveJSONRequest() 
    {
        def user = new User(emailAddress: "Joe.Bloggs@testing.com", fullName: "Joe Bloggs", openIdUrl: "http://www.totallysecuresites.com/" )
        
        user.save()
        
        def server = new Server(uri: "http://something1.com", shortAcron: "shortacron", name: "name", type: "WMS-1.3.0", disable: true, allowDiscoveries: true, opacity: 1, imageFormat: "image/png")
        
        server.save()
        
        def serverErrors = server.errors
        def layer1 = new Layer(name: "test layer 1", title: "test layer1", abstractTrimmed: "abstract", server: server, cache:true, queryable: false, isBaseLayer: false, dataSource: "test", activeInLastScan: false, blackListed: false )
        def layer2 = new Layer(name: "test layer 2", title: "test layer2", abstractTrimmed: "abstract", server: server, cache:true, queryable: false, isBaseLayer: false, dataSource: "test", activeInLastScan: false, blackListed: false )
        
        layer1.save()
        layer2.save()       
        
        def layer1Errors = layer1.errors
        def controller = new SnapshotController()
        
        controller.request.method = "POST"
        controller.request.contentType = "application/json"
        controller.request.content = '{"name":"test","owner":'+user.id+',"minX":-100,"minY":-60,"maxX":80,"maxY":85,"layers":[{layer:'+layer1.id+'},{layer:'+layer2.id+'}]}'
        
        def myContent =  controller.request.content
        
        controller.save()

        def theResponse = controller.response
        
        assertEquals(200, controller.response.status)
        assertEquals("application/json;charset=UTF-8", controller.response.contentType)
        
        def jsonSnapshot = JSON.parse(controller.response.contentAsString)
        
        assertEquals("test", jsonSnapshot.name)
        assertEquals(user.id, jsonSnapshot.owner.id)
        
        assertEquals(2, jsonSnapshot.layers.size())
        
        def snapshotLayer1 = SnapshotLayer.get(jsonSnapshot.layers[0].id)
        
        assertEquals(layer1.id, snapshotLayer1.layer.id)
        
        def snapshotLayer2 = SnapshotLayer.get(jsonSnapshot.layers[1].id)

        assertEquals(layer2.id, snapshotLayer2.layer.id)
    }
    
    void testSaveInvalidJSONRequest() 
    {
        def controller = new SnapshotController()
        
        controller.request.method = "POST"
        controller.request.contentType = "application/json"
        controller.request.content = '{"class":"au.org.emii.portal.Snapshot","name":"test","minX":-100,"minY":-60,"maxX":80,"maxY":85,"layers":[{"class":"au.org.emii.portal.SnapshotLayer","name":"topp:seabird","title":"Seabird","serviceUrl":"http://www.google.com.au"},{"class":"au.org.emii.portal.SnapshotLayer","name":"topp:bird","title":"Bird","serviceUrl":"http://www.google.com.au"}]}'
        
        controller.save()

        def theResponse = controller.response
        
        assertEquals(400, controller.response.status)
        assertEquals("application/json;charset=UTF-8", controller.response.contentType)
        
        def jsonResponse = JSON.parse(controller.response.contentAsString)
        
        assertEquals(1, jsonResponse.errors.size())
        assertEquals("owner", jsonResponse.errors[0].field)
        assertEquals(JSONObject.NULL,jsonResponse.errors[0]["rejected-value"])
    }
    
}

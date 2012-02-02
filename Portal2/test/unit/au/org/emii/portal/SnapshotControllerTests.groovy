package au.org.emii.portal

import java.util.Map;

import grails.test.*
import grails.converters.JSON

class SnapshotControllerTests extends ControllerUnitTestCase 
{
	List<SnapshotLayer> layers = []
	int numLayers = 5
	
	User owner
	User someOtherUser
	
	protected Map flashMsgParams
	
    protected void setUp() 
	{
        super.setUp()
		
		numLayers.times 
		{
			SnapshotLayer layer = new SnapshotLayer()
			layers.add(layer)
		}
		
		mockDomain(SnapshotLayer, layers)
		layers.each { it.save() }
		
		owner = new User()
		someOtherUser = new User()
		def userList = [owner, someOtherUser]

		mockDomain(User, userList)
		userList.each { it.save() }
		
		mockDomain(Snapshot)
		
		controller.metaClass.message = { Map params -> flashMsgParams = params }
    }

    protected void tearDown() 
	{
        super.tearDown()
    }

    void testSave() 
    {
        def snapshotLayers = [layers[0], layers[2], layers[4]]
        def snapshotName = "SE Australia SST and CPR"
        
        controller.params.layers = snapshotLayers
        controller.params.name = snapshotName
        controller.params.owner = owner
        
        controller.params.minX = -100
        controller.params.minY = -60
        controller.params.maxX = 80
        controller.params.maxY = 30
        
        controller.save()
        
        assertEquals("show", controller.redirectArgs.action)
        def snapshotId = controller.redirectArgs.id
        assertNotNull(snapshotId)
        
        def savedSnapshot = Snapshot.get(snapshotId)
        assertNotNull(savedSnapshot)
        
        assertEquals(snapshotLayers.size(), savedSnapshot.layers.size())
        assertEquals(snapshotName, savedSnapshot.name)
        assertEquals(owner, savedSnapshot.owner)
    }
    
    void testSaveJSONRequest() {
        // Moved to SnapshotServiceTests as saving a JSON snapshot
        // uses bindData which isn't supported in mocked unit testing controllers
    }
    
	void testShowAsJSON()
	{
		layers[0].name = "Argos 1"
		layers[1].name = "Argos 2"
		
		def snapshotName = "NW argos"
		def snapshotLayers = [layers[0], layers[1]]
			
		def snapshot = new Snapshot(owner: owner, name: snapshotName, layers: snapshotLayers)
		mockDomain(Snapshot, [snapshot])
		snapshot.save()
		
		controller.params.id = snapshot.id
		
		callShow()

        def snapshotAsJson = JSON.parse(controller.response.contentAsString)

		assertEquals(snapshotName, snapshotAsJson.name)
		assertEquals(snapshot.id, snapshotAsJson.id)
		assertEquals(snapshotLayers*.id, snapshotAsJson.layers*.id)
		assertEquals(snapshotLayers*.name, snapshotAsJson.layers*.name)
	}

	void testShowAsJSONError()
	{
		callShow()
		
		assertEquals(404, controller.renderArgs.status)
		assertEquals([code:"default.not.found.message", args:[[code:"snapshot.label", default:"Snapshot"], null]], flashMsgParams)
	}
	
	void testListAsJSON()
	{
		def snapshotsAsJson = createSnapshotsCallListAndParseResult()
		assertEquals(5, snapshotsAsJson.data.size())
	}

	void testListForOwnerAsJson()
	{
		controller.params.owner = owner
		def snapshotsAsJson = createSnapshotsCallListAndParseResult()
		assertEquals(2, snapshotsAsJson.data.size())
	}
	
	private def createSnapshotsCallListAndParseResult() 
	{
		def snapshotList = createSnapshots(3, someOtherUser)
		snapshotList += createSnapshots(2, owner)

		callList()

		def snapshotsAsJson = JSON.parse(controller.response.contentAsString)
		return snapshotsAsJson
	}
	
	private def createSnapshots(numSnapshots, theOwner) 
	{
		def snapshotList = []

		numSnapshots.times
		{
			i ->

			def snapshot = new Snapshot(owner: theOwner, name: "snapshot " + i, minX:-170+i, minY:-60+i, maxX:100+i, maxY:50+i, layers:[layers[i], layers[i + 1]])
			snapshotList += snapshot
		}

		snapshotList.each { it.save() }
		
		return snapshotList
	}
	
	void testDeleteAsJSON()
	{
		def snapshotList = createSnapshots(2, owner)
		
		assertTrue(Snapshot.list()*.id.contains(snapshotList[0].id))

		controller.params.id = snapshotList[0].id
		callDelete()
		
		assertFalse(Snapshot.list()*.id.contains(snapshotList[0].id))
		assertEquals(200, controller.renderArgs.status)
		assertEquals([code:"default.deleted.message", args:[[code:"snapshot.label", default:"Snapshot"], snapshotList[0].id]], flashMsgParams)
	}

	void testDeleteAsJSONError()
	{
		controller.params.id = 123
		callDelete()
		
		assertEquals(404, controller.renderArgs.status)
		assertEquals([code:"default.not.found.message", args:[[code:"snapshot.label", default:"Snapshot"], 123]], flashMsgParams)
	}

	private def callList() 
	{
		controller.params.type = 'JSON'
		controller.list()
	}
	
	private def callDelete() 
	{
		controller.params.type = 'JSON'
		controller.delete()
	}
	
	private def callShow() 
	{
		controller.params.type = 'JSON'
		controller.show()
	}
}

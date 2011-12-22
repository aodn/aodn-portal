package au.org.emii.portal

import grails.test.*

class SnapshotTests extends GrailsUnitTestCase 
{
	User owner
	
    protected void setUp() 
	{
        super.setUp()
		
		owner = new User()
		mockDomain(User, [owner])
		owner.save()
		
		mockDomain(Snapshot)
    }

    protected void tearDown() 
	{
        super.tearDown()
    }

    void testSaveNoName()
	{
		Snapshot invalidSnapshot = new Snapshot(owner: owner)
		invalidSnapshot.save()
		
		assertTrue(invalidSnapshot.hasErrors())
		assertEquals("nullable", invalidSnapshot.errors.getFieldError("name").getCode())
    }
	
	void testSaveWithNameNoLayers()
	{
		Snapshot snapshot = new Snapshot(owner: owner, name: "SE argo floats")
		snapshot.save()
		
		assertFalse(snapshot.hasErrors())
	}
	
	void testToString()
	{
		def name = "some name"
		assertEquals(name, String.valueOf(new Snapshot(name: name, owner: owner)))
	}
}

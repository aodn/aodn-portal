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
	
    void testSaveNoBBox()
    {
        Snapshot invalidSnapshot = new Snapshot(owner: owner, name: "SE argo floats")
        invalidSnapshot.save()
        
        assertTrue(invalidSnapshot.hasErrors())
        assertEquals("nullable", invalidSnapshot.errors.getFieldError("minX").getCode())
        assertEquals("nullable", invalidSnapshot.errors.getFieldError("minY").getCode())
        assertEquals("nullable", invalidSnapshot.errors.getFieldError("maxX").getCode())
        assertEquals("nullable", invalidSnapshot.errors.getFieldError("maxY").getCode())
    }
    
    void testSaveInvalidBBox()
    {
        Snapshot invalidSnapshot = new Snapshot(owner: owner, name: "SE argo floats", minX: 170, minY: 70, maxX: -170, maxY: -70)
        invalidSnapshot.save()
        
        def theErrors = invalidSnapshot.errors
        
        assertTrue(invalidSnapshot.hasErrors())
        
        assertEquals("validator.invalid", invalidSnapshot.errors.getFieldError("maxX").getCode())
        assertEquals("validator.invalid", invalidSnapshot.errors.getFieldError("maxY").getCode())
    }
    
	void testSaveWithNameNoLayers()
	{
		Snapshot snapshot = new Snapshot(owner: owner, name: "SE argo floats", minX: -170, minY: -70, maxX: 170, maxY: 70)
		snapshot.save()
        
		assertFalse(snapshot.hasErrors())
	}
	
	void testToString()
	{
		def name = "some name"
		assertEquals(name, String.valueOf(new Snapshot(name: name, owner: owner)))
	}
}

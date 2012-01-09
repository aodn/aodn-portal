function createSnapshot()
{
	var userId = 1;
	return new Portal.snapshot.Snapshot(userId, "SE biology");
}

describe("Portal.snapshot", function() 
{
	describe("Snapshot", function()
	{
		it("create", function() 
		{
			var snapshot = createSnapshot();
				
			expect(snapshot.ownerId).toEqual(1);
			expect(snapshot.name).toEqual("SE biology");
		});
		
		it("save", function()
		{
			spyOn(Ext.Ajax, "request").andCallFake(function(options)
			{
				options.success();
			});
			
			var snapshot = createSnapshot();
			
			var successCallback = jasmine.createSpy();
			var failureCallback = jasmine.createSpy();
			
			snapshot.save(successCallback, failureCallback);
			
			expect(successCallback).toHaveBeenCalled();
			expect(failureCallback).not.toHaveBeenCalled();
		});
	});
});

// Test save/load only available if authenticated.

//


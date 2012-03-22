describe("Portal.snapshot.SnapshotProxy", function() 
{
  var proxy = new Portal.snapshot.SnapshotProxy();
  
	it("calls successCallback on successful save", function()
	{
		spyOn(Ext.Ajax, "request").andCallFake(function(options)
		{
			options.successCallback(null, options);
		});
		
		var snapshot = {owner: 1, name:"SE biology"};
		
		var successCallback = jasmine.createSpy();
		var failureCallback = jasmine.createSpy();
		
		proxy.save(snapshot, successCallback, failureCallback);
		
		expect(successCallback).toHaveBeenCalled();
		expect(failureCallback).not.toHaveBeenCalled();
	});
});


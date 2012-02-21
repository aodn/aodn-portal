describe("Portal.snapshot", function()
{
	describe("SnapshotController", function()
	{
	  var snapshotController = new Portal.snapshot.SnapshotController({});
	  
		it("construct", function()
		{
			expect(snapshotController.proxy).not.toEqual(undefined);
		});
		
    it("delete snapshot", function()
    {
      spyOn(snapshotController.proxy, 'remove');
      
      snapshotController.deleteSnapshot(1,null,null);
      
      expect(snapshotController.proxy.remove).toHaveBeenCalled();
    });
        
	});
});		
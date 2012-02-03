describe("Portal.snapshot", function()
{
	describe("SnapshotOptionsPanel", function()
	{
	  var mockController = {
	      on: jasmine.createSpy(),
	      loadSnapshot: jasmine.createSpy()
	  };

	  var snapshotOptionsPanel = new Portal.snapshot.SnapshotOptionsPanel({
	    controller: mockController
	    });
	  
	  snapshotOptionsPanel.snapshotCombo.setValue('20');
		
		it("construct", function()
		{
			expect(snapshotOptionsPanel.items.length).toEqual(3);
			expect(snapshotOptionsPanel.items.items[2].text).toEqual("Delete");
      expect(mockController.on).toHaveBeenCalled();
		});
		
		it("select snapshot", function()
		{
			var comboBox = snapshotOptionsPanel.items.items[0];
			comboBox.fireEvent('select', comboBox);
			
			expect(mockController.loadSnapshot).toHaveBeenCalled();
		});
		
	});
});		
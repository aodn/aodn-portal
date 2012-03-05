describe("Portal.snapshot", function()
{
	describe("SnapshotOptionsPanel", function()
	{
	  var mockController = {
	      on: jasmine.createSpy(),
        loadSnapshot: jasmine.createSpy(),
        deleteSnapshot: jasmine.createSpy()
	  };
	  
	  spyOn(Ext.Ajax, 'request').andReturn();

	  var snapshotOptionsPanel = new Portal.snapshot.SnapshotOptionsPanel({
	    controller: mockController
	    });
	  
	  snapshotOptionsPanel.snapshotCombo.setValue('20');
		
		it("constructs panel with required items", function()
		{
			expect(snapshotOptionsPanel.items.length).toEqual(3);
			expect(snapshotOptionsPanel.btnDelete.text).toEqual("Delete");
      expect(mockController.on).toHaveBeenCalled();
		});
		
    it("calls loadSnapshot when value in combo box is selected", function()
    {
      var comboBox = snapshotOptionsPanel.items.items[0];
      comboBox.fireEvent('select', comboBox);
      
      expect(mockController.loadSnapshot).toHaveBeenCalled();
    });
        
    it("deletes selected snapshot when delete is clicked", function()
    {
      var btnDelete = snapshotOptionsPanel.btnDelete;
      btnDelete.fireEvent('click', btnDelete);
      
      expect(mockController.deleteSnapshot).toHaveBeenCalled();
    });
    Ext.Ajax.request.isSpy = false;  
	});
});		
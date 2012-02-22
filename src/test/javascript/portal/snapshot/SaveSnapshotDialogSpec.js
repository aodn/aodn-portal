describe("Portal.snapshot", function()
{
  describe("SaveSnapshotDialog", function()
  {
    var mockController = {
        createSnapshot: jasmine.createSpy()
    };

    var saveSnapshotDialog = new Portal.snapshot.SaveSnapshotDialog({controller: mockController});

    it("creates dialog with required child components on instantiation", function()
    {
      expect(saveSnapshotDialog.nameField).toBeDefined();
      expect(saveSnapshotDialog.btnSave).toBeDefined();
      expect(saveSnapshotDialog.btnCancel).toBeDefined();
    });

    it("calls controller createSnapshot method when save button is clicked", function()
    {
      var btnSave = saveSnapshotDialog.btnSave;
      btnSave.fireEvent('click', btnSave);
      
      expect(mockController.createSnapshot).toHaveBeenCalled();
    });
    
    it("calls close method when cancel button is clicked", function() 
    {
      spyOn(saveSnapshotDialog, 'close');
      
      var btnCancel = saveSnapshotDialog.btnCancel;
      btnCancel.fireEvent('click', btnCancel);
      
      expect(saveSnapshotDialog.close).toHaveBeenCalled();
    });
            
  });
});   
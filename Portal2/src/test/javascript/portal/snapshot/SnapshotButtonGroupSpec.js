describe("Portal.snapshot", function()
{
	describe("SnapshotButtonGroup", function()
	{
		var snapshotButtonGroup = new Portal.snapshot.SnapshotButtonGroup({});
		
		it("construct", function()
		{
			expect(snapshotButtonGroup.items.length).toEqual(2);
			expect(snapshotButtonGroup.items.items[0].text).toEqual("Load Map...");
			expect(snapshotButtonGroup.items.items[1].text).toEqual("Save Map...");
		});
		
		it("click load", function()
		{
			snapshotButtonGroup.showLoadDialog = jasmine.createSpy();
			
			var loadButton = snapshotButtonGroup.items.items[0];
			loadButton.fireEvent('click', loadButton);
			
			expect(snapshotButtonGroup.showLoadDialog).toHaveBeenCalled();
		});
		
		it("click save", function()
		{
			snapshotButtonGroup.showSaveDialog = jasmine.createSpy();
			
			var saveButton = snapshotButtonGroup.items.items[1];
			saveButton.fireEvent('click', saveButton);
			
			expect(snapshotButtonGroup.showSaveDialog).toHaveBeenCalled();
		});
	});
});		
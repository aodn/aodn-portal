describe("Portal.snapshot", function()
{
	describe("SnapshotOptionsGroup", function()
	{
		var snapshotOptionsGroup = new Portal.snapshot.SnapshotOptionsGroup({});
		
		it("construct", function()
		{
			expect(snapshotOptionsGroup.items.length).toEqual(3);
			expect(snapshotOptionsGroup.items.items[2].text).toEqual("Delete");
		});
		
		it("click load", function()
		{
			snapshotOptionsGroup.loadSelectedSnapshot = jasmine.createSpy();
			
			var comboBox = snapshotOptionsGroup.items.items[0];
			comboBox.fireEvent('select', comboBox);
			
			expect(snapshotOptionsGroup.loadSelectedSnapshot).toHaveBeenCalled();
		});
		
	});
});		
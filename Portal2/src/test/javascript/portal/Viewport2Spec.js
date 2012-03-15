describe("Portal", function() 
{
	describe("viewport2", function()
	{
		it("displayLayerAddedMessage", function()
		{
			spyOn(Ext.Msg, 'alert');
			displayLayerAddedMessage("SST Tas");
			expect(Ext.Msg.alert).toHaveBeenCalledWith('Add layer', '\'SST Tas\' has been added to the map');
		});
	});
});

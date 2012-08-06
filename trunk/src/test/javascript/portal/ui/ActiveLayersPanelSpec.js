function checkVisibility(activeLayersPanel, hasBoundingBox)
{
	spyOn(activeLayersPanel.zoomToLayerMenuItem, 'setVisible');

	activeLayersPanel.layerHasBoundingBox = function() { return hasBoundingBox; };
	activeLayersPanel.updateZoomToLayerMenuItemVisibility();
	expect(activeLayersPanel.zoomToLayerMenuItem.setVisible).toHaveBeenCalledWith(hasBoundingBox);
};

describe("Portal.ui", function() 
{
	describe("ActiveLayersPanel", function()
	{
		var activeLayersPanel = new Portal.ui.ActiveLayersPanel({});
		activeLayersPanel.getSelectedNode = function() { return { layer: null}; };
		
		it("zoomToLayer shown", function()
		{
			checkVisibility(activeLayersPanel, true);
		});
		
		it("zoomToLayer hidden", function()
		{
			checkVisibility(activeLayersPanel, false);
		});
	});
});

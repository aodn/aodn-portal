describe("Portal.ui.FeatureInfoPopup", function()
{
	// Simple case, two tabs, first one remains selected.
	it("load two tabs, first remains selected", function()
	{
		var map = new OpenLayers.Map();
		var featureInfoPopup = new Portal.ui.FeatureInfoPopup({map: map, appConfig: {}});
		
		featureInfoPopup._addPopupTabContent("", "tab 1");
		featureInfoPopup._addPopupTabContent("", "tab 2");
		
		expect(featureInfoPopup.popupTab.getActiveTab().title).toEqual("tab 1");
	});
	
	// Case for #1726.
	// - 2 tabs load
	it("load two tabs, select 2nd, load 3rd - 2nd remains selected", function()
	{
		var map = new OpenLayers.Map();
		var featureInfoPopup = new Portal.ui.FeatureInfoPopup({map: map, appConfig: {}});
		
		featureInfoPopup._addPopupTabContent("", "tab 1");
		featureInfoPopup._addPopupTabContent("", "tab 2");
		expect(featureInfoPopup.popupTab.getActiveTab().title).toEqual("tab 1");
		
		// - user clicks/activates 2nd tab
		featureInfoPopup.popupTab.setActiveTab(1);
		expect(featureInfoPopup.popupTab.getActiveTab().title).toEqual("tab 2");

		// - third tab loads
		featureInfoPopup._addPopupTabContent("", "tab 3");
		
		// 2nd tab remains selected.
		expect(featureInfoPopup.popupTab.getActiveTab().title).toEqual("tab 2");
	});
});

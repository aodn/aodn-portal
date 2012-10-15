describe("Portal.ui.openlayers.LayerSwitcher", function() {
	
	// expect zoomToLayer to be initially unchecked.
	var layerSwitcher = new Portal.ui.openlayers.LayerSwitcher();
	var map = new Portal.ui.Map({appConfig: {initialBbox: "110,-50,160,-3"}});
	
	layerSwitcher.setMap(map.map);
	layerSwitcher.draw();
	
	it("auto zoom initially unchecked", function() {
		expect(layerSwitcher.isAutoZoomEnabled()).toEqual(false);
	});
	
	// expect clicking on zoomToLayer check box - becomes checked, calls map.zoomToLayer.
	it("clicking auto zoom makes it checked, fires zoomToLayer event", function() {

		$(layerSwitcher.autoZoomLabelSpan).trigger('click');
		expect(layerSwitcher.isAutoZoomEnabled()).toEqual(true);
		
		// TODO: only if there is a selected layer.
//		expect(map.zoomToLayer).toHaveBeenCalled();
		
		$(layerSwitcher.autoZoomLabelSpan).trigger('click');
		expect(layerSwitcher.isAutoZoomEnabled()).toEqual(false);
		
	});
	
	// change layer - if (zoomToLayer), expect map.zoomToLayer
	
});
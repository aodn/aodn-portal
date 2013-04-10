
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.FeatureInfoPopup", function()
{
    var map;
    var featureInfoPopup;
    var layer;
    var server;

    beforeEach(function() {
        map = new OpenLayers.Map();
        server = {
            type: "NCWMS-1.3.0",
            uri: "http://geoserver.imos.org.au/geoserver/wms"
        };

        layer = new OpenLayers.Layer.WMS(
            "test layer",
            "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {
                queryable: true
            },
            {isBaseLayer: false,server: server}

        );

        map.addLayer(layer);
        featureInfoPopup = new Portal.ui.FeatureInfoPopup({map: map, appConfig: {}});
    });

    afterEach(function() {
        featureInfoPopup.destroy();
    });

	// Simple case, two tabs, first one remains selected.
	it("load two tabs, first remains selected", function()
	{
		featureInfoPopup._addPopupTabContent("", "tab 1");
		featureInfoPopup._addPopupTabContent("", "tab 2");

		expect(featureInfoPopup.popupTab.getActiveTab().title).toEqual("tab 1");
	});

	// Case for #1726.
	// - 2 tabs load
	it("load two tabs, select 2nd, load 3rd - 2nd remains selected", function()
	{
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

   it('on reset', function() {

        spyOn(Portal.ui.FeatureInfoPopup.prototype, 'close');
        Ext.MsgBus.publish('reset');
        expect(Portal.ui.FeatureInfoPopup.prototype.close).toHaveBeenCalled();
   });

    describe("_clickPoint", function(){
        it("returns integer x and y values", function()
        {
            featureInfoPopup.map.getViewPortPxFromLonLat = function() {
                var position = {};
                position.x = 30.1;
                position.y = 30.1;
                return position;
            };

            expect(featureInfoPopup._clickPoint().x).toEqual(30);
            expect(featureInfoPopup._clickPoint().y).toEqual(30);
        });
    });

    describe("_handleLayers", function(){

        it("calls _setMetadataFirst when no metadata", function(){

            featureInfoPopup._setMetadataFirst = function(){ return true };
            featureInfoPopup._requestFeatureInfo = function(){ return true };

            spyOn(featureInfoPopup, '_setMetadataFirst');

            featureInfoPopup._handleLayers();
            expect(featureInfoPopup._setMetadataFirst).toHaveBeenCalled();
        });
    });

    describe("Popup maximise behaviour", function() {

        it('Checks that setSize() is called on maximise', function() {
            spyOn(Portal.ui.FeatureInfoPopup.prototype, 'setSize');

            featureInfoPopup.maximisedPosition = { x: 0, y: 0 };
            featureInfoPopup.fitContainer();

            expect(Portal.ui.FeatureInfoPopup.prototype.setSize).toHaveBeenCalled();
        });

        // Ideally I'd check the size has changed but without the map being attached to a MapPanel the call to
        // featureInfoPopup.getSize() fails down the chain because BoxComponent.getResizeEl() returns undefined
        // I don't want to introduce the dependency of the MapPanel into this Spec so I'm uncomfortable but
        // satisfied that the it() above confirms correct behaviour

    });
});

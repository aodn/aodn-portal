describe("Portal.ui.FeatureInfoPopup", function()
{
    var map;
    var featureInfoPopup;
    var layer;
    var server;

    beforeEach(function() {
        map = new OpenLayers.Map();
        server = {
            uri: "http://geoserver.imos.org.au/geoserver/wms"
        };

        layer = new OpenLayers.Layer.WMS(
            "test layer",
            "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {
                queryable: true
            },
            {
                isBaseLayer: false,
                server: server
            }
        );
        layer.isNcwms = returns(true);

        map.addLayer(layer);
        featureInfoPopup = new Portal.ui.FeatureInfoPopup({map: map, appConfig: {}});
    });

    afterEach(function() {
        featureInfoPopup.destroy();
    });

    describe('Tab content', function() {
        it('does not create a tab when content is undefined', function() {
            featureInfoPopup._addPopupTabContent(undefined, "tab 1");
            expect(featureInfoPopup.popupTab.getActiveTab()).toBeNull();
        });

        it('does not create a tab when content is empty', function() {
            featureInfoPopup._addPopupTabContent("", "tab 1");
            expect(featureInfoPopup.popupTab.getActiveTab()).toBeNull();
        });

        it('does create a tab when there is content', function() {
            featureInfoPopup._addPopupTabContent("content for tab 1", "tab 1");
            expect(featureInfoPopup.popupTab.getActiveTab()).not.toBeNull();
        });
    });

    describe('Tab selection', function() {
        // Simple case, two tabs, first one remains selected.
        it("load two tabs, first remains selected", function()
        {
            featureInfoPopup._addPopupTabContent("content for tab 1", "tab 1");
            featureInfoPopup._addPopupTabContent("content for tab 2", "tab 2");

            expect(featureInfoPopup.popupTab.getActiveTab().title).toEqual("tab 1");
        });

        // Case for #1726.
        // - 2 tabs load
        it("load two tabs, select 2nd, load 3rd - 2nd remains selected", function()
        {
            featureInfoPopup._addPopupTabContent("content for tab 1", "tab 1");
            featureInfoPopup._addPopupTabContent("content for tab 2", "tab 2");
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

   it('on reset', function() {

        spyOn(Portal.ui.FeatureInfoPopup.prototype, 'close');
        Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
        expect(Portal.ui.FeatureInfoPopup.prototype.close).toHaveBeenCalled();
   });

    describe("_clickPoint", function(){
        it("returns original integer x and y values", function()
        {
            featureInfoPopup._display = noOp;
            featureInfoPopup._setLocationString = noOp;
            featureInfoPopup._handleDepthService = noOp;
            featureInfoPopup._handleLayers = noOp;

            featureInfoPopup.findFeatures({xy: {x: 1298, y: 241}});

            expect(featureInfoPopup._clickPoint().x).toEqual(1298);
            expect(featureInfoPopup._clickPoint().y).toEqual(241);
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

    describe('_getLayerFeatureInfoRequestString', function() {
        it('sets clickPoint and BUFFER param', function() {
            featureInfoPopup._clickPoint = returns({});
            spyOn(layer, 'getFeatureInfoRequestString');

            Ext.namespace('Portal.app.appConfig.portal');
            Portal.app.appConfig.portal.mapGetFeatureInfoBuffer = 10;

            featureInfoPopup._getLayerFeatureInfoRequestString(layer);

            expect(Portal.app.appConfig.portal.mapGetFeatureInfoBuffer).toBeTruthy();
            expect(layer.getFeatureInfoRequestString).toHaveBeenCalledWith(
                featureInfoPopup._clickPoint(),
                {
                    BUFFER: Portal.app.appConfig.portal.mapGetFeatureInfoBuffer
                }
            );
        });
    });
});

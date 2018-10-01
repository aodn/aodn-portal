describe("Portal.ui.MapPanel", function() {

    Ext.Ajax.request.isSpy = false;
    spyOn(Ext.Ajax, 'request').andReturn('');

    var appConfig = {
        initialBbox : '130,-60,160,-20',
        autoZoom : false,
        hideLayerOptions : false
    };

    var mapPanel;

    beforeEach(function() {
        OpenLayers.Util.getImageLocation = returns(null);
        mapPanel = new Portal.ui.MapPanel({
            appConfig : appConfig
        });
    });

    describe('message bus tests', function() {
        it('on baseLayerChanged event', function() {
            spyOn(mapPanel, 'onBaseLayerChanged');

            var baseLayerRecord = { layer: "asdf" };
            Ext.MsgBus.publish(PORTAL_EVENTS.BASE_LAYER_CHANGED, baseLayerRecord);

            expect(mapPanel.onBaseLayerChanged).toHaveBeenCalledWith(baseLayerRecord);
        });
    });

    describe('reset event', function() {

        it('should call reset()', function() {

            spyOn(mapPanel, 'reset');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel.reset).toHaveBeenCalled();
        });

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });

        it('should call setSpatialConstraint', function() {
            spyOn(mapPanel.map, 'setSpatialConstraintStyle');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel.map.setSpatialConstraintStyle).toHaveBeenCalled();
        });

        it('should call resetControls()', function() {
            spyOn(mapPanel.mapOptions, 'resetControls');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel.mapOptions.resetControls).toHaveBeenCalled();
        });
    });

    describe('removeAllLayers event', function() {

        it('should call _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');
            Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    describe('Ensure the MapPanel has methods that collaborators depend on', function() {
        it('Checks that getPanelX() can be called', function() {
            expect(mapPanel.getPanelX).toBeDefined();
        });

        it('Checks that getPanelY() can be called', function() {
            expect(mapPanel.getPanelY).toBeDefined();
        });
    });

    describe('beforeParentHide()', function() {

        it('calls _closeFeatureInfoPopup()', function() {

            spyOn(mapPanel, '_closeFeatureInfoPopup');

            mapPanel.beforeParentHide();

            expect(mapPanel._closeFeatureInfoPopup).toHaveBeenCalled();
        });
    });

    Ext.Ajax.request.isSpy = false;
});

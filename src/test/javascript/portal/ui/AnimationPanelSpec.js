
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.AnimationPanel", function() {

    var animationPanel;
    var openLayer;
    var map;
    var layerStore;

    beforeEach(function() {
        animationPanel = new Portal.ui.AnimationPanel();
        openLayer = new OpenLayers.Layer.WMS(
            "the title",
            "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {},
            { isBaseLayer: false}
        );
        openLayer.server = {type: "WMS 1.3.0"};
        openLayer.dimensions = [{'name': "time",'extent': "2011-03-06T09:00:00Z,2011-03-06T15:00:00Z"}];

        map = new OpenLayers.Map('map');
        layerStore = Portal.data.LayerStore.instance();
        layerStore.bind(map);
        map.addLayer(openLayer);
        animationPanel.setMap(map);

        animationPanel.animationControlsPanel.isAnimating = function() {return false};

        spyOn(animationPanel, 'setVisible');

    });

    it("hides on map reset", function() {

        Ext.MsgBus.publish('reset');

        expect(animationPanel.setVisible).toHaveBeenCalledWith(false);
    });

    it("shows when layer was animatable", function() {
        openLayer.isAnimatable = function() {return true};
        animationPanel._setAnimationPanelVis( openLayer );
        expect(animationPanel.setVisible).toHaveBeenCalledWith(true);
    });

    it("hides when layer was not animatable", function() {
        openLayer.isAnimatable = function() {return false};
        animationPanel._setAnimationPanelVis( openLayer );
        expect(animationPanel.setVisible).toHaveBeenCalledWith(false);
    });

    it("ignored when no layer supplied", function() {
        animationPanel._setAnimationPanelVis(/* No openLayer */);
        expect(animationPanel.setVisible).not.toHaveBeenCalled();
    });

    it("ignore hiding if animating", function() {
        animationPanel.animationControlsPanel.isAnimating = function() {return true};
        animationPanel._setAnimationPanelVis();
        expect(animationPanel.setVisible).not.toHaveBeenCalled();
    });

    it("hides when last layer removed", function() {

        map.removeLayer(openLayer); // No more layers left
        animationPanel._setAnimationPanelVis( {} );
        expect(animationPanel.setVisible).toHaveBeenCalledWith(false);
    });
});

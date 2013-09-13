/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.AnimationWindow", function() {

    var animationWindow;
    var openLayer;

    beforeEach(function() {
        var map = new OpenLayers.Map('map');
        animationWindow = new Portal.ui.AnimationWindow({
            map: map
        });

        openLayer = new OpenLayers.Layer.WMS(
            "the title",
            "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {},
            { isBaseLayer: false}
        );
        openLayer.server = {type: "WMS 1.3.0"};
        openLayer.dimensions = [{'name': "time",'extent': "2011-03-06T09:00:00Z,2011-03-06T15:00:00Z"}];

        var layerStore = Portal.data.LayerStore.instance();
        layerStore.bind(map);
        map.addLayer(openLayer);

        spyOn(animationWindow, 'hide');
        spyOn(animationWindow, 'show');
    });

    describe('initialisation', function() {
        it('is initially contracted', function() {
            expect(animationWindow._expanded).toBe(false);
        });
    });

    describe('message bus events', function() {
        it("hides on map reset", function() {
            Ext.MsgBus.publish('reset');
            expect(animationWindow.hide).toHaveBeenCalled();
        });

        it("shows when layer was animatable", function() {
            openLayer.isAnimatable = function() {return true};
            Ext.MsgBus.publish('selectedLayerChanged', openLayer);
            expect(animationWindow.show).toHaveBeenCalled();
        });

        it("hides when layer was not animatable", function() {
            openLayer.isAnimatable = function() {return false};
            Ext.MsgBus.publish('selectedLayerChanged', openLayer);
            expect(animationWindow.hide).toHaveBeenCalled();
        });

        it("hides when no layer supplied", function() {
            Ext.MsgBus.publish('selectedLayerChanged');
            expect(animationWindow.hide).toHaveBeenCalled();
        });
    });

    describe('toggle visibility button', function() {
        it('expands on click when contracted', function() {
            animationWindow._expanded = false;
            spyOn(animationWindow, '_expand');
            animationWindow.toggleVisibilityButton.fireEvent('click');
            expect(animationWindow._expand).toHaveBeenCalled();
        });

        it('contracts on click when expanded', function() {
            animationWindow._expanded = true;
            spyOn(animationWindow, '_contract');
            animationWindow.toggleVisibilityButton.fireEvent('click');
            expect(animationWindow._contract).toHaveBeenCalled();
        });
    });

    describe('contract and expand', function() {

        beforeEach(function() {
            spyOn(animationWindow.animationControlsPanel, 'contract');
            spyOn(animationWindow.animationControlsPanel, 'expand');
            spyOn(animationWindow.toggleVisibilityButton, 'setIconClass');
        });

        describe('contract', function() {
            beforeEach(function() {
                animationWindow._contract();
            });

            it('contracts controls panel', function() {
                expect(animationWindow.animationControlsPanel.contract).toHaveBeenCalled();
            });

            it('sets button icon', function() {
                expect(animationWindow.toggleVisibilityButton.setIconClass).toHaveBeenCalledWith('arrowUpWhite');
            });

            it('sets expanded to false', function() {
                expect(animationWindow._expanded).toBe(false);
            });
        });

        describe('expand', function() {
            beforeEach(function() {
                animationWindow._expand();
            });

            it('expands controls panel', function() {
                expect(animationWindow.animationControlsPanel.expand).toHaveBeenCalled();
            });


            it('sets button icon', function() {
                expect(animationWindow.toggleVisibilityButton.setIconClass).toHaveBeenCalledWith('arrowDownWhite');
            });

            it('sets expanded to true', function() {
                expect(animationWindow._expanded).toBe(true);
            });
        });
    });
});

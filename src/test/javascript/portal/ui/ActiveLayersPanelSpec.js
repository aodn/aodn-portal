
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.ActiveLayersPanel", function() {

    var activeLayersPanel = new Portal.ui.ActiveLayersPanel({});

    describe("activeLayersTreePanelSelectionChangeHandler", function() {

        it("triggers selectedLayerChanged event", function() {

            var selectedLayerChangedSpy = jasmine.createSpy('messageBusSubscriber');
            Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, selectedLayerChangedSpy);

            activeLayersPanel.activeLayersTreePanelSelectionChangeHandler({}, { layer: { isAnimatable: function() { return false}}});
            expect(selectedLayerChangedSpy).toHaveBeenCalled();
        });

        it("triggers " + PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED + " event", function() {

            var beforeSelectedLayerChangedSpy = jasmine.createSpy('messageBusSubscriber');
            Ext.MsgBus.subscribe(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, beforeSelectedLayerChangedSpy);

            activeLayersPanel.activeLayersTreePanelBeforeSelectHandler({}, { layer: { isAnimatable: function() { return false}}});
            expect(beforeSelectedLayerChangedSpy).toHaveBeenCalled();
        });
    });

    describe("layerRemoved event", function() {

        describe("when there are no active layer nodes", function() {

            // Create spies
            activeLayersPanel.setActiveNode = jasmine.createSpy('setActiveNodeSpy');
            activeLayersPanel.getActiveLayerNodes = function() {return []};

            var selectedLayerChangedSpy = jasmine.createSpy('messageBusSubscriber');
            Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, selectedLayerChangedSpy);

            // Publish the event
            Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED);

            it("active node should be set to null", function() {

                expect(activeLayersPanel.setActiveNode).toHaveBeenCalledWith(null);
            });

            it("selectedLayerChanged event should be published", function() {

                expect(selectedLayerChangedSpy).toHaveBeenCalled();
            });
        });
    });

    describe("layerLoading events", function() {

        var mockedLayer;

        mockLayers = (function() {
            mockedLayer = { ui: {} };
            mockedLayer.ui.layerLoadingStart = function() {};
            mockedLayer.ui.layerLoadingEnd   = function() {};
            return [ mockedLayer ];
        });

        beforeEach(function() {
            // Return an array with at least one element...
            spyOn(activeLayersPanel, 'getActiveLayerNodes').andReturn(mockLayers());

            // Always returned the mocked layer
            spyOn(activeLayersPanel, 'findNodeByLayer').andReturn(mockedLayer);
        });

        describe("layerLoadingStart", function() {
            it("_onLayerLoadingStart called", function() {
                spyOn(activeLayersPanel, '_onLayerLoadingStart');
                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_START, "someLayer");
                expect(activeLayersPanel._onLayerLoadingStart).toHaveBeenCalledWith("someLayer");
            });

            it("_layerLoadingIndicationStart delegated to tree node", function() {
                spyOn(mockedLayer.ui, 'layerLoadingStart');
                activeLayersPanel._onLayerLoadingStart(mockedLayer);
                expect(mockedLayer.ui.layerLoadingStart).toHaveBeenCalled();
            });
        });

        describe("layerLoadingEnd", function() {
            it("_onLayerLoadingEnd called", function() {
                spyOn(activeLayersPanel, '_onLayerLoadingEnd');
                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_LOADING_END, "someLayer");
                expect(activeLayersPanel._onLayerLoadingEnd).toHaveBeenCalledWith("someLayer");
            });

            it("_layerLoadingIndicationEnd delegated to tree node", function() {
                spyOn(mockedLayer.ui, 'layerLoadingEnd');
                activeLayersPanel._onLayerLoadingEnd(mockedLayer);
                expect(mockedLayer.ui.layerLoadingEnd).toHaveBeenCalled();
            });
        });
    });
});

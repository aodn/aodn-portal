
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
});

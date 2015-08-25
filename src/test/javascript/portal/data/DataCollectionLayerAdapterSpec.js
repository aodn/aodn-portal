/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollectionLayerAdapter", function() {
    var layerSelectionModel;
    var layerAdapter;

    beforeEach(function() {
        spyOn(Portal.data.LayerSelectionModel.prototype, '_initLayers');
        layerSelectionModel = new Portal.data.LayerSelectionModel();
        layerSelectionModel.selectedLayer = new OpenLayers.Layer();

        layerAdapter = new Portal.data.DataCollectionLayerAdapter({
            layerSelectionModel: layerSelectionModel
        });
    });

    it('indicates loading', function() {
        layerSelectionModel.getSelectedLayer().loading = true;
        expect(layerAdapter.isLoading()).toBe(true);

        layerSelectionModel.getSelectedLayer().loading = false;
        expect(layerAdapter.isLoading()).toBe(false);
    });

    describe('events', function() {
        Ext.each(['loadstart', 'loadend', 'tileerror'], function(eventName) {
            it('forwards ' + eventName + ' event', function() {
                var eventListener = jasmine.createSpy('eventListener');
                layerAdapter.on(eventName, eventListener);

                var newLayer = new OpenLayers.Layer.Grid();
                layerSelectionModel.setSelectedLayer(newLayer);

                newLayer.events.triggerEvent(eventName, newLayer);

                expect(eventListener).toHaveBeenCalled();
            });

            it('does not forward deselected layer ' + eventName + ' event', function() {
                var eventListener = jasmine.createSpy('eventListener');
                layerAdapter.on(eventName, eventListener);

                var origLayer = new OpenLayers.Layer();
                layerSelectionModel.setSelectedLayer(origLayer);

                layerSelectionModel.setSelectedLayer(new OpenLayers.Layer());

                origLayer.events.triggerEvent(eventName, origLayer);

                expect(eventListener).not.toHaveBeenCalled();
            });
        });
    });
});

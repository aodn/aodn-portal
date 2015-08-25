/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollectionLayerAdapter", function() {
    var layerState;
    var layerAdapter;

    beforeEach(function() {
        spyOn(Portal.data.DataCollectionLayers.prototype, '_initLayers');
        layerState = new Portal.data.DataCollectionLayers();
        layerState.selectedLayer = new OpenLayers.Layer();

        layerAdapter = new Portal.data.DataCollectionLayerAdapter({
            layerState: layerState
        });
    });

    it('indicates loading', function() {
        layerState.getSelectedLayer().loading = true;
        expect(layerAdapter.isLoading()).toBe(true);

        layerState.getSelectedLayer().loading = false;
        expect(layerAdapter.isLoading()).toBe(false);
    });

    describe('events', function() {
        Ext.each(['loadstart', 'loadend', 'tileerror'], function(eventName) {
            it('forwards ' + eventName + ' event', function() {
                var eventListener = jasmine.createSpy('eventListener');
                layerAdapter.on(eventName, eventListener);

                var newLayer = new OpenLayers.Layer.Grid();
                layerState.setSelectedLayer(newLayer);

                newLayer.events.triggerEvent(eventName, newLayer);

                expect(eventListener).toHaveBeenCalled();
            });

            it('does not forward deselected layer ' + eventName + ' event', function() {
                var eventListener = jasmine.createSpy('eventListener');
                layerAdapter.on(eventName, eventListener);

                var origLayer = new OpenLayers.Layer();
                layerState.setSelectedLayer(origLayer);

                layerState.setSelectedLayer(new OpenLayers.Layer());

                origLayer.events.triggerEvent(eventName, origLayer);

                expect(eventListener).not.toHaveBeenCalled();
            });
        });
    });
});

/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollectionStoreSpec", function() {
    var dataCollection;
    var dataCollectionStore;
    var layer;
    var layerStore;

    beforeEach(function() {
        layer = new OpenLayers.Layer();

        layerStore = new Portal.data.LayerStore();
        spyOn(layerStore, 'addUsingOpenLayer');
        spyOn(layerStore, 'removeUsingOpenLayer');

        spyOn(Portal.data.DataCollectionLayers.prototype, '_initLayers');
        spyOn(Portal.data.DataCollectionLayers.prototype, 'getSelectedLayer').andCallFake(function() {
            this.selectedLayer = layer;
            return layer;
        });

        dataCollectionStore = new Portal.data.DataCollectionStore({
            layerStore: layerStore
        });
        dataCollection = new Portal.data.DataCollection();
    });

    it('adds selected layer to layer store', function() {
        dataCollectionStore.add(dataCollection);

        expect(layerStore.addUsingOpenLayer).toHaveBeenCalledWith(
            layer,
            jasmine.any(Function)
        );
    });

    it('updates layer store with newly selected layer', function() {
        var oldLayer = layer;
        var newLayer = new OpenLayers.Layer();

        dataCollectionStore.add(dataCollection);
        var layerState = dataCollection.getLayerState();
        spyOn(layerState, '_copyAttributesFromSelectedLayer');

        layerState.setSelectedLayer(newLayer);

        expect(layerStore.removeUsingOpenLayer).toHaveBeenCalledWith(oldLayer);
        expect(layerStore.addUsingOpenLayer).toHaveBeenCalledWith(newLayer);
    });
});

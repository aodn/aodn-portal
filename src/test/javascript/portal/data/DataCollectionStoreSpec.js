
describe("Portal.data.DataCollectionStoreSpec", function() {
    var dataCollection;
    var dataCollectionStore;
    var layer;
    var layerStore;

    beforeEach(function() {
        layer = new OpenLayers.Layer();

        layerStore = {
            addUsingOpenLayer: jasmine.createSpy('addUsingOpenLayer'),
            removeUsingOpenLayer: jasmine.createSpy('removeUsingOpenLayer')
        };

        spyOn(Portal.data.LayerSelectionModel.prototype, '_initLayers');
        spyOn(Portal.data.LayerSelectionModel.prototype, 'getSelectedLayer').andCallFake(function() {
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
        var layerSelectionModel = dataCollection.getLayerSelectionModel();

        layerSelectionModel.setSelectedLayer(newLayer);

        expect(layerStore.removeUsingOpenLayer).toHaveBeenCalledWith(oldLayer);
        expect(layerStore.addUsingOpenLayer).toHaveBeenCalledWith(newLayer);
    });
});

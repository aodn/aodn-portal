
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

    describe('applyFilters()', function() {
        var applyFiltersSpy1;
        var applyFiltersSpy2;

        beforeEach(function() {
            applyFiltersSpy1 = jasmine.createSpy('applyFilters1');
            applyFiltersSpy2 = jasmine.createSpy('applyFilters2');

            layerSelectionModel.layerCache = [
                {applyFilters: applyFiltersSpy1},
                {},
                {applyFilters: applyFiltersSpy2}
            ];

            layerAdapter.applyFilters();
        });

        it('calls applyFilters() where possible', function() {
            expect(applyFiltersSpy1.callCount).toBe(1);
            expect(applyFiltersSpy2.callCount).toBe(1);
        });
    });
});

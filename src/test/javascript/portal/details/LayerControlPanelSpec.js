describe("Portal.details.LayerControlPanel", function() {
    describe('layer select radio group', function() {

        var dataCollection;
        var layerControlPanel;
        var layers;
        var layerState;
        var selectedLayer;

        beforeEach(function() {
            layers = [
            ];

            layerState = {
                getLayers: returns(layers),
                getSelectedLayer: function() {
                    return selectedLayer;
                },
                setSelectedLayer: noOp
            };

            dataCollection = {
                getLayerState: returns(layerState)
            };

            layerControlPanel = new Portal.details.LayerControlPanel({
                dataCollection: dataCollection
            });
        });

        it('exists only when more than one layer', function() {

            expect(layerControlPanel._newLayerSelectorComponent()).toBe(undefined);

            layers.push('layer 1');
            expect(layerControlPanel._newLayerSelectorComponent()).toBe(undefined);

            layers.push('layer 2');
            expect(layerControlPanel._newLayerSelectorComponent()).toBeInstanceOf(Ext.form.RadioGroup);
        });

        it('contains one item for each layer', function() {
            addLayers();

            var layerSelectComponent = layerControlPanel._newLayerSelectorComponent();

            Ext.each(layers, function(layer, index) {
                expect(layerSelectComponent.items[index].boxLabel).toBe(layer.wmsName);
                expect(layerSelectComponent.items[index].checked).toBe(layer == selectedLayer);
            });
        });

        it('sets selected layer when selected', function() {
            spyOn(dataCollection.getLayerState(), 'setSelectedLayer');
            addLayers();

            var layerSelectComponent = layerControlPanel._newLayerSelectorComponent();

            layerSelectComponent.fireEvent('change', layerSelectComponent, layerSelectComponent.items[0]);
            expect(dataCollection.getLayerState().setSelectedLayer).toHaveBeenCalledWith(layers[0]);
        });

        var addLayers = function() {
            selectedLayer = {
                wmsName: 'selected layer'
            };
            layers.push(
                { wmsName: 'first layer' },
                selectedLayer,
                { wmsName: 'last layer' }
            );
        };
    });
});

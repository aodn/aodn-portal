describe("Portal.details.LayerControlPanel", function() {
    describe('layer select radio group', function() {

        var dataCollection;
        var layerControlPanel;
        var layers;
        var selectedLayer;

        beforeEach(function() {
            layers = [
            ];

            dataCollection = {
                getLayerState: function() {
                    return {
                        getLayers: returns(layers),
                        getSelectedLayer: returns(selectedLayer)
                    };
                }
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
            selectedLayer = {
                wmsName: 'selected layer'
            };

            layers.push(
                { wmsName: 'first layer' },
                selectedLayer,
                { wmsName: 'last layer' }
            );

            var layerSelectComponent = layerControlPanel._newLayerSelectorComponent();

            Ext.each(layers, function(layer, index) {
                expect(layerSelectComponent.items[index].boxLabel).toBe(layer.wmsName);
                expect(layerSelectComponent.items[index].checked).toBe(layer == selectedLayer);
            });
        });
    });
});

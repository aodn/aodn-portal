describe("Portal.details.LayerControlPanel", function() {

    var dataCollection;
    var layerControlPanel;
    var layers;
    var layerAdapter;
    var layerSelectionModel;
    var selectedLayer;

    beforeEach(function() {
        layers = [];

        layerAdapter = {
            isLoading: returns(false)
        };
        layerSelectionModel = {
            getLayers: returns(layers),
            getSelectedLayer: function() {
                return selectedLayer;
            },
            setSelectedLayer: noOp
        };

        dataCollection = {
            getTitle: returns('Data Collection Title'),
            getLayerAdapter: returns(layerAdapter),
            getLayerSelectionModel: returns(layerSelectionModel),
            getUuid: returns('1234'),
            bounds: true
        };

        spyOn(Portal.details.LayerControlPanel.prototype, '_getCollectionBounds').andCallFake(function() {
            return dataCollection.bounds;
        });

        layerControlPanel = new Portal.details.LayerControlPanel({
            dataCollection: dataCollection
        });
    });

    describe('layer select radio group', function() {
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
            spyOn(dataCollection.getLayerSelectionModel(), 'setSelectedLayer');
            spyOn(window, 'trackLayerControlUsage');
            addLayers();

            var layerSelectComponent = layerControlPanel._newLayerSelectorComponent();

            layerSelectComponent.fireEvent('change', layerSelectComponent, layerSelectComponent.items[0]);
            expect(window.trackLayerControlUsage).toHaveBeenCalledWith(
                'changeLayerTrackingAction',
                'Data Collection Title',
                'first layer'
            );
        });

        it('sends google analytics tracking information when selected', function() {
            spyOn(dataCollection.getLayerSelectionModel(), 'setSelectedLayer');
            addLayers();

            var layerSelectComponent = layerControlPanel._newLayerSelectorComponent();

            layerSelectComponent.fireEvent('change', layerSelectComponent, layerSelectComponent.items[0]);
            expect(dataCollection.getLayerSelectionModel().setSelectedLayer).toHaveBeenCalledWith(layers[0]);
        });

        it('sends google analytics tracking information when opacity changed', function() {
            spyOn(window, 'trackLayerControlUsage');

            layerControlPanel.opacitySlider.fireEvent('changecomplete', layerControlPanel.opacitySlider, '50');
            expect(window.trackLayerControlUsage).toHaveBeenCalledWith(
                OpenLayers.i18n('changeLayerTrackingActionOpacity'),
                '50',
                'Data Collection Title'
            );
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

    describe('zoom to layer control', function() {
        beforeEach(function() {
            spyOn(Portal.details.LayerControlPanel.prototype, '_newZoomToDataButton').andCallThrough();
        });

        it('exists only when collection has bounds', function() {
            dataCollection.bounds = true;
            layerControlPanel = new Portal.details.LayerControlPanel({
                dataCollection: dataCollection
            });
            expect(layerControlPanel._newZoomToDataButton).toHaveBeenCalled();
        });

        it("doesn't exist only when collection has bounds", function() {
            dataCollection.bounds = false;
            layerControlPanel = new Portal.details.LayerControlPanel({
                dataCollection: dataCollection
            });
            expect(layerControlPanel._newZoomToDataButton).not.toHaveBeenCalled();
        });

        it('calls through to map.zoomToExtent', function() {
            layerControlPanel.map = {
                zoomToExtent: jasmine.createSpy('zoomToExtent')
            };

            layerControlPanel._zoomToLayer();
            expect(layerControlPanel.map.zoomToExtent).toHaveBeenCalledWith(layerControlPanel._getCollectionBounds());
        });
    });
});

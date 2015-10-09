describe("Portal.ui.openlayers.LayerOptions", function() {

    var layerDescriptor;

    var layer = {
        isBaseLayer : true,
        projection : null,
        server : {
            wmsVersion : "1.1.1"
        }
    };

    it('testing setting of OpenLayers options', function() {
        layerDescriptor = new Portal.common.LayerDescriptor(layer);
        var options = new Portal.ui.openlayers.LayerOptions(layerDescriptor);
        expect(options.version).toEqual('1.1.1');
        expect(options.isBaseLayer).toBeTruthy();
        expect(options.opacity).toEqual(1);
        expect(options.projection).toEqual(new OpenLayers.Projection(null));
        expect(options.displayInLayerSwitcher).toBeTruthy();
    });

    it('testing setting of OpenLayers overlay layer options', function() {
        layer.isBaseLayer = false;
        layerDescriptor = new Portal.common.LayerDescriptor(layer);
        var options = new Portal.ui.openlayers.LayerOptions(layerDescriptor);
        expect(options.displayInLayerSwitcher).toBeFalsy();
    });
});

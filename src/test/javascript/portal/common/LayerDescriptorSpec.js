describe("Portal.common.LayerDescriptor", function() {

    it('from javascript object', function() {
        var layerDescAsDecodedJSON = {
            name: 'satellite',
            href: 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi'
        };

        var layerDesc = new Portal.common.LayerDescriptor(layerDescAsDecodedJSON);
        expect(layerDesc.name).toBe('satellite');
        expect(layerDesc.href).toBe('http://tilecache.emii.org.au/cgi-bin/tilecache.cgi');
    });

    describe('toOpenLayer', function() {

        var layerDesc;

        beforeEach(function() {
            layerDesc = new Portal.common.LayerDescriptor({
                href: 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi',
                "isBaseLayer": true,
                "server": {
                    "uri": "http://tilecache.emii.org.au/"
                }
            });
        });

        it('WMS layer', function() {
            var openLayer = layerDesc.toOpenLayer();

            expect(openLayer.isBaseLayer).toBe(true);
            expect(openLayer.url).toBe("http://tilecache.emii.org.au/cgi-bin/tilecache.cgi");
            expect(openLayer.opacity).toBe(1);
            expect(openLayer).toBeInstanceOf(OpenLayers.Layer.WMS);

            var openLayerWithOptionOverrides = layerDesc.toOpenLayer({ opacity: 2});
            expect(openLayerWithOptionOverrides.opacity).toBe(2);
        });
    });
});

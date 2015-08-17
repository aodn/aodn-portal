/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.common.LayerDescriptor", function() {

    it('from javascript object', function() {
        var layerDescAsDecodedJSON = {
            name: 'satellite',
            server: {
                uri: 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi'
            },
            cql: 'attr=123'
        };

        var layerDesc = new Portal.common.LayerDescriptor(layerDescAsDecodedJSON);
        expect(layerDesc.name).toBe('satellite');
        expect(layerDesc.server.uri).toBe('http://tilecache.emii.org.au/cgi-bin/tilecache.cgi');
        expect(layerDesc.cql).toBe('attr=123');
    });

    describe('toOpenLayer', function() {

        var layerDesc;

        beforeEach(function() {
            layerDesc = new Portal.common.LayerDescriptor({
                "isBaseLayer": true,
                "server": {
                    "uri": "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi"
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

    describe('_setOpenLayerBounds', function() {
        it('from dataCollection', function() {
            var openLayer = {};

            var dataCollection = {
                getMetadataRecord: returns({
                    data: { bbox: {
                        geometries: [],
                        getBounds: returns(new OpenLayers.Bounds(1,2,3,4))
                    }}
                })
            };

            var layerDescriptor = new Portal.common.LayerDescriptor({}, 'title', dataCollection);

            layerDescriptor._setOpenLayerBounds(openLayer);

            expect(openLayer.bboxMinX).toEqual(1);
            expect(openLayer.bboxMinY).toEqual(2);
            expect(openLayer.bboxMaxX).toEqual(3);
            expect(openLayer.bboxMaxY).toEqual(4);
        });
    });
});

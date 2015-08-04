/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.common.LayerDescriptor", function() {

    it('from string', function() {
        var layerDescAsString = "{name: 'satellite', server: { uri: 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi' } }";

        var layerDesc = new Portal.common.LayerDescriptor(layerDescAsString);

        expect(layerDesc.name).toBe('satellite');
        expect(layerDesc.server.uri).toBe('http://tilecache.emii.org.au/cgi-bin/tilecache.cgi');
    });

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

    it('tests underlying access to parent', function() {
        var layerDescriptor = new Portal.common.LayerDescriptor({
            title : 'test',
            parent : {
                id : 100,
                name : 'parent layer'
            }
        });

        expect(layerDescriptor._getParentId()).toEqual(100);
        expect(layerDescriptor._getParentName()).toEqual('parent layer');
        layerDescriptor.parent = undefined;
        expect(layerDescriptor._getParentId()).toBeFalsy();
        expect(layerDescriptor._getParentName()).toBeFalsy();
    });

    describe('zoom override', function() {

        var layerDesc = new Portal.common.LayerDescriptor({
            "isBaseLayer": true,
            "server": {
                "uri": "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi"
            }
        });

        it('no zoom override', function() {
            var openLayer = layerDesc.toOpenLayer();
            expect(openLayer.zoomOverride).toBeFalsy();
        });

        it('zoom override', function() {

            var centreLon = 12;
            var centreLat = 34;
            var zoomLevel = 5;

            layerDesc.viewParams = {
                centreLon: centreLon,
                centreLat: centreLat,
                openLayersZoomLevel: zoomLevel
            };

            var openLayer = layerDesc.toOpenLayer();
            expect(openLayer.zoomOverride).toBeTruthy();
            expect(openLayer.zoomOverride.centreLon).toEqual(centreLon);
            expect(openLayer.zoomOverride.centreLat).toEqual(centreLat);
            expect(openLayer.zoomOverride.openLayersZoomLevel).toEqual(zoomLevel);
        });
    });

    describe('_setOpenLayerBounds', function() {
        it('from geonetwork', function() {
            var openLayer = {};

            var geonetworkRecord = {
                data: {
                    bbox: {
                        geometries: [],
                        getBounds: returns(new OpenLayers.Bounds(1,2,3,4))
                    }
                }
            };

            var layerDescriptor = new Portal.common.LayerDescriptor({}, 'title', geonetworkRecord);

            layerDescriptor._setOpenLayerBounds(openLayer);

            expect(openLayer.bboxMinX).toEqual(1);
            expect(openLayer.bboxMinY).toEqual(2);
            expect(openLayer.bboxMaxX).toEqual(3);
            expect(openLayer.bboxMaxY).toEqual(4);
        });
    });

    describe('_initialiseDownloadLayer', function() {

        var openLayer;
        var descriptor;

        beforeEach(function() {

            openLayer = {
                wmsName: 'aodn:other_layer'
            };
            descriptor = new Portal.common.LayerDescriptor({
                dataCollection: {
                    getMetadataRecord: function() {
                        return {data: {}};
                    }
                }
            });
        });

        it('uses a data layer if present', function() {

            spyOn(descriptor, '_findFirst').andReturn('imos:data_layer_name');

            descriptor._initialiseDownloadLayer(openLayer);

            expect(openLayer.getDownloadLayer()).toBe('imos:data_layer_name');
        });

        it('falls back to a map layer', function() {

            var isFirstCall = true;

            spyOn(descriptor, '_findFirst').andCallFake(function() {

                if (!isFirstCall) {
                    return 'imos:map_layer_name';
                }

                isFirstCall = false;
            });

            descriptor._initialiseDownloadLayer(openLayer);

            expect(openLayer.getDownloadLayer()).toBe('imos:map_layer_name');
        });

        it('falls back to current layer workspace', function() {

            spyOn(descriptor, '_findFirst').andReturn('data_layer_name');

            descriptor._initialiseDownloadLayer(openLayer);

            expect(openLayer.getDownloadLayer()).toBe('aodn:data_layer_name');
        });
     });
});

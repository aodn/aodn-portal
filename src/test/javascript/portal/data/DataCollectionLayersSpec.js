/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollectionLayersSpec", function() {

    var dataCollection;
    var dataCollectionLayers;
    var linkRecords;

    beforeEach(function() {

        var linkRecordReader = new Ext.data.JsonReader({
            root: 'rows',
            fields : [
                {
                    name : 'url',
                    mapping : 'href'
                },
                {
                    name : 'name'
                },
                {
                    name : 'protocol'
                },
                {
                    name : 'title',
                    convert : this._getTitle
                },
                {
                    name : 'type'
                }
            ]
        });

        linkRecords = linkRecordReader.readRecords({
            'rows': [
                {
                    name: 'imos:name_1',
                    protocol: 'OGC:WMS-1.1.1-http-get-map',
                    uri: 'http://geoserver-rc.aodn.org.au/geoserver/wms',
                    title: 'Layer 1'
                },
                {
                    name: 'imos:name_2',
                    protocol: 'OGC:WMS-1.1.1-http-get-map',
                    type: 'WMS-1.1.1',
                    uri: 'http://geoserver-rc.aodn.org.au/geoserver/wms',
                    title: 'Layer 2'
                }
            ]
        }).records;

        dataCollection = {
            getWmsLayerLinks: returns(linkRecords),
            get: returns('name')
        };

        dataCollectionLayers = new Portal.data.DataCollectionLayers({
            dataCollection: dataCollection
        });
    });

    describe('getLayers', function() {
        it('returns all wms layers as openlayers', function() {
            var layers = dataCollectionLayers.getLayers();
            expect(layers.length).toBe(2);
            expect(layers[0]).toBeInstanceOf(OpenLayers.Layer.WMS);
        });

        it('caches layers', function() {
            spyOn(dataCollectionLayers, '_linkToOpenLayer').andCallThrough();

            dataCollectionLayers.getLayers();
            expect(dataCollectionLayers._linkToOpenLayer.callCount).toEqual(0);
        });
    });

    describe('selected layer', function() {
        var layer;
        var layerLink;

        beforeEach(function() {
            layer = {};
            layerLink = {};
        });

        it('returns selected layer', function() {
            dataCollectionLayers.selectedLayer = layer;
            expect(dataCollectionLayers.getSelectedLayer()).toBe(layer);
        });

        it('selects default layer', function() {
            spyOn(dataCollectionLayers, 'getDefaultLayer').andReturn(layer);
            // spyOn(dataCollectionLayers, '_getLayerByLink').andReturn(layer);

            expect(dataCollectionLayers.getSelectedLayer()).toBe(layer);
            expect(dataCollectionLayers.getDefaultLayer).toHaveBeenCalled();
            // expect(dataCollectionLayers._getLayerByLink).toHaveBeenCalledWith(layerLink);
        });

        it('fires event when layer selected', function() {
            var oldLayer = {};
            var newLayer = {};
            var selectedLayerChangedListener = jasmine.createSpy('selectedLayerChangedListener');
            dataCollectionLayers.selectedLayer = oldLayer;
            dataCollectionLayers.on('selectedlayerchanged', selectedLayerChangedListener);

            dataCollectionLayers.setSelectedLayer(newLayer);

            expect(selectedLayerChangedListener).toHaveBeenCalledWith(newLayer);
        });
    });
});

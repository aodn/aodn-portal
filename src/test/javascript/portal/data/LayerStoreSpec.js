describe("Portal.data.LayerStore", function() {

    var layerStore;

    // Can layerDescriptor/layerLink be unified?
    var layerDescriptor = new Portal.common.LayerDescriptor({
        title : 'test',
        server: {
            uri: "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi"
        }
    });

    var layerLink = {
        title: "imos:detection_count_per_station_mv",
        server: {
            uri: "http://geoserver.imos.org.au/geoserver/wms"
        },
        name: "imos:detection_count_per_station_mv",
        protocol: "OGC:WMS-1.1.1-http-get-map"
    };

    beforeEach(function() {
        layerStore = new Portal.data.LayerStore();
        expect(layerStore.getCount()).toBe(0);
    });

    afterEach(function() {
        layerStore.destroy();
    });

    var createOpenLayer = function(title, url, dataLayer) {

        return new OpenLayers.Layer.WMS(
            title || "the title",
            url || "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
            {},
            {
                isBaseLayer: false,
                isDataLayer: (dataLayer === true) ? dataLayer : false
                }
        );
    };

    it('add layer descriptor', function() {
        layerStore._addUsingDescriptor(layerDescriptor);
        expect(layerStore.getCount()).toBe(1);
    });

    describe('_addUsingDescriptor', function() {
        describe('layer record callback', function() {
            var layerDescriptor;

            beforeEach(function() {

                var dataCollection = {
                    getMetadataRecord: returns({
                        data: { bbox: {
                            getBounds: returns({})
                        }}
                    })
                };

                layerDescriptor = new Portal.common.LayerDescriptor(
                    layerLink, 'title', dataCollection, OpenLayers.Layer.WMS
                );
            });

            it('no callback', function() {
                layerStore._addUsingDescriptor(layerDescriptor);
            });

            it('callback', function() {
                var callback = jasmine.createSpy('callback');

                layerStore._addUsingDescriptor(layerDescriptor, callback);
                expect(callback).toHaveBeenCalled();
                expect(callback.mostRecentCall.args[0]).toBeInstanceOf(GeoExt.data.LayerRecord);
            });
        });
    });

    describe('adding layers', function() {
        it('add open layer', function() {
            layerStore._addLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(1);
        });

        it('add duplicate layer', function() {
            layerStore._addLayer(createOpenLayer());
            layerStore._addLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(2);
        });

        it('addLayerUsingDescriptor', function() {
            expect(layerStore.getCount()).toBe(0);
            layerStore._addUsingDescriptor(layerDescriptor);
            expect(layerStore.getCount()).toBe(1);
        });

        it('addLayerUsingOpenLayer', function() {
            expect(layerStore.getCount()).toBe(0);
            layerStore._addLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(1);
        });

        it('addLayerUsingOpenLayer base layer', function() {

            var openLayer = createOpenLayer();
            openLayer.options.isBaseLayer = true;

            expect(layerStore.getCount()).toBe(0);
            layerStore._addLayer(openLayer);
            expect(layerStore.getCount()).toBe(1);
        });
    });

    describe('layers loaded automatically on construction', function() {

        beforeEach(function() {

            spyOn(Ext.Ajax, 'request');
        });

        it('base layers', function() {
            layerStore._initConfigLayers();

            var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
            expect(ajaxParams.url).toBe('layer/configuredLayers');
        });
    });

    describe('removing layers', function() {

        describe('remove open layer', function() {

            var openLayer;

            beforeEach(function() {
                spyOn(Ext.MsgBus, 'publish');
                openLayer = createOpenLayer();
                layerStore._addLayer(openLayer);
            });

            it('one less layer in store', function() {
                expect(layerStore.getCount()).toBe(1);
                layerStore.removeUsingOpenLayer(openLayer);
                expect(layerStore.getCount()).toBe(0);
            });
        });
    });

    describe('clearing changes', function() {
        it('clears changes', function() {
            layerStore._addLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(1);

            spyOn(layerStore, 'selectDefaultBaseLayer');
            spyOn(layerStore, '_hideDataLayers');

            layerStore._clearChanges();

            expect(layerStore.getCount()).toBe(0);
            expect(layerStore.selectDefaultBaseLayer).toHaveBeenCalled();
            expect(layerStore._hideDataLayers).toHaveBeenCalled();
        });
    })

    describe('getLayers', function() {

        beforeEach(function() {
            // Non-base layers
            var l1 = createOpenLayer("1");
            layerStore._addLayer(l1);

            var l2 = createOpenLayer("2");
            l2.options.isBaseLayer = undefined; // Happens with layers added from search
            layerStore._addLayer(l2);

            // Base layer
            var l3 = createOpenLayer("base");
            l3.options.isBaseLayer = true;
            layerStore._addLayer(l3);

            // Vector layer
            var vectorLayer = new OpenLayers.Layer.Vector();
            layerStore._addLayer(vectorLayer);
        });

        it('get base layers', function() {
            expect(layerStore.getBaseLayers().getCount()).toBe(1);
        });

        it('get overlay layers', function() {
            expect(layerStore.getCollectionLayers().getCount()).toBe(2);
        });
    });

    describe('base layers', function() {

        var baseLayer;
        var baseLayerRecord;

        beforeEach(function() {
            baseLayer = createOpenLayer("base");
            baseLayer.options.isBaseLayer = true;
            baseLayerRecord = layerStore._addLayer(baseLayer);
        });

        it('selectDefaultBaseLayer', function() {
            spyOn(Ext.MsgBus, 'publish');

            layerStore.selectDefaultBaseLayer();
            expect(Ext.MsgBus.publish).toHaveBeenCalledWith(PORTAL_EVENTS.BASE_LAYER_CHANGED, baseLayer);
        });

        it('getDefaultBaseLayer', function() {
            expect(layerStore.getDefaultBaseLayer()).toBe(baseLayerRecord);
        });
    });

    describe('data collection events', function() {
        var dataCollection;

        beforeEach(function() {
            dataCollection = {
                getLayerSelectionModel: returns({
                    getSelectedLayer: noOp
                })
            };

            spyOn(layerStore, '_selectedLayerChanged');
        });

        Ext.each([PORTAL_EVENTS.DATA_COLLECTION_ADDED, PORTAL_EVENTS.DATA_COLLECTION_SELECTED], function(eventName) {
            it('handles selected layer on ' + eventName, function() {
                var selectedLayer = {};

                dataCollection.getLayerSelectionModel().getSelectedLayer = returns(selectedLayer);
                Ext.MsgBus.publish(eventName, dataCollection);

                expect(layerStore._selectedLayerChanged).toHaveBeenCalledWith(selectedLayer);
            });
        });
    });

    describe('_selectedLayerChanged', function() {

        var layer1 = layerWithId(1);
        var layer2 = layerWithId(2);
        var layer4 = layerWithId(4);

        beforeEach(function() {
            layerStore._addLayer(layer1);
            layerStore._addLayer(layer2);
            layerStore._addLayer(layerWithId(3, true)); // (single) dataLayer remains on top
            layerStore._addLayer(layer4);
        });

        it('moves selected layer to the top of non dataLayers', function() {

            layerStore._selectedLayerChanged(layer1);
            layerStore._selectedLayerChanged(layer2);

            expect(layerStore.data.length).toBe(4);
            expect(layerIds(layerStore)).toEqual([4, 1, 2, 3]); // The end of the array represents the top of the layer stack
        });

        it('handles layers that are not found', function() {

            layerStore._selectedLayerChanged(layerWithId(6));

            expect(layerStore.data.length).toBe(4);
            expect(layerIds(layerStore)).toEqual([1, 2, 4, 3]);
        });

        function layerWithId(id, dataLayer) {
            var layer = createOpenLayer('' + id, "aUrl",  dataLayer);
            layer.id = id;
            return layer;
        }

        function layerIds(layerStore) {
            var ids = [];

            Ext.each(layerStore.data.items, function(record) {
                ids.push(record.data.layer.id);
            });

            return ids;
        }
    });
});

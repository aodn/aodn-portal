
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.LayerStore", function() {

    var layerStore;

    // Can layerDescriptor/layerLink be unified?
    var layerDescriptor = new Portal.common.LayerDescriptor({
        title : 'test',
        server: {
            type: "WMS-1.1.1",
            uri: "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi"
        }
    });

    var layerLink = {
        title: "imos:detection_count_per_station_mv",
        server: {
            type: "WMS-1.1.1",
            uri: "http://geoserver.imos.org.au/geoserver/wms"
        },
        name: "imos:detection_count_per_station_mv",
        protocol: "OGC:WMS-1.1.1-http-get-map"
    };

    beforeEach(function() {
        layerStore = new Portal.data.LayerStore();
        expect(layerStore.getCount()).toBe(0);
    });

    var createOpenLayer = function(title, url) {

        if (title == undefined) {

            title = "the title";
        }

        if (url == undefined) {

            url = "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi";
        }

        return new OpenLayers.Layer.WMS(
            title,
            url,
            {},
            { isBaseLayer: false }
        );
    };

    it('add layer descriptor', function() {
        layerStore.addUsingDescriptor(layerDescriptor);
        expect(layerStore.getCount()).toBe(1);
    });

    describe('addUsingLayerLink', function() {
        describe('blocked server', function() {
            beforeEach(function() {
                spyOn(layerStore, '_serverUnrecognized').andCallFake(function() {});
                layerLink = {
                    title: "imos:detection_count_per_station_mv",
                    server: {
                        type: "WMS-1.1.1",
                        uri: "http://geoserver.imos.org.au/geoserver/wms"
                    },
                    name: "imos:detection_count_per_station_mv",
                    protocol: "OGC:WMS-1.1.1-http-get-map"
                };
                geonetworkRecord = {id: "blagh"};
                layerRecordCallback = function(){};
            });

            it('empty response', function() {
                spyOn(Ext.Ajax, 'request').andCallFake(function(options) {
                    options.success.call(layerStore, { responseText: Ext.util.JSON.encode({}) });
                });

                layerStore.addUsingLayerLink("layerName", layerLink, geonetworkRecord, layerRecordCallback);

                expect(layerStore._serverUnrecognized).toHaveBeenCalled();
                expect(layerStore.geonetworkRecord).toEqual(undefined);
                expect(layerStore.layerRecordCallback).toEqual(undefined);
            });

            it('failure', function() {
                spyOn(Ext.Ajax, 'request').andCallFake(function(options) {
                    options.failure.call(layerStore, { responseText: Ext.util.JSON.encode({}) });
                });
                layerStore.addUsingLayerLink("layerName", layerLink);

                expect(layerStore._serverUnrecognized).toHaveBeenCalled();
            });
        });

        it('GeoServer', function() {
            spyOn(Ext.Ajax, 'request').andCallFake(function(options) {
                options.success.call(layerStore, { responseText: Ext.util.JSON.encode({ type: 'GeoServer' }) });
            });
            spyOn(layerStore, '_addUsingLayerLinkDefault').andCallFake(function() {});

            layerStore.addUsingLayerLink("layerName", layerLink);

            expect(layerStore._addUsingLayerLinkDefault).toHaveBeenCalled();
        });

        it('ncwms', function() {
            spyOn(Ext.Ajax, 'request').andCallFake(function(options) {
                options.success.call(layerStore, { responseText: Ext.util.JSON.encode({ type: 'ncwms' }) });
            });
            spyOn(layerStore, '_addUsingLayerLinkNcwms').andCallFake(function() {});

            layerStore.addUsingLayerLink("layerName", layerLink);

            expect(layerStore._addUsingLayerLinkNcwms).toHaveBeenCalled();
        });
    });

    describe('_addUsingLayerLinkDefault', function() {
        describe('layer record callback', function() {
            it('no callback', function() {
                layerStore._addUsingLayerLinkDefault("layerName", layerLink);
            });

            it('callback', function() {
                var callback = jasmine.createSpy('callback');
                spyOn(Ext.Ajax, 'request').andCallFake(function(params) {
                    layerStore.failure = params.failure;
                    layerStore.failure();  // This is the easiest way to mock things (rather than calling success).
                });

                layerStore._addUsingLayerLinkDefault("layerName", layerLink, {}, callback);
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
            spyOn(Ext.Msg, "alert");
            layerStore._addLayer(createOpenLayer());
            layerStore._addLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(1);
            expect(Ext.Msg.alert).toHaveBeenCalled();
        });

        it('addLayerUsingDescriptor', function() {
            expect(layerStore.getCount()).toBe(0);
            layerStore.addUsingDescriptor(layerDescriptor);
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
            spyOn(Ext.MsgBus, 'publish').andCallThrough();

            expect(layerStore.getCount()).toBe(0);
            layerStore._addLayer(openLayer);
            expect(layerStore.getCount()).toBe(1);
            expect(Ext.MsgBus.publish).not.toHaveBeenCalledWith(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
        });
    });

    describe('layers loaded automatically on construction', function() {

        beforeEach(function() {

            spyOn(Ext.Ajax, 'request');
        });

        it('base layers', function() {
            layerStore._initBaseLayers();

            var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
            expect(ajaxParams.url).toBe('layer/configuredBaselayers');
        });
    });

    describe('removing layers', function() {

        describe('remove open layer', function() {

            var openLayer;

            beforeEach(function() {
                spyOn(Ext.MsgBus, 'publish');
                openLayer = createOpenLayer();
                layerStore._addLayer(openLayer);
                openLayer.loading = false;
            });

            it('one less layer in store', function() {
                expect(layerStore.getCount()).toBe(1);
                layerStore.removeUsingOpenLayer(openLayer);
                expect(layerStore.getCount()).toBe(0);
            });

            it('layerRemoved event published', function() {
                layerStore.removeUsingOpenLayer(openLayer);
                expect(Ext.MsgBus.publish).toHaveBeenCalledWith(PORTAL_EVENTS.LAYER_REMOVED, openLayer);
            });
        });

        it('removeAll', function() {
            spyOn(layerStore, 'remove');
            layerStore.removeAll();

            expect(layerStore.remove).toHaveBeenCalled();
        });

        it('reset', function() {
            layerStore._addLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(1);


            spyOn(layerStore, 'selectDefaultBaseLayer');
            layerStore.removeAll();

            expect(layerStore.selectDefaultBaseLayer).toHaveBeenCalled();
        });
    });

    describe('containsOpenLayer', function() {
        it('returns false with duplicate names if layerHierarchy are different', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();

            layer1.layerHierarchyPath = "this/is/hierarchy";
            layer2.layerHierarchyPath = "this/is/also/hierarchy";

            layerStore._addLayer(layer1);
            expect(layerStore.containsOpenLayer(layer2)).toBeFalsy();
        });

        it('returns true with duplicate names if layerHierarchy are nonexistant', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();

            layerStore._addLayer(layer1);
            expect(layerStore.containsOpenLayer(layer2)).toBeTruthy();
        });

        it('returns true with duplicate layerHierarchies ', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();
            layerStore._addLayer(createOpenLayer());
            layer1.layerHierarchyPath = "this/is/hierarchy";
            layer2.layerHierarchyPath = "this/is/hierarchy";


            layerStore._addLayer(layer1);
            expect(layerStore.containsOpenLayer(layer2)).toBeTruthy();
        });
    });

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
            expect(layerStore.getOverlayLayers().getCount()).toBe(2);
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

    describe('loading attribute', function() {

        var layer;

        beforeEach(function() {
            layer = createOpenLayer("somelayer");
            layer.options.isBaseLayer = false;
            baseLayerRecord = layerStore._addLayer(layer);
        });

        it('sets loading=true on loadstart', function() {
            layer.events.triggerEvent("loadstart");
            expect(layer.loading).toEqual(true);
        });

        it('sets loading=false on loadend', function() {
            layer.events.triggerEvent("loadend");
            expect(layer.loading).toEqual(false);
        });
    });
});

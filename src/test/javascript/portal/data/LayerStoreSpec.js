
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
            uri: "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi"
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

    function createOpenLayer(title, url) {

        if(title == undefined)
        {
            title = "the title";
        }

        if(url == undefined)
        {
            url = "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi";
        }

        return new OpenLayers.Layer.WMS(
            title,
            url,
            {},
            { isBaseLayer: false }
        );
    }

    it('add layer descriptor', function() {


        layerStore.addUsingDescriptor(layerDescriptor);
        expect(layerStore.getCount()).toBe(1);
    });

    // The search results deal with "layer links"...
    describe('add layer link', function() {

        it('success', function() {

            spyOn(Ext.Ajax, 'request').andCallFake(function(options) {
                options.success.call(layerStore, { responseText: Ext.util.JSON.encode(layerDescriptor) });
            })

            layerStore.addUsingLayerLink(layerLink);

            expect(Ext.Ajax.request).toHaveBeenCalled();
            expect(layerStore.getCount()).toBe(1);
        });

        it('failure', function() {

            spyOn(Ext.Ajax, 'request').andCallFake(function(options) {
                options.failure.call(layerStore, {});
            })

            spyOn(layerStore, 'addUsingDescriptor').andCallThrough();

            layerStore.addUsingLayerLink(layerLink);

            expect(Ext.Ajax.request).toHaveBeenCalled();
            expect(layerStore.addUsingDescriptor).toHaveBeenCalled();
            expect(layerStore.getCount()).toBe(1);
        });
    });

    // add open layer
    it('add open layer', function() {

        layerStore.addUsingOpenLayer(createOpenLayer());
        expect(layerStore.getCount()).toBe(1);
    });

    it('add duplicate layer', function() {
        spyOn(Ext.Msg, "alert");

        layerStore.addUsingOpenLayer(createOpenLayer());
        layerStore.addUsingOpenLayer(createOpenLayer());
        expect(layerStore.getCount()).toBe(1);
        expect(Ext.Msg.alert).toHaveBeenCalled();
    });

    describe('layer related events', function() {

        it('addLayerUsingDescriptor', function() {

            spyOn(layerStore, 'addUsingDescriptor').andCallThrough();
            expect(layerStore.getCount()).toBe(0);
            Ext.MsgBus.publish('addLayerUsingDescriptor', layerDescriptor);
            expect(layerStore.addUsingDescriptor).toHaveBeenCalledWith(layerDescriptor);
            expect(layerStore.getCount()).toBe(1);
        });

        it('addLayerUsingLayerLink', function() {

            spyOn(layerStore, 'addUsingLayerLink');
            Ext.MsgBus.publish('addLayerUsingLayerLink', layerLink);
            expect(layerStore.addUsingLayerLink).toHaveBeenCalledWith(layerLink);
        });

        it('addLayerUsingOpenLayer', function() {

            var openLayer = createOpenLayer();

            spyOn(layerStore, 'addUsingOpenLayer').andCallThrough();
            spyOn(Ext.MsgBus, 'publish').andCallThrough();

            expect(layerStore.getCount()).toBe(0);
            Ext.MsgBus.publish('addLayerUsingOpenLayer', openLayer);
            expect(layerStore.getCount()).toBe(1);
            expect(layerStore.addUsingOpenLayer).toHaveBeenCalledWith(openLayer);
            expect(Ext.MsgBus.publish).toHaveBeenCalled();
        });

        it('addLayerUsingOpenLayer base layer', function() {

            var openLayer = createOpenLayer();
            openLayer.options.isBaseLayer = true;

            spyOn(layerStore, 'addUsingOpenLayer').andCallThrough();
            spyOn(Ext.MsgBus, 'publish').andCallThrough();

            expect(layerStore.getCount()).toBe(0);
            Ext.MsgBus.publish('addLayerUsingOpenLayer', openLayer);
            expect(layerStore.getCount()).toBe(1);
            expect(layerStore.addUsingOpenLayer).toHaveBeenCalledWith(openLayer);
            expect(Ext.MsgBus.publish).not.toHaveBeenCalledWith('selectedLayerChanged');
        });

        it('removeLayerUsingOpenLayer', function() {

            var openLayer = createOpenLayer();
            layerStore.addUsingOpenLayer(openLayer);

            spyOn(layerStore, 'removeUsingOpenLayer').andCallThrough();
            expect(layerStore.getCount()).toBe(1);
            Ext.MsgBus.publish('removeLayerUsingOpenLayer', openLayer);
            expect(layerStore.removeUsingOpenLayer).toHaveBeenCalledWith(openLayer);
            expect(layerStore.getCount()).toBe(0);
        })
    });

    describe('layers loaded automatically on construction', function() {

        var requestParams;

        beforeEach(function() {

            spyOn(Ext.Ajax, 'request');
        });

        it('base layers', function() {
            layerStore._initBaseLayers();

            var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
            expect(ajaxParams.url).toBe('layer/configuredbaselayers');
        });

        it('default layers', function() {
            layerStore._initDefaultLayers();

            var ajaxParams = Ext.Ajax.request.mostRecentCall.args[0];
            expect(ajaxParams.url).toBe('layer/defaultlayers');
        });
    });

    describe('removing layers', function() {

        it('remove open layer', function() {

            var openLayer = createOpenLayer();
            layerStore.addUsingOpenLayer(openLayer);
            expect(layerStore.getCount()).toBe(1);

            layerStore.removeUsingOpenLayer(openLayer);
            expect(layerStore.getCount()).toBe(0);
        });

        it('remove open layer via message', function() {
            var openLayer = createOpenLayer();
            layerStore.addUsingOpenLayer(openLayer);
            expect(layerStore.getCount()).toBe(1);

            Ext.MsgBus.publish('removeLayer', openLayer);
            expect(layerStore.getCount()).toBe(0);
        });

        // I question whether we need both 'reset' and 'remove all layers', as the only difference
        // is that 'reset' resets the zoom and extent (so why not just get rid of 'remove all layers'?).
        it('removeAll', function() {
            var openLayer = createOpenLayer();
            layerStore.addUsingOpenLayer(openLayer);
            var baseLayer = createOpenLayer("2");
            baseLayer.options.isBaseLayer = true;
            layerStore.addUsingOpenLayer(baseLayer);

            expect(layerStore.getCount()).toBe(2);

            spyOn(layerStore, 'removeAll').andCallThrough();
            Ext.MsgBus.publish('removeAllLayers');

            expect(layerStore.removeAll).toHaveBeenCalled();
            expect(layerStore.getCount()).toBe(1);
        });

        it('reset', function() {
            layerStore.addUsingOpenLayer(createOpenLayer());
            expect(layerStore.getCount()).toBe(1);

            spyOn(layerStore, 'removeAll').andCallThrough();
            Ext.MsgBus.publish('reset');

            expect(layerStore.removeAll).toHaveBeenCalled();
            expect(layerStore.getCount()).toBe(0);
        });
    });

    describe('containsOpenLayer', function() {
        it('returns false with duplicate names if layerHierarchy are different', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();

            layer1.layerHierarchyPath = "this/is/hierarchy";
            layer2.layerHierarchyPath = "this/is/also/hierarchy";

            layerStore.addUsingOpenLayer(layer1);
            expect(layerStore.containsOpenLayer(layer2)).toBeFalsy();
        });

        it('returns true with duplicate names if layerHierarchy are nonexistant', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();

            layerStore.addUsingOpenLayer(layer1);
            expect(layerStore.containsOpenLayer(layer2)).toBeTruthy();
        });

        it('returns true with duplicate layerHierarchies ', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();
            layerStore.addUsingOpenLayer(createOpenLayer());
            layer1.layerHierarchyPath = "this/is/hierarchy";
            layer2.layerHierarchyPath = "this/is/hierarchy";


            layerStore.addUsingOpenLayer(layer1);
            expect(layerStore.containsOpenLayer(layer2)).toBeTruthy();
        });
    });
});

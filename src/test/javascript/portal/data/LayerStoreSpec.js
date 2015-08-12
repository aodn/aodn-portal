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
        var layerRecordCallback = noOp;
        var dataCollection = {
            get: returns('name')
        };
        var openLayer = {};

        beforeEach(function() {
            spyOn(layerStore, 'addUsingDescriptor');
            spyOn(layerStore, '_linkToOpenLayer').andReturn(openLayer);
            spyOn(layerStore, '_addLayer');
        });

        it('Unknown', function() {
            layerStore.addUsingLayerLink(layerLink, dataCollection, layerRecordCallback);
            expect(layerStore._addLayer).toHaveBeenCalledWith(
                openLayer,
                layerRecordCallback
            );
        });

        it('GeoServer', function() {
            layerStore.addUsingLayerLink(layerLink, dataCollection, layerRecordCallback);
            expect(layerStore._addLayer).toHaveBeenCalledWith(
                openLayer,
                layerRecordCallback
            );
        });
    });

    describe('addUsingDescriptor', function() {
        describe('layer record callback', function() {
            var layerDescriptor;

            beforeEach(function() {

                var dataCollection = {
                    getMetadataRecord: function() {
                        return {
                            data: {
                                bbox: {
                                    getBounds: function() {
                                        return {};
                                    }
                                }
                            }
                        };
                    }
                };

                layerDescriptor = new Portal.common.LayerDescriptor(
                    layerLink, 'title', dataCollection, OpenLayers.Layer.WMS
                );
            });

            it('no callback', function() {
                layerStore.addUsingDescriptor(layerDescriptor);
            });

            it('callback', function() {
                var callback = jasmine.createSpy('callback');

                layerStore.addUsingDescriptor(layerDescriptor, callback);
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
            });

            it('one less layer in store', function() {
                expect(layerStore.getCount()).toBe(1);
                layerStore.removeUsingOpenLayer(openLayer);
                expect(layerStore.getCount()).toBe(0);
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
        it('returns true with duplicate names', function() {
            var layer1 = createOpenLayer();
            var layer2 = createOpenLayer();

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

    describe('_selectedLayerChanged', function() {

        beforeEach(function() {
            layerStore._addLayer(layerWithId(1));
            layerStore._addLayer(layerWithId(2));
            layerStore._addLayer(layerWithId(3));
        });

        it('moves selected layer to the top', function() {

            layerStore._selectedLayerChanged('', layerWithId(2));

            expect(layerStore.data.length).toBe(3);
            expect(layerIds(layerStore)).toEqual([1, 3, 2]); // The end of the array represents the top of the layer stack
        });

        it('handles layers that are not found', function() {

            layerStore._selectedLayerChanged('', layerWithId(4));

            expect(layerStore.data.length).toBe(3);
            expect(layerIds(layerStore)).toEqual([1, 2, 3]);
        });

        function layerWithId(id) {
            var layer = createOpenLayer('' + id);
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
